package ip_range

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func List(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewSerializer())
}

func Create(c *base.Context) error {
	var ipRange models.IpRange
	var form forms.NetIpRangeCreate

	genericSet := services.NewGeneric(c)

	params := services.GenericPostOrPutParams{
		ModelEngine: &ipRange,
		Payload:     &form,
		Extra:       c.GetUserMap(),
	}

	err := genericSet.CreateToResponseError(params)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	netIpService := services.NewNetIp(c)
	go netIpService.Sync(ipRange.Id, form)
	return base.SuccessResponse(c, form)
}

func Delete(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.IpRange{})
}

func Update(c echo.Context) error {
	var form forms.IpRangeUpdate
	var ipRange models.IpRange

	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &ipRange,
		Payload:     &form,
	}

	err := genericSet.UpdateToResponseError(params)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	service := services.NewNetIp(c)
	go service.Sync(ipRange.Id, forms.NetIpRangeCreate{
		Cidr:     form.Cidr,
		Env:      form.Env,
		Status:   form.Status,
		Operator: form.Operator,
		NodeId:   form.NodeId,
		Type:     form.Type,
		Gateway:  form.Gateway,
	})
	return base.SuccessResponse(c, ipRange)
}

func Retrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.IpRange{})
}
