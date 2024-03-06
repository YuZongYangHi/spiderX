package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func RoleList(c echo.Context) error {
	serailizer := NewAPIRoleSerializer()
	baseSerializer := base.NewSerializersManager(c, serailizer)
	response, err := baseSerializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, response)
}

func RoleCreate(c echo.Context) error {
	cc := c.(*base.Context)
	var payload forms.APIRoleForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	role, _ := models.RBACAPIRoleModel.GetByName(payload.Name)
	if role.Id > 0 {
		return base.ErrorResponse(c, 400, "resource already exists")
	}

	user, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(c)
	}

	m := &models.APIRole{
		Name:        payload.Name,
		Owner:       user.Username,
		Description: payload.Description,
	}

	if err = models.RBACAPIRoleModel.Add(m); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	return base.SuccessResponse(c, m)
}

func RoleDelete(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}

	// delete rel role binding user && group
	roleBinding, _ := models.RBACAPIRoleBindingModel.GetByRoleId(id)
	if roleBinding.Id > 0 {
		models.RBACAPIRoleBindingUserModel.DeleteByRoleBindingId(roleBinding.Id)
		models.RBACAPIRoleBindingGroupModel.DeleteByRoleBindingId(roleBinding.Id)
		models.RBACAPIRoleBindingModel.DeleteByRoleId(id)
		models.APIKeyRelRoleModel.DeleteByRoleId(id)
	}

	models.RBACAPIRoleRelResourceModel.DeleteByRoleId(id)
	if err := models.RBACAPIRoleModel.DeleteById(id); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func RoleUpdate(c echo.Context) error {
	service := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.APIRole{},
		Payload:     &forms.APIRoleForm{},
	}
	return service.Update(params)
}
