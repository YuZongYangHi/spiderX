package menu

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
)

func RoleList(c echo.Context) error {
	serializer := base.NewSerializersManager(c, NewSerializerMenuRole())
	result, err := serializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, result)
}

func RoleCreate(c echo.Context) error {
	var payload forms.MenuRoleCreateForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}
	m := &models.MenuRole{
		Name:        payload.Name,
		Description: payload.Description,
	}
	if err := models.RBACMenuRoleModel.Add(m); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, payload)
}

func RoleDelete(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}

	// role resource
	if err := models.RBACMenuRoleBindingMenuModel.DeleteByRoleId(id); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	roleBindings, err := models.RBACMenuRoleBindingModel.ListByRoleId(id)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	rbIds := models.RBACMenuRoleBindingModel.FilterIds(roleBindings)

	// role related group
	if err = models.RBACMenuRoleBindingUserModel.DeleteByRoleBindingIds(rbIds); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	// role related user
	if err = models.RBACMenuRoleBindingGroupModel.DeleteByRoleBindingIds(rbIds); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	if err := models.RBACMenuRoleModel.Delete(id); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func RoleUpdate(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}

	var payload forms.MenuRoleCreateForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	menuRole, err := models.RBACMenuRoleModel.GetById(id)
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	menuRole.Name = payload.Name
	menuRole.Description = payload.Description
	if err = models.RBACMenuRoleModel.Update(&menuRole); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, menuRole)
}
