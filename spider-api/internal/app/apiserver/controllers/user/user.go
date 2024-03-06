package user

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/cache"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"k8s.io/klog/v2"
	"time"
)

type LoginForm struct {
	Username string `validate:"required" json:"username"`
	Password string `validate:"required" json:"password"`
}

func Login(ctx echo.Context) error {
	var payload LoginForm
	err := ctx.Bind(&payload)
	if err != nil {
		return base.BadRequestResponse(ctx, "")
	}

	validate := validator.New()
	if err = validate.Struct(&payload); err != nil {
		return base.ErrorResponse(ctx, base.HTTP400Code, err.Error())
	}

	user, err := models.UserModel.Login(payload.Username, payload.Password)
	if err != nil || user.Id == 0 {
		return base.ErrorResponse(ctx, 401, base.UserAccountError)
	}

	expireTime, err := parsers.ParseDuration(config.ApiServerConfig().Cookie.Expires)
	if err != nil {
		return base.ServerInternalErrorResponse(ctx, err.Error())
	}

	if !user.IsActive {
		return base.ForbiddenResponse(ctx)
	}

	timestamp := time.Now().Unix()
	uuid := util.GenUUID()
	cookieValue := fmt.Sprintf("%s_%d", uuid, timestamp)

	key := cache.GenerateUserLoginKey(cookieValue)
	value := user.UserId

	if err = cache.Set(key, value, expireTime); err != nil {
		return base.ServerInternalErrorResponse(ctx, err.Error())
	}

	auditLogin := &models.AuditLogin{
		Username: user.Username,
		Datetime: time.Now(),
		Type:     1,
	}

	if err = models.OrmDB().Create(auditLogin).Error; err != nil {
		klog.Errorf("record user login audit fail: %s", err.Error())
	}

	r := &LoginResponseContent{
		Value:      cookieValue,
		ExpireTime: config.ApiServerConfig().Cookie.Expires,
	}

	return base.SuccessResponse(ctx, r)
}

func Logout(ctx echo.Context) error {
	cc := ctx.(*base.Context)
	user, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(ctx)
	}

	key, err := cc.GetUserLoginKey()
	if err != nil {
		return base.UnauthorizedResponse(ctx)
	}

	if err = cache.Delete(key); err != nil {
		klog.Errorf("username: %s logout fail: %s", user.Username, err.Error())
	}

	auditLogin := &models.AuditLogin{
		Username: user.Username,
		Datetime: time.Now(),
		Type:     2,
	}

	if err = models.OrmDB().Create(auditLogin).Error; err != nil {
		klog.Errorf("record user login audit fail: %s", err.Error())
	}
	return base.SuccessNoContentResponse(ctx)
}

func CurrentUserInfo(c echo.Context) error {
	cc := c.(*base.Context)
	userInfo, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(c)
	}
	return base.SuccessResponse(c, userInfo)
}

func List(c echo.Context) error {
	userSerializer := NewSerializer()
	baseSerializer := base.NewSerializersManager(c, userSerializer)
	response, err := baseSerializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, response)
}

func Create(c echo.Context) error {
	var payload forms.UserCreateForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	user, _ := models.UserModel.GetByUsername(payload.Username)

	if user.Id > 0 {
		return base.ErrorResponse(c, 400, "user already exists")
	}

	if payload.GroupId > 0 {
		group, err := models.GroupModel.GetById(payload.GroupId)
		if err != nil || group.Id == 0 {
			return base.ErrorResponse(c, 400, err.Error())
		}
	}

	m := &models.User{
		UserId:   util.GenUUID(),
		Username: payload.Username,
		Password: models.UserModel.EncodeRawPassword(payload.Password),
		Photo:    config.ApiServerConfig().Common.UserPhotoPath,
		Name:     payload.Name,
		Email:    payload.Email,
		GroupId:  payload.GroupId,
		IsAdmin:  payload.IsAdmin,
		IsActive: payload.IsActive,
	}

	if err := models.UserModel.Add(m); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, m)
}

func Update(c echo.Context) error {
	userId := c.Param("userId")
	if len(userId) == 0 {
		return base.BadRequestResponse(c, "")
	}

	user, err := models.UserModel.GetByUserId(userId)
	if err != nil || user.Id == 0 {
		return base.BadRequestResponse(c, "")
	}

	var payload forms.UserUpdateForm
	valid := base.NewValidator(c)
	if err = valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	cond := map[string]interface{}{
		"is_admin":  payload.IsAdmin,
		"is_active": payload.IsActive,
		"group_id":  payload.GroupId,
	}

	if payload.GroupId > 0 {
		group, err := models.GroupModel.GetById(payload.GroupId)
		if err != nil || group.Id == 0 {
			return base.ErrorResponse(c, 400, err.Error())
		}
		user.Group = group
	}
	if user.Password != payload.Password {
		user.Password = models.UserModel.EncodeRawPassword(payload.Password)
		cond["password"] = models.UserModel.EncodeRawPassword(payload.Password)
	}

	if err = models.Orm.Updates(user, cond, user.Username); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	return base.SuccessResponse(c, user)
}

func Delete(c echo.Context) error {
	userId := c.Param("userId")
	if len(userId) == 0 {
		return base.BadRequestResponse(c, "")
	}

	user, err := models.UserModel.GetByUserId(userId)
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	errs := models.UserModel.RelDelete(user.Id)
	for _, err = range errs {
		if err != nil {
			return base.ServerInternalErrorResponse(c, err.Error())
		}
	}

	if err = models.UserModel.DeleteByUserId(userId); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}
