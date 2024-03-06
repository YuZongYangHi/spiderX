package menu

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/rbac"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func GroupPermissionsList(c echo.Context) error {
	cc := c.(*base.Context)
	menuId := cc.ParseInt("id")
	if menuId == 0 {
		return base.BadRequestResponse(c, "")
	}
	groupSerializerManager := NewSerializerGroupPermissions()
	groupSerializerManager.Filter["menu_id"] = menuId

	serializer := base.NewSerializersManager(c, groupSerializerManager)
	result, err := serializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	return base.Response(c, base.HTTP200Code, result)
}

func GroupPermissionsDelete(c echo.Context) error {
	menuManager := rbac.NewMenuGrantPermissionsManager(c, services.NewMenuGroupGrant())
	err := menuManager.Delete()
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func GroupPermissionsUpdate(c echo.Context) error {
	menuManager := rbac.NewMenuGrantPermissionsManager(c, services.NewMenuGroupGrant())
	params, err := menuManager.GetParams()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	var payload models.PermissionsAction
	valid := base.NewValidator(c)
	if err = valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	obj, err := models.RBACMenuPermissionsGroupModel.GetByMenuIdAndId(params.MenuId, params.PermissionsId)
	if err != nil || obj.Id == 0 {
		return base.ErrorResponse(c, 404, err.Error())
	}

	err = models.RBACMenuPermissionsGroupModel.UpdateById(obj.Id, &payload)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, payload)
}

func GroupPermissionsCreate(c echo.Context) error {
	menuManager := rbac.NewMenuGrantPermissionsManager(c, services.NewMenuGroupGrant())
	response, err := menuManager.Create()
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, response)
}
