package menu

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
)

func RoleResourceList(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("roleId")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}
	s := NewSerializerMenuRoleBindingMenu()
	s.Filter["role_id"] = id
	serializer := base.NewSerializersManager(c, s)
	result, err := serializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, result)
}

func RoleResourceCreate(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	role, err := models.RBACMenuRoleModel.GetById(roleId)
	if err != nil || role.Id == 0 {
		return base.BadRequestResponse(c, "")
	}

	var payload forms.MenuRoleResource
	valid := base.NewValidator(c)
	if err = valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, "")
	}

	menu, err := models.MenuModel.GetById(payload.MenuId)
	if err != nil || menu.Id == 0 {
		return base.BadRequestResponse(c, "")
	}

	resource, err := models.RBACMenuRoleBindingMenuModel.GetByMenuIdAndRoleId(payload.MenuId, roleId)
	if resource.Id > 0 {
		return base.ErrorResponse(c, 400, "resource already exists")
	}

	m := &models.MenuRoleBindingMenu{
		RoleId: roleId,
		MenuId: payload.MenuId,
	}

	if err = models.RBACMenuRoleBindingMenuModel.Add(m); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, payload)
}

func RoleResourceDelete(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	resourceId := cc.ParseInt("resourceId")
	if resourceId == 0 {
		return base.BadRequestResponse(c, "")
	}

	if err := models.RBACMenuRoleBindingMenuModel.DeleteByIdAndRoleId(resourceId, roleId); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func RoleResourceMenuList(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	resources, err := models.RBACMenuRoleBindingMenuModel.ListByRoleId(roleId)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	var menuIds []int64
	for _, resource := range resources {
		menuIds = append(menuIds, resource.MenuId)
	}

	var menuList []models.Menu
	if len(menuIds) > 0 {
		err = models.OrmDB().Where("id NOT IN ?", menuIds).Find(&menuList).Error
	} else {
		err = models.OrmDB().Find(&menuList).Error
	}

	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, menuList)
}
