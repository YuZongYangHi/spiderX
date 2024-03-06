package menu

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/rbac"
	"github.com/labstack/echo/v4"
)

func UserList(c echo.Context) error {
	cc := c.(*base.Context)
	menuId, err := cc.GetParamInt("id")
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	result, err := rbac.ListRoleByMenuId(menuId, rbac.NewMenuUserGrantPermissionsManager())
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, result)
}

func GroupList(c echo.Context) error {
	cc := c.(*base.Context)
	menuId, err := cc.GetParamInt("id")
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	result, err := rbac.ListRoleByMenuId(menuId, rbac.NewMenuGroupGrantPermissionsManager())
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, result)
}
