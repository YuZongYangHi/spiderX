package server

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
	"k8s.io/klog/v2"
)

func ListByTreeId(c echo.Context) error {
	cc := c.(*base.Context)
	treeId := cc.ParseInt("treeId")
	if treeId == 0 {
		return base.BadRequestResponse(c, base.HTTP400Message)
	}

	genericSet := services.NewGeneric(c)
	return genericSet.List(NewTreeSerializer())
}

func List(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewSerializer())
}

func Retrieve(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}

	server, err := models.ServerModel.GetById(id)
	if err != nil {
		return base.NotFoundResponse(c)
	}
	return base.SuccessResponse(c, server)
}

func Create(c *base.Context) error {
	var server models.Server
	var form forms.ServerCreateForm
	genericSet := services.NewGeneric(c)

	params := services.GenericPostOrPutParams{
		ModelEngine: &server,
		Payload:     &form,
		Extra:       c.GetUserMap(),
	}

	err := genericSet.CreateToResponseError(params)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	s := services.NewServer()
	if err = s.CreateRel(form); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, form)
}

func Update(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}
	var server models.Server
	var form forms.ServerUpdateForm
	if err := models.Orm.GetById(&server, id); err != nil {
		return base.NotFoundResponse(c)
	}
	if server.IsDeleted == 1 {
		return base.ServerInternalErrorResponse(c, base.InstanceAlreadyDelete)
	}
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &server,
		Payload:     &form,
	}
	err := genericSet.UpdateToResponseError(params)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	s := services.NewServer()
	if err = s.UpdateRel(id, form); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, s)
}

func Destroy(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}
	user, _ := cc.CurrentUser()
	if err := models.Orm.SoftDeleteById(&models.Server{}, id, user.Username); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func BatchImport(c echo.Context) error {
	serverSvc := services.NewServer()
	result, err := serverSvc.BatchImport(c)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, result)
}

func BatchDelete(c echo.Context) error {
	cc := c.(*base.Context)

	var payload forms.NodeMultiDeleteForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	user, _ := cc.CurrentUser()
	for _, nodeId := range payload.Ids {
		if err := models.Orm.SoftDeleteById(&models.Server{}, nodeId, user.Username); err != nil {
			klog.Errorf("multi delete node fail, noeId: %d, err: %s", nodeId, err.Error())
		}
	}
	return base.SuccessNoContentResponse(c)
}

func TreeMigrate(c echo.Context) error {
	var payload forms.ServerTreeMigrate
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	s := services.NewServer()
	err := s.MigrateServerTree(payload.SrcTreeId, payload.TargetIds, payload.ServerIds)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, payload)
}
