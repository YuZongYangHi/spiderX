package group

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
)

func ListALL(c echo.Context) error {
	list, err := models.GroupModel.List()
	if err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}
	return base.SuccessResponse(c, list)
}

func List(c echo.Context) error {
	gs := NewSerializer()
	s := base.NewSerializersManager(c, gs)
	response, err := s.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, response)
}

func Create(c echo.Context) error {
	var payload forms.GroupForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	group, _ := models.GroupModel.GetByName(payload.Name)
	if group.Id > 0 {
		return base.ErrorResponse(c, 400, "group already exists")
	}

	g := &models.Group{
		Name:        payload.Name,
		Description: payload.Description,
		CnName:      payload.CnName,
		Email:       payload.Email,
	}

	if err := models.GroupModel.Create(g); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, g)
}

func Update(c echo.Context) error {
	cc := c.(*base.Context)
	groupId := cc.ParseInt("groupId")
	if groupId == 0 {
		return base.BadRequestResponse(c, "")
	}

	group, err := models.GroupModel.GetById(groupId)
	if err != nil || group.Id == 0 {
		return base.BadRequestResponse(c, "")
	}

	var payload forms.GroupForm
	valid := base.NewValidator(c)
	if err = valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	group.Name = payload.Name
	group.CnName = payload.CnName
	group.Email = payload.Email
	group.Description = payload.Description

	if err = models.GroupModel.Update(&group); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, group)
}

func Delete(c echo.Context) error {
	cc := c.(*base.Context)
	groupId := cc.ParseInt("groupId")
	if groupId == 0 {
		return base.BadRequestResponse(c, "")
	}

	errs := models.GroupModel.RelDelete(groupId)
	for _, err := range errs {
		if err != nil {
			return base.ServerInternalErrorResponse(c, err.Error())
		}
	}

	if err := models.GroupModel.DeleteById(groupId); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)

}
