package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func SuitList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewSuitSerializer())
}

func SuitRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.Suit{})
}

func SuitCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Suit{},
		Payload:     &forms.IdcSuitCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func SuitUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Suit{},
		Payload:     &forms.IdcSuitCreateForm{},
	}
	return genericSet.Update(params)
}

func SuitDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.Suit{})
}

func SuitTypeList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewSuitTypeSerializer())
}

func SuitTypeRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.SuitType{})
}

func SuitTypeCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.SuitType{},
		Payload:     &forms.IdcSuitNameCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func SuitTypeUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.SuitType{},
		Payload:     &forms.IdcSuitNameCreateForm{},
	}
	return genericSet.Update(params)
}

func SuitTypeDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.SuitType{})
}

func SuitSeasonList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewSuitSeasonSerializer())
}

func SuitSeasonRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.SuitSeason{})
}

func SuitSeasonCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.SuitSeason{},
		Payload:     &forms.IdcSuitNameCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func SuitSeasonUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.SuitSeason{},
		Payload:     &forms.IdcSuitNameCreateForm{},
	}
	return genericSet.Update(params)
}

func SuitSeasonDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.SuitSeason{})
}
