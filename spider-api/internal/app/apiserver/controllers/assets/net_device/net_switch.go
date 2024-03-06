package net_device

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func SwitchList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewNetSwitchSerializer())
}

func SwitchCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.NetSwitch{},
		Payload:     &forms.NetSwitchCreate{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func SwitchDelete(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.NetSwitch{})
}

func SwitchUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.NetSwitch{},
		Payload:     &forms.NetSwitchUpdate{},
	}
	return genericSet.Update(params)
}

func SwitchRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.NetSwitch{})
}
