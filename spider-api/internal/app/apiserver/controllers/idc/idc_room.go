package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func IdcRoomList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewIdcRoomSerializer())
}

func IdcRoomRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.IdcRoom{})
}

func IdcRoomCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.IdcRoom{},
		Payload:     &forms.IdcRoomCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func IdcRoomUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.IdcRoom{},
		Payload:     &forms.IdcRoomUpdateForm{},
	}
	return genericSet.Update(params)
}

func IdcRoomDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.IdcRoom{})
}
