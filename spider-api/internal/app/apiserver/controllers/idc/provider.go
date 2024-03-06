package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func ProviderList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewProviderSerializer())
}

func ProviderRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.Provider{})
}

func ProviderCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Provider{},
		Payload:     &forms.IdcProviderCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func ProviderUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Provider{},
		Payload:     &forms.IdcProviderCreateForm{},
	}
	return genericSet.Update(params)
}

func ProviderDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.Provider{})
}
