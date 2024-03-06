package ticket

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
)

/*
ticket category
*/
func ListEngineProduct(c *base.Context) error {
	service := services.NewGeneric(c)
	return service.List(NewProductSerializer())
}

func CreateEngineProduct(c *base.Context) error {
	service := services.NewTicketProductService(c)
	return service.Create()
}

func DestroyEngineProduct(c *base.Context) error {
	service := services.NewTicketProductService(c)
	return service.Delete()
}

func UpdateEngineProduct(c *base.Context) error {
	service := services.NewTicketProductService(c)
	return service.Update()
}

func RetrieveEngineProduct(c *base.Context) error {
	service := services.NewTicketProductService(c)
	return service.Retrieve()
}

func ListEngineProductCategory(c *base.Context) error {
	productId := c.ParseInt("id")
	s := NewCategorySerializer()
	s.filter["product_id"] = productId
	service := services.NewGeneric(c)
	return service.List(s)
}

/*
ticket workflow
*/
func CreateEngineCategory(c *base.Context) error {
	service := services.NewTicketCategoryService(c)
	return service.Create()
}

func DestroyEngineCategory(c *base.Context) error {
	service := services.NewTicketCategoryService(c)
	return service.Delete()
}

func UpdateEngineCategory(c *base.Context) error {
	service := services.NewTicketCategoryService(c)
	return service.Update()
}

func RetrieveEngineCategory(c *base.Context) error {
	service := services.NewTicketCategoryService(c)
	return service.Retrieve()
}

func ListEngineCategory(c *base.Context) error {
	service := services.NewTicketCategoryService(c)
	return service.List()
}

/*
	ticker document
*/

func CreateEngineCategoryDocument(c *base.Context) error {
	service := services.NewTicketCategoryDocumentService(c)
	return service.Create()
}

func DestroyEngineCategoryDocument(c *base.Context) error {
	service := services.NewTicketCategoryDocumentService(c)
	return service.Delete()
}

func UpdateEngineCategoryDocument(c *base.Context) error {
	service := services.NewTicketCategoryDocumentService(c)
	return service.Update()
}

func RetrieveEngineCategoryDocument(c *base.Context) error {
	service := services.NewTicketCategoryDocumentService(c)
	return service.Retrieve()
}

func ListEngineCategoryDocument(c *base.Context) error {
	service := services.NewGeneric(c)
	return service.List(NewCategoryDocumentSerializer())
}

func ListEngineCategoryDocumentByCategoryId(c *base.Context) error {
	workFlowId := c.ParseInt("categoryId")
	s := NewCategoryDocumentSerializer()
	s.filter["category_id"] = workFlowId
	service := services.NewGeneric(c)
	return service.List(s)
}

/*
	Ticket Workflow Node State
*/

func CreateWorkflowNodeState(c *base.Context) error {
	service := services.NewTicketWorkflowNodeState(c)
	return service.Create()
}

func DestroyWorkflowNodeState(c *base.Context) error {
	service := services.NewTicketWorkflowNodeState(c)
	return service.Delete()
}

func UpdateWorkflowNodeState(c *base.Context) error {
	service := services.NewTicketWorkflowNodeState(c)
	return service.Update()
}

func RetrieveWorkflowNodeState(c *base.Context) error {
	service := services.NewTicketWorkflowNodeState(c)
	return service.Retrieve()
}

func ListNodeStateByWorkflowId(c *base.Context) error {
	workflowId := c.ParseInt("categoryId")
	service := services.NewGeneric(c)
	serializer := NewNodeStateSerializer()
	serializer.filter["category_id"] = workflowId
	return service.List(serializer)
}

func ListNodeState(c *base.Context) error {
	service := services.NewGeneric(c)
	return service.List(NewNodeStateSerializer())
}

/*
	Ticket Workflow Node Transition
*/

func CreateWorkflowNodeStateTransition(c *base.Context) error {
	service := services.NewTicketWorkflowNodeStateTransition(c)
	return service.Create()
}

func DestroyWorkflowNodeStateTransition(c *base.Context) error {
	service := services.NewTicketWorkflowNodeStateTransition(c)
	return service.Delete()
}

func UpdateWorkflowNodeStateTransition(c *base.Context) error {
	service := services.NewTicketWorkflowNodeStateTransition(c)
	return service.Update()
}

func RetrieveWorkflowNodeStateTransition(c *base.Context) error {
	service := services.NewTicketWorkflowNodeStateTransition(c)
	return service.Retrieve()
}

func ListNodeStateTransitionByWorkflowId(c *base.Context) error {
	workflowId := c.ParseInt("categoryId")
	service := services.NewGeneric(c)
	serializer := NewNodeStateTransitionSerializer()
	serializer.filter["category_id"] = workflowId
	return service.List(serializer)
}

func ListNodeStateTransition(c *base.Context) error {
	service := services.NewGeneric(c)
	return service.List(NewNodeStateTransitionSerializer())
}

/*
Ticket Workflow Custom Form
*/
func CreateWorkflowCustomForm(c *base.Context) error {
	service := services.NewTicketWorkflowCustomForm(c)
	return service.Create()
}

func DestroyWorkflowCustomForm(c *base.Context) error {
	service := services.NewTicketWorkflowCustomForm(c)
	return service.Delete()
}

func UpdateWorkflowCustomForm(c *base.Context) error {
	service := services.NewTicketWorkflowCustomForm(c)
	return service.Update()
}

func RetrieveWorkflowCustomForm(c *base.Context) error {
	service := services.NewTicketWorkflowCustomForm(c)
	return service.Retrieve()
}

func ListWorkflowCustomFormByWorkflowId(c *base.Context) error {
	workflowId := c.ParseInt("categoryId")
	service := services.NewGeneric(c)
	serializer := NewWorkflowCustomFormSerializer()
	serializer.filter["category_id"] = workflowId
	return service.List(serializer)
}

func ListWorkflowCustomForm(c *base.Context) error {
	service := services.NewGeneric(c)
	return service.List(NewWorkflowCustomFormSerializer())
}
