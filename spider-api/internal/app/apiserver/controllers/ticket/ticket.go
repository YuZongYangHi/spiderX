package ticket

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
)

func ListProduct(c *base.Context) error {
	service := services.NewTicketProductService(c)
	return service.List()
}

func ListCategory(c *base.Context) error {
	service := services.NewTicketCategoryService(c)
	return service.ListByProductId()
}

func ListDocument(c *base.Context) error {
	service := services.NewTicketCategoryDocumentService(c)
	return service.ListByWorkflowId()
}

func ListCustomForm(c *base.Context) error {
	service := services.NewTicketWorkflowCustomForm(c)
	return service.ListByCategoryId()
}

func CreateTicketRecord(c *base.Context) error {
	service := services.NewTicketRecordService(c)
	return service.CreateTicketRecord()
}

func ListTicketTodoRecord(c *base.Context) error {
	serializer := base.NewSerializersManager(c, NewTodoRecordSerializer())
	response, err := serializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, err.Error())
	}
	return base.Response(c, 200, response)
}

func ListTicketDoneRecord(c *base.Context) error {
	serializer := base.NewSerializersManager(c, NewDoneRecordSerializer())
	response, err := serializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, err.Error())
	}
	return base.Response(c, 200, response)
}

func ListTicketApplyRecord(c *base.Context) error {
	serializer := base.NewSerializersManager(c, NewApplyRecordSerializer())
	response, err := serializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, err.Error())
	}
	return base.Response(c, 200, response)
}

func RetrieveRecord(c *base.Context) error {
	sn := c.Param("sn")
	if sn == "" {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}
	record, err := models.TicketModel.GetRecordBySn(sn)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, record)
}

func DestroyRecord(c *base.Context) error {
	service := services.NewTicketRecordService(c)
	return service.Delete()
}

func RecordDiscard(c *base.Context) error {
	sn := c.Param("sn")
	if sn == "" {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}
	user, err := c.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(c)
	}

	record, err := models.TicketModel.GetRecordBySn(sn)
	if err != nil {
		return base.NotFoundResponse(c)
	}

	if record.Creator != user.Username && !user.IsAdmin {
		return base.ForbiddenResponse(c)
	}

	if record.Status != 0 {
		return base.ServerInternalErrorResponse(c, base.TicketRecordNotAllowDiscard)
	}

	service := services.NewTicketRecordService(c)
	if err = service.Discard(record); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, record)
}

func CheckUserHasRecordLookPermissions(c *base.Context) error {
	service := services.NewTicketRecordService(c)
	permissions, err := service.HasPermissions()
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, permissions)
}

func ListNodeByRecordSn(c *base.Context) error {
	sn := c.Param("sn")
	if sn == "" {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}

	record, err := models.TicketModel.GetRecordBySn(sn)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	var nodeStates []models.TicketWorkflowState
	nodeStateCond := map[string]interface{}{"category_id": record.CategoryId}
	err = models.Orm.Scalars(&models.TicketWorkflowState{}, &nodeStates, nodeStateCond)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, nodeStates)
}

func ListRecordFlowLog(c *base.Context) error {
	recordId := c.ParseInt("id")
	if recordId == 0 {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}
	flowLogSerializer := NewFlowLogSerializer()
	flowLogSerializer.filter["ticket_workflow_record_id"] = recordId
	baseSerializer := base.NewSerializersManager(c, flowLogSerializer)
	qs, _ := baseSerializer.QuerySet()
	return base.Response(c, 200, qs)
}
