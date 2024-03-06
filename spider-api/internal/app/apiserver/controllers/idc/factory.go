package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func FactoryList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewFactorySerializer())
}

func FactoryRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.Factory{})
}

func FactoryCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Factory{},
		Payload:     &forms.IdcFactoryCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func FactoryUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Factory{},
		Payload:     &forms.IdcFactoryCreateForm{},
	}
	return genericSet.Update(params)
}

func FactoryDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.Factory{})
}
