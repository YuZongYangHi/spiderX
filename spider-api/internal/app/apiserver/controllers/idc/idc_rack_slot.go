package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
	"strings"
)

func RackSlotList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewRackSlotSerializer())
}

func RackSlotRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.IdcRackSlot{})
}

func RackSlotCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.IdcRackSlot{},
		Payload:     &forms.IdcRackSlotCreateForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func RackSlotUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.IdcRackSlot{},
		Payload:     &forms.IdcRackSlotUpdateForm{},
	}
	return genericSet.Update(params)
}

func RackSlotDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.IdcRackSlot{})
}

func QueryRackSlot(c echo.Context) error {
	params, err := base.BuildCommonRequestParams(c)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	filter := base.BuildCommonRequestFilterParams(params.Filter)
	if _, ok := filter["name"]; !ok {
		return base.BadRequestResponse(c, "invalid name")
	}

	name := filter["name"].(string)

	var list []models.IdcRackSlot
	var result []models.IdcRackSlotFull

	if err = models.OrmDB().Preload("IdcRack").
		Preload("IdcRack.IdcRoom").
		Preload("IdcRack.IdcRoom.Idc").
		Find(&list).
		Error; err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	for _, slot := range list {
		if strings.HasPrefix(slot.FullName(), name) {
			result = append(result, models.IdcRackSlotFull{
				Id:   slot.Id,
				Name: slot.FullName(),
			})
		}
	}
	return base.SuccessResponse(c, result)
}
