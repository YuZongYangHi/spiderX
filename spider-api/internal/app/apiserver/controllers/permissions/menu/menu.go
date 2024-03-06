package menu

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"time"
)

func List(c echo.Context) error {
	serializer := base.NewSerializersManager(c, NewSerializerMenu())
	result, err := serializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, result)
}

func Create(c echo.Context) error {
	cc := c.(*base.Context)

	user, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(c)
	}

	var payload forms.CreateMenuForm
	err = c.Bind(&payload)
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	validate := validator.New()
	if err = validate.Struct(&payload); err != nil {
		return base.ErrorResponse(c, base.HTTP400Code, err.Error())
	}

	list, err := models.MenuModel.GetByNameAndKey(payload.Name, payload.Key)
	if len(list) > 0 || err != nil {
		return base.BadRequestResponse(c, "")
	}

	menu := models.Menu{
		Name:       payload.Name,
		Key:        payload.Key,
		ParentId:   payload.ParentId,
		CreateUser: user.Username,
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
	}

	if payload.ParentId > 0 {
		if p, err := models.MenuModel.GetById(payload.ParentId); p.Id == 0 || err != nil {
			return base.BadRequestResponse(c, "")
		}
	}

	if err = models.MenuModel.Create(menu); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, menu)
}

func Delete(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}

	menuObj, err := models.MenuModel.GetById(id)
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	err = models.MenuModel.DeleteById(id)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	if menuObj.ParentId == 0 {
		err = models.MenuModel.DeleteByParentId(id)
		if err != nil {
			return base.ServerInternalErrorResponse(c, err.Error())
		}
	}
	return base.SuccessNoContentResponse(c)
}

func Update(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}

	var payload forms.UpdateMenuForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	menu := &models.Menu{
		Name:     payload.Name,
		Key:      payload.Key,
		ParentId: payload.ParentId,
	}

	if err := models.MenuModel.UpdateById(id, menu); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, payload)
}
