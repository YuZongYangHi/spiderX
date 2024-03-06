package menu

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func RoleAllocationGroupList(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	roleBinding, err := models.RBACMenuRoleBindingModel.GetByRoleId(roleId)
	if err != nil {
		return base.SuccessResponse(c, nil)
	}

	s := NewSerializerMenuRoleBindingGroup()
	s.Filter["role_binding_id"] = roleBinding.Id
	result, err := base.NewSerializersManager(c, s).QuerySet()
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.Response(c, 200, result)
}

func RoleAllocationAvailableGroup(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	role, err := models.RBACMenuRoleModel.GetById(roleId)
	if err != nil || role.Id == 0 {
		return base.ErrorResponse(c, 400, "role not found")
	}

	roleBindings, err := models.RBACMenuRoleBindingModel.ListByRoleId(roleId)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	groupIds := models.RBACMenuRoleBindingModel.FilterGroupIds(roleBindings)

	var result []models.Group
	if len(groupIds) == 0 {
		result, err = models.GroupModel.List()
	} else {
		result, err = models.GroupModel.NotIn(groupIds)
	}
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, result)
}

func RoleAllocationGroupCreate(c echo.Context) error {
	RoleResourceManager := services.NewRoleResourcePermissionsAllocation(c, services.NewRoleResourcePermissionsGroup())
	result, err := RoleResourceManager.Create()
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, result)
}

func RoleAllocationGroupDelete(c echo.Context) error {
	RoleResourceManager := services.NewRoleResourcePermissionsAllocation(c, services.NewRoleResourcePermissionsGroup())
	if err := RoleResourceManager.Delete(); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func RoleAllocationUserList(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	roleBinding, err := models.RBACMenuRoleBindingModel.GetByRoleId(roleId)
	if err != nil {
		return base.SuccessResponse(c, nil)
	}

	s := NewSerializerMenuRoleBindingUser()
	s.Filter["role_binding_id"] = roleBinding.Id
	result, err := base.NewSerializersManager(c, s).QuerySet()
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	return base.Response(c, 200, result)
}

func RoleAllocationUserCreate(c echo.Context) error {
	RoleResourceManager := services.NewRoleResourcePermissionsAllocation(c, services.NewRoleResourcePermissionsUser())
	result, err := RoleResourceManager.Create()
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, result)
}

func RoleAllocationUserDelete(c echo.Context) error {
	RoleResourceManager := services.NewRoleResourcePermissionsAllocation(c, services.NewRoleResourcePermissionsUser())
	if err := RoleResourceManager.Delete(); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func RoleAllocationAvailableUser(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	role, err := models.RBACMenuRoleModel.GetById(roleId)
	if err != nil || role.Id == 0 {
		return base.ErrorResponse(c, 400, "role not found")
	}

	roleBindings, err := models.RBACMenuRoleBindingModel.ListByRoleId(roleId)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	userIds := models.RBACMenuRoleBindingModel.FilterUserIds(roleBindings)

	var result []models.User
	if len(userIds) == 0 {
		result, err = models.UserModel.List()
	} else {
		result, err = models.UserModel.NotIn(userIds)
	}
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, result)
}
