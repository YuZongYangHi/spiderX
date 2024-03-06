package ticket

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
)

func SendRecordNodeStateUrge(c *base.Context) error {
	s := services.NewTicketWorkflowUrge(c)
	urge, _ := s.GetUrge()
	if urge.Id > 0 {
		return base.ErrorResponse(c, 200, base.TicketRecordAlreadyUrge)
	}
	err := s.SendUrge()
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}
	urge, _ = s.GetUrge()
	return base.SuccessResponse(c, urge)

}

func GetRecordNodeStateUrge(c *base.Context) error {
	s := services.NewTicketWorkflowUrge(c)
	urge, err := s.GetUrge()
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}
	return base.SuccessResponse(c, urge)
}

func ListProcessButtonTransition(c *base.Context) error {
	svc := services.NewTicketWorkflowNodeStateTransition(c)
	list, err := svc.ListProcessButtonTransition()
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}
	return base.SuccessResponse(c, list)
}

func ListProcessForm(c *base.Context) error {
	svc := services.NewTicketRecordService(c)
	list, err := svc.ListForm()
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}
	return base.SuccessResponse(c, list)
}

func UpdateTicketRecord(c *base.Context) error {
	service := services.NewTicketRecordService(c)
	return service.UpdateTicketRecord()
}

func ListRecordComment(c *base.Context) error {
	s := services.NewTicketRecordComment(c)
	return s.ListComment()
}

func AddRecordComment(c *base.Context) error {
	s := services.NewTicketRecordComment(c)
	return s.AddComment()
}
