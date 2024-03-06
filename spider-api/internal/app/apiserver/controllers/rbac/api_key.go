package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/jwt"
	"github.com/labstack/echo/v4"
	"time"
)

func ListAPIKeys(c echo.Context) error {
	b := base.NewSerializersManager(c, NewAPIKeySerializer())
	querySet, err := b.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, querySet)
}

func DeleteAPIKey(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}

	err := models.APIKeyModel.Delete(id)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	err = models.APIKeyRelRoleModel.DeleteByKeyId(id)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func CreateAPIKey(c echo.Context) error {
	cc := c.(*base.Context)
	user, err := cc.CurrentUser()
	if user.Id == 0 || err != nil {
		return base.UnauthorizedResponse(c)
	}

	var payload forms.APIKey
	valid := base.NewValidator(c)
	if err = valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	apiKey, err := models.APIKeyModel.GetByName(payload.Name)
	if apiKey.Id > 0 {
		return base.BadRequestResponse(c, "")
	}

	for _, roleId := range payload.RoleIds {
		if role, _ := models.RBACAPIRoleModel.GetById(roleId); role.Id == 0 {
			return base.BadRequestResponse(c, "")
		}
	}

	now := time.Now()
	token, err := jwt.GenerateToken(&jwt.CustomClaims{
		Audience:  payload.Name,
		ExpiresAt: now.Add(time.Duration(payload.ExpireIn) * time.Second).Unix(),
		IssuedAt:  now.Unix(),
		Issuer:    config.ApiServerConfig().AppName,
		Salt:      config.ApiServerConfig().Security.JWTSalt,
	})

	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	key := &models.APIKey{
		Name:        payload.Name,
		Token:       token,
		ExpireIn:    payload.ExpireIn,
		Description: payload.Description,
		Owner:       user.Username,
	}

	if err = models.APIKeyModel.Add(key); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	for _, roleId := range payload.RoleIds {
		if r, _ := models.APIKeyRelRoleModel.GetByKeyIdByRoleId(key.Id, roleId); r.Id > 0 {
			continue
		}
		mr := &models.APIKeyRelRole{
			RoleId: roleId,
			KeyId:  key.Id,
		}
		if err = models.APIKeyRelRoleModel.Add(mr); err != nil || mr.Id == 0 {
			return base.ServerInternalErrorResponse(c, "api key rel role add fail")

		}
	}
	return base.SuccessResponse(c, key)
}
