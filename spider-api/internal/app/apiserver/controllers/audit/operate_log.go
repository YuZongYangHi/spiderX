package audit

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
)

func OperateLog(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}
	resourceName := c.QueryParam("resourceName")
	operateSerializer := NewOperateLogSerializer()
	operateSerializer.filter["resource_pk"] = id
	operateSerializer.filter["resource_name"] = resourceName
	s := base.NewSerializersManager(c, operateSerializer)
	response, err := s.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, response)
}

func OperateLogList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewOperateLogSerializer())
}
