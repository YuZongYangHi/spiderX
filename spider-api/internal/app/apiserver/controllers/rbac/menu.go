package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
)

func MenuList(c echo.Context) error {
	cc := c.(*base.Context)
	user, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(c)
	}
	keys := models.MenuModel.ListKeysByUser(user)
	return base.SuccessResponse(c, keys)
}

func MenuListExpand(c echo.Context) error {
	menuKeys := models.MenuModel.ListAllKeys()
	return base.SuccessResponse(c, menuKeys)
}
