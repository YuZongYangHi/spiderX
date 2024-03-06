package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func IdcRackList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewIdcRackSerializer())
}

func IdcRackRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.IdcRack{})
}

func IdcRackCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.IdcRack{},
		Payload:     &forms.IdcRackCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func IdcRackUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.IdcRack{},
		Payload:     &forms.IdcRackCreateForm{},
	}
	return genericSet.Update(params)
}

func IdcRackDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.IdcRack{})
}
