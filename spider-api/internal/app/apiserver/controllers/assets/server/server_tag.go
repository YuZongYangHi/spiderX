package server

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func TagList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewServerTagSerializer())
}

func TagRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.ServerTag{})
}

func TagCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.ServerTag{},
		Payload:     &forms.IdcSuitNameCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func TagUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.ServerTag{},
		Payload:     &forms.IdcSuitNameCreateForm{},
	}
	return genericSet.Update(params)
}

func TagDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.ServerTag{})
}
