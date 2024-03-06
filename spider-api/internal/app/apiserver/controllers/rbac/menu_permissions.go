package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
)

func MenuPermissionList(ctx echo.Context) error {
	cc := ctx.(*base.Context)
	user, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(ctx)
	}
	permissions, err := models.RBACMenuPermissionModel.ListUserPermission(user)
	if err != nil {
		return base.ServerInternalErrorResponse(ctx, err.Error())
	}

	return base.SuccessResponse(ctx, permissions)
}
