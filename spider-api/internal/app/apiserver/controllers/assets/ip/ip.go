package ip

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func List(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewSerializer())
}

func Create(c *base.Context) error {
	var ip models.NetIp
	var form forms.NetIpCreate

	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &ip,
		Payload:     &form,
		Extra:       c.GetUserMap(),
	}
	err := genericSet.CreateToResponseError(params)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	service := services.NewNetIp(c)
	err = service.SyncRelResource(ip.Id, form.RelResource)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, form)
}

func Delete(c echo.Context) error {
	var ip models.NetIp
	genericSet := services.NewGeneric(c)
	err := genericSet.DeleteToResponseError(&ip)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	err = models.NetIpModel.ClearRelResource(ip.Id)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func Update(c echo.Context) error {
	var form forms.NetIpUpdate
	var ip models.NetIp

	genericSet := services.NewGeneric(c)

	params := services.GenericPostOrPutParams{
		ModelEngine: &ip,
		Payload:     &form,
	}
	err := genericSet.UpdateToResponseError(params)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	service := services.NewNetIp(c)
	err = service.SyncRelResource(ip.Id, form.RelResource)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, form)
}

func Retrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.NetIp{})
}
