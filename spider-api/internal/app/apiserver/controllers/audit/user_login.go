package audit

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func UserLoginList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewUserLoginSerializer())
}
