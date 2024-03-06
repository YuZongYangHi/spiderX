package ticket

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type ProductSerializerInfo struct {
	models.TicketProduct
	Groups []models.Group `json:"groups"`
}

type CategorySerializerInfo struct {
	models.TicketCategory
	Groups []models.Group `json:"groups"`
}

type WorkflowStateSerializerInfo struct {
	models.TicketWorkflowState
	Participants interface{} `json:"participants"`
}

type RecordSerializerInfo struct {
	models.TicketWorkflowRecord
	Participants interface{} `json:"participants"`
}

type ProductSerializer struct {
	model  *[]models.TicketProduct
	filter map[string]interface{}
}

func (c *ProductSerializer) Preload() []string {
	return []string{}
}

func (c *ProductSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *ProductSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *ProductSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *ProductSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var result []ProductSerializerInfo
	for _, d := range *c.model {
		groups, _ := models.GroupModel.FilterIdsByStr(d.AllowedVisibilityGroups)
		info := ProductSerializerInfo{
			d,
			[]models.Group{},
		}
		if len(groups) > 0 {
			info.Groups = groups
		}
		result = append(result, info)
	}
	data.List = result
	return data
}

func (c *ProductSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameTicketProduct,
		FilterCondition:     c.filter,
		FilterConditionType: base.TicketProductFilterCondition,
		Model:               c.model,
	}
}

func NewProductSerializer() *ProductSerializer {
	return &ProductSerializer{
		model:  &[]models.TicketProduct{},
		filter: map[string]interface{}{},
	}
}

type CategorySerializer struct {
	model  *[]models.TicketCategory
	filter map[string]interface{}
}

func (c *CategorySerializer) Preload() []string {
	return []string{"Product"}
}

func (c *CategorySerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *CategorySerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *CategorySerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *CategorySerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var result []CategorySerializerInfo
	for _, d := range *c.model {
		groups, _ := models.GroupModel.FilterIdsByStr(d.AllowedVisibilityGroups)
		info := CategorySerializerInfo{
			d,
			[]models.Group{},
		}
		if len(groups) > 0 {
			info.Groups = groups
		}
		result = append(result, info)
	}
	data.List = result
	return data
}

func (c *CategorySerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameTicketCategory,
		FilterCondition:     c.filter,
		FilterConditionType: base.TicketCategoryFilterCondition,
		Model:               c.model,
	}
}

func NewCategorySerializer() *CategorySerializer {
	return &CategorySerializer{
		model:  &[]models.TicketCategory{},
		filter: map[string]interface{}{},
	}
}

type CategoryDocumentSerializer struct {
	model  *[]models.TicketCategoryDocument
	filter map[string]interface{}
}

func (c *CategoryDocumentSerializer) Preload() []string {
	return []string{"Category", "Category.Product"}
}

func (c *CategoryDocumentSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *CategoryDocumentSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *CategoryDocumentSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *CategoryDocumentSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *CategoryDocumentSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameTicketCategoryDocument,
		FilterCondition:     c.filter,
		FilterConditionType: base.TicketWorkflowWikiFilterCondition,
		Model:               c.model,
	}
}

func NewCategoryDocumentSerializer() *CategoryDocumentSerializer {
	return &CategoryDocumentSerializer{
		model:  &[]models.TicketCategoryDocument{},
		filter: map[string]interface{}{},
	}
}

type NodeStateSerializer struct {
	model  *[]models.TicketWorkflowState
	filter map[string]interface{}
}

func (c *NodeStateSerializer) Preload() []string {
	return []string{"Category", "Category.Product"}
}

func (c *NodeStateSerializer) Order() []string {
	return []string{"priority desc"}
}

func (c *NodeStateSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *NodeStateSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *NodeStateSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var result []WorkflowStateSerializerInfo
	for _, d := range *c.model {
		participants, err := models.TicketModel.FindParticipantList(d.ParticipantType, d.Participant)
		if err != nil {
			continue
		}
		info := WorkflowStateSerializerInfo{
			d,
			participants,
		}
		result = append(result, info)
	}
	data.List = result
	return data
}

func (c *NodeStateSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameTicketWorkflowState,
		FilterCondition:     c.filter,
		FilterConditionType: base.TicketNodeStateFilterCondition,
		Model:               c.model,
	}
}

func NewNodeStateSerializer() *NodeStateSerializer {
	return &NodeStateSerializer{
		model:  &[]models.TicketWorkflowState{},
		filter: map[string]interface{}{},
	}
}

type NodeStateTransitionSerializer struct {
	model  *[]models.TicketWorkflowTransition
	filter map[string]interface{}
}

func (c *NodeStateTransitionSerializer) Preload() []string {
	return []string{"Category", "Category.Product", "SrcState", "TargetState"}
}

func (c *NodeStateTransitionSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *NodeStateTransitionSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *NodeStateTransitionSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *NodeStateTransitionSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *NodeStateTransitionSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameTicketWorkflowTransition,
		FilterCondition:     c.filter,
		FilterConditionType: base.TicketWorkflowTransitionFilterCondition,
		Model:               c.model,
	}
}

func NewNodeStateTransitionSerializer() *NodeStateTransitionSerializer {
	return &NodeStateTransitionSerializer{
		model:  &[]models.TicketWorkflowTransition{},
		filter: map[string]interface{}{},
	}
}

type WorkflowCustomFormSerializer struct {
	model  *[]models.TicketWorkflowCustomFormField
	filter map[string]interface{}
}

func (c *WorkflowCustomFormSerializer) Preload() []string {
	return []string{"Category", "Category.Product"}
}

func (c *WorkflowCustomFormSerializer) Order() []string {
	return []string{"priority desc"}
}

func (c *WorkflowCustomFormSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *WorkflowCustomFormSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *WorkflowCustomFormSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *WorkflowCustomFormSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameTicketWorkflowCustomFormField,
		FilterCondition:     c.filter,
		FilterConditionType: base.TicketWorkflowCustomFormFilterCondition,
		Model:               c.model,
	}
}

func NewWorkflowCustomFormSerializer() *WorkflowCustomFormSerializer {
	return &WorkflowCustomFormSerializer{
		model:  &[]models.TicketWorkflowCustomFormField{},
		filter: map[string]interface{}{},
	}
}

type BaseRecordSerializer struct {
	model  *[]models.TicketWorkflowRecord
	filter map[string]interface{}
}

func (c *BaseRecordSerializer) Preload() []string {
	return []string{"Category", "Category.Product", "State"}
}

func (c *BaseRecordSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *BaseRecordSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var result []RecordSerializerInfo
	for _, record := range *c.model {
		participants, err := models.TicketModel.FindParticipantList(record.State.ParticipantType, record.State.Participant)
		if err != nil {
			continue
		}
		info := RecordSerializerInfo{
			record,
			participants,
		}
		result = append(result, info)
	}
	data.List = result
	return data
}

func (c *BaseRecordSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameTicketWorkflowRecord,
		FilterCondition:     c.filter,
		FilterConditionType: base.TicketRecordFilterCondition,
		Model:               c.model,
	}
}

func NewBaseRecordSerializer() *BaseRecordSerializer {
	return &BaseRecordSerializer{
		model:  &[]models.TicketWorkflowRecord{},
		filter: map[string]interface{}{},
	}
}

type TodoRecordSerializer struct {
	model          *[]models.TicketWorkflowRecord
	filter         map[string]interface{}
	baseSerializer *BaseRecordSerializer
}

func (c *TodoRecordSerializer) Preload() []string {
	return c.baseSerializer.Preload()
}

func (c *TodoRecordSerializer) Order() []string {
	return c.baseSerializer.Order()
}

func (c *TodoRecordSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *TodoRecordSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	cc := ctx.(*base.Context)
	user, _ := cc.CurrentUser()

	tx1 := models.OrmDB().Model(&models.TicketWorkflowRecord{}).
		Joins("INNER JOIN ticket_workflow_state t2 ON t2.id = ticket_workflow_record.state_id").
		Where("t2.hidden_state = ?", 1).
		Where("(t2.participant_type = 1 AND FIND_IN_SET(?, t2.participant) > 0) OR (t2.participant_type = 2 AND FIND_IN_SET(?, t2.participant) > 0)", user.Id, user.GroupId).
		Where("ticket_workflow_record.creator != ?", user.Username).
		Where("status = 0")
	if len(query) > 0 {
		var rids []int64
		tx.Pluck("id", &rids)
		tx1.Where("ticket_workflow_record.id IN (?)", rids)
	}
	return tx1, nil
}

func (c *TodoRecordSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return c.baseSerializer.Response(data, query)
}

func (c *TodoRecordSerializer) GetParams() base.SerializersParams {
	return c.baseSerializer.GetParams()
}

func NewTodoRecordSerializer() *TodoRecordSerializer {
	baseSerializer := NewBaseRecordSerializer()
	return &TodoRecordSerializer{
		model:          baseSerializer.model,
		filter:         map[string]interface{}{},
		baseSerializer: baseSerializer,
	}
}

type DoneRecordSerializer struct {
	model          *[]models.TicketWorkflowRecord
	filter         map[string]interface{}
	baseSerializer *BaseRecordSerializer
}

func (c *DoneRecordSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return c.baseSerializer.Response(data, query)
}

func (c *DoneRecordSerializer) GetParams() base.SerializersParams {
	return c.baseSerializer.GetParams()
}

func (c *DoneRecordSerializer) Preload() []string {
	return c.baseSerializer.Preload()
}

func (c *DoneRecordSerializer) Order() []string {
	return c.baseSerializer.Order()
}

func (c *DoneRecordSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *DoneRecordSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	cc := ctx.(*base.Context)
	user, _ := cc.CurrentUser()

	tx1 := models.OrmDB().Model(&models.TicketWorkflowRecord{}).
		Joins("INNER JOIN ticket_workflow_flow_log t2 ON t2.ticket_workflow_record_id = ticket_workflow_record.id").
		Where("t2.approver = ?", user.Username).
		Where("ticket_workflow_record.creator != ?", user.Username).
		Group("ticket_workflow_record.sn")
	if len(query) > 0 {
		var rids []int64
		tx.Pluck("id", &rids)
		tx1.Where("ticket_workflow_record.id IN (?)", rids)
	}
	return tx1, nil
}

func NewDoneRecordSerializer() *DoneRecordSerializer {
	baseSerializer := NewBaseRecordSerializer()
	return &DoneRecordSerializer{
		model:          baseSerializer.model,
		filter:         map[string]interface{}{},
		baseSerializer: baseSerializer,
	}
}

type ApplyRecordSerializer struct {
	model          *[]models.TicketWorkflowRecord
	filter         map[string]interface{}
	baseSerializer *BaseRecordSerializer
}

func (c *ApplyRecordSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return c.baseSerializer.Response(data, query)
}

func (c *ApplyRecordSerializer) GetParams() base.SerializersParams {
	return c.baseSerializer.GetParams()
}

func (c *ApplyRecordSerializer) Preload() []string {
	return c.baseSerializer.Preload()
}

func (c *ApplyRecordSerializer) Order() []string {
	return c.baseSerializer.Order()
}

func (c *ApplyRecordSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *ApplyRecordSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	cc := ctx.(*base.Context)
	user, _ := cc.CurrentUser()

	tx1 := models.OrmDB().Model(&models.TicketWorkflowRecord{}).Where("creator = ?", user.Username)
	if len(query) > 0 {
		var rids []int64
		tx.Pluck("id", &rids)
		tx1.Where("id IN (?)", rids)
	}
	return tx1, nil
}

func NewApplyRecordSerializer() *ApplyRecordSerializer {
	baseSerializer := NewBaseRecordSerializer()
	return &ApplyRecordSerializer{
		model:          baseSerializer.model,
		filter:         map[string]interface{}{},
		baseSerializer: baseSerializer,
	}
}

type FlowLogSerializer struct {
	model  *[]models.TicketWorkflowRecordFlowLog
	filter map[string]interface{}
}

func (c *FlowLogSerializer) Preload() []string {
	return models.GeneratePreloadList(models.TicketRecordFlowLogPreload)
}

func (c *FlowLogSerializer) Order() []string {
	return []string{"id desc"}
}

func (c *FlowLogSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *FlowLogSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *FlowLogSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *FlowLogSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameTicketWorkflowFlowLog,
		FilterCondition:     c.filter,
		FilterConditionType: base.TicketFlowLogFilterCondition,
		Model:               c.model,
	}
}

func NewFlowLogSerializer() *FlowLogSerializer {
	return &FlowLogSerializer{
		model:  &[]models.TicketWorkflowRecordFlowLog{},
		filter: map[string]interface{}{},
	}
}
