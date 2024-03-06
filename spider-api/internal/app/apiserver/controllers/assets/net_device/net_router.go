package net_device

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func RouterList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewNetRouterSerializer())
}

func RouterCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.NetRouter{},
		Payload:     &forms.NetRouterCreate{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func RouterDelete(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.NetRouter{})
}

func RouterUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.NetRouter{},
		Payload:     &forms.NetRouterUpdate{},
	}
	return genericSet.Update(params)
}

func RouterRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.NetRouter{})
}
