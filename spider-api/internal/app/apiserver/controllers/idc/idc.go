package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func IdcList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewIdcSerializer())
}

func IdcRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.Idc{})
}

func IdcCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Idc{},
		Payload:     &forms.IdcCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func IdcUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Idc{},
		Payload:     &forms.IdcUpdateForm{},
	}
	return genericSet.Update(params)
}

func IdcDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.Idc{})
}
