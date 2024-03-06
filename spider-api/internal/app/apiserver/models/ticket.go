package models

import (
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"strings"
	"time"
)

const (
	ParticipantTypeUser      = 1
	ParticipantTypeGroup     = 2
	ParticipantTypeNoNeed    = 3
	ParticipantTypeApplicant = 4

	ApprovalTypePerson     = 1
	ApprovalTypeAutoPass   = 2
	ApprovalTypeAutoReject = 3
	ApprovalTypeNoNeed     = 4

	ApprovalButtonAgree   = "agree"
	ApprovalButtonReject  = "reject"
	ApprovalButtonDiscard = "discard"
)

type TicketProduct struct {
	Id                      int64     `json:"id"`
	Name                    string    `json:"name"`
	Icon                    string    `json:"icon"`
	AllowedVisibilityGroups string    `gorm:"column:allowed_visibility_groups" json:"allowedVisibilityGroups"`
	Creator                 string    `json:"creator"`
	Description             string    `json:"description"`
	CreateTime              time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime              time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketProduct) TableName() string {
	return TableNameTicketProduct
}

func (c *TicketProduct) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

type TicketCategory struct {
	Id                      int64         `json:"id"`
	Name                    string        `json:"name"`
	Icon                    string        `json:"icon"`
	AllowedVisibilityGroups string        `gorm:"column:allowed_visibility_groups" json:"allowedVisibilityGroups"`
	ProductId               int64         `gorm:"column:product_id" json:"productId"`
	Product                 TicketProduct `gorm:"foreignKey:product_id" json:"product"`
	SnRuleIdentifier        string        `gorm:"column:sn_rule_identifier" json:"snRuleIdentifier"`
	Layout                  string        `json:"layout"`
	Webhook                 string        `gorm:"column:webhook" json:"webhook"`
	Creator                 string        `json:"creator"`
	Description             string        `json:"description"`
	CreateTime              time.Time     `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime              time.Time     `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketCategory) TableName() string {
	return TableNameTicketCategory
}

func (c *TicketCategory) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    TicketWorkflowPreload,
	}
}

type TicketCategoryDocument struct {
	Id          int64          `json:"id"`
	Name        string         `json:"name"`
	URL         string         `gorm:"column:url" json:"url"`
	CategoryId  int64          `gorm:"column:category_id" json:"categoryId"`
	Category    TicketCategory `gorm:"foreignKey:category_id" json:"category"`
	Creator     string         `json:"creator"`
	Description string         `json:"description"`
	CreateTime  time.Time      `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time      `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketCategoryDocument) TableName() string {
	return TableNameTicketCategoryDocument
}

func (c *TicketCategoryDocument) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    TicketWorkflowWikiPreload,
	}
}

type TicketWorkflowState struct {
	Id                       int64          `json:"id"`
	StateName                string         `gorm:"column:state_name" json:"stateName"`
	Priority                 int64          `gorm:"column:priority" json:"priority"`
	CurrentFormFieldStateSet string         `gorm:"column:current_form_field_state_set" json:"currentFormFieldStateSet"`
	HiddenState              int64          `gorm:"column:hidden_state" json:"hiddenState"`
	ApprovalType             int64          `gorm:"column:approval_type" json:"approvalType"`
	ParticipantType          int64          `gorm:"column:participant_type" json:"participantType"`
	Participant              string         `gorm:"column:participant" json:"participant"`
	Webhook                  string         `gorm:"column:webhook" json:"webhook"`
	CategoryId               int64          `gorm:"column:category_id" json:"categoryId"`
	Category                 TicketCategory `gorm:"foreignKey:category_id" json:"category"`
	Creator                  string         `json:"creator"`
	CreateTime               time.Time      `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime               time.Time      `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketWorkflowState) TableName() string {
	return TableNameTicketWorkflowState
}

func (c *TicketWorkflowState) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    TicketWorkflowStatePreload,
		Order:      []string{"priority desc"},
	}
}

type TicketWorkflowTransition struct {
	Id                     int64               `json:"id"`
	ButtonName             string              `gorm:"column:button_name" json:"buttonName"`
	ButtonType             string              `gorm:"column:button_type" json:"buttonType"`
	CurrentWorkflowStateId int64               `gorm:"column:current_workflow_state_id" json:"currentWorkflowStateId"`
	TargetWorkflowStateId  int64               `gorm:"column:target_workflow_state_id" json:"targetWorkflowStateId"`
	SrcState               TicketWorkflowState `gorm:"foreignKey:current_workflow_state_id" json:"srcState"`
	TargetState            TicketWorkflowState `gorm:"foreignKey:target_workflow_state_id" json:"targetState"`
	CategoryId             int64               `gorm:"column:category_id" json:"categoryId"`
	Category               TicketCategory      `gorm:"foreignKey:category_id" json:"category"`
	Creator                string              `json:"creator"`
	CreateTime             time.Time           `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime             time.Time           `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketWorkflowTransition) TableName() string {
	return TableNameTicketWorkflowTransition
}

func (c *TicketWorkflowTransition) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    TicketWorkflowTransitionPreload,
	}
}

type TicketWorkflowRecord struct {
	Id         int64               `json:"id"`
	SN         string              `gorm:"column:sn" json:"sn"`
	StateId    int64               `gorm:"column:state_id" json:"stateId"`
	State      TicketWorkflowState `gorm:"foreignKey:state_id" json:"state"`
	CategoryId int64               `gorm:"column:category_id" json:"categoryId"`
	Category   TicketCategory      `gorm:"foreignKey:category_id" json:"category"`
	Status     int                 `json:"status"`
	Creator    string              `json:"creator"`
	CreateTime time.Time           `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time           `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketWorkflowRecord) TableName() string {
	return TableNameTicketWorkflowRecord
}

func (c *TicketWorkflowRecord) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    TicketRecordPreload,
	}
}

type TicketWorkflowRecordFlowLog struct {
	Id             int64                `json:"id"`
	Approver       string               `json:"approver"`
	RecordId       int64                `gorm:"column:ticket_workflow_record_id" json:"recordId"`
	Record         TicketWorkflowRecord `gorm:"foreignKey:ticket_workflow_record_id" json:"record"`
	NodePriority   int64                `gorm:"column:node_priority" json:"nodePriority"`
	Status         string               `gorm:"column:status" json:"status"`
	WorkflowNode   string               `gorm:"column:workflow_node" json:"workflowNode"`
	HandleDuration string               `gorm:"column:handle_duration" json:"handleDuration"`
	Suggestion     string               `json:"suggestion"`
	ApprovalStatus string               `gorm:"column:approval_status" json:"approvalStatus"`
	CreateTime     time.Time            `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime     time.Time            `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketWorkflowRecordFlowLog) TableName() string {
	return TableNameTicketWorkflowFlowLog
}

func (c *TicketWorkflowRecordFlowLog) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    TicketRecordFlowLogPreload,
	}
}

type TicketWorkflowRecordComment struct {
	Id           int64                `json:"id"`
	RecordId     int64                `gorm:"column:ticket_workflow_record_id" json:"recordId"`
	Record       TicketWorkflowRecord `gorm:"foreignKey:ticket_workflow_record_id" json:"record"`
	UserId       int64                `gorm:"column:user_id" json:"userId"`
	User         User                 `gorm:"references:Id" json:"user"`
	Content      string               `json:"content"`
	CurrentState string               `gorm:"column:current_state" json:"currentState"`
	CreateTime   time.Time            `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime   time.Time            `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketWorkflowRecordComment) TableName() string {
	return TableNameTicketWorkflowRecordComment
}

func (c *TicketWorkflowRecordComment) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    TicketRecordCommentPreload,
		Order:      []string{"update_time desc"},
	}
}

type TicketWorkflowCustomFormField struct {
	Id           int64          `json:"id"`
	CategoryId   int64          `gorm:"column:category_id" json:"categoryId"`
	Category     TicketCategory `gorm:"foreignKey:category_id" json:"category"`
	FieldType    int64          `gorm:"column:field_type" json:"fieldType"`
	FieldKey     string         `gorm:"column:field_key" json:"fieldKey"`
	FieldLabel   string         `gorm:"column:field_label" json:"fieldLabel"`
	Placeholder  string         `json:"placeholder"`
	Required     int            `json:"required"`
	DefaultValue string         `gorm:"column:default_value" json:"defaultValue"`
	RemoteURL    string         `gorm:"column:remote_url" json:"remoteURL"`
	FieldOptions string         `gorm:"column:field_options" json:"fieldOptions"`
	Priority     int64          `gorm:"column:priority" json:"priority"`
	Width        string         `json:"width"`
	RowMargin    int64          `gorm:"column:row_margin" json:"rowMargin"`
	Creator      string         `json:"creator"`
	CreateTime   time.Time      `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime   time.Time      `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketWorkflowCustomFormField) TableName() string {
	return TableNameTicketWorkflowCustomFormField
}

func (c *TicketWorkflowCustomFormField) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    TicketWorkflowStatePreload,
		Order:      []string{"priority desc"},
	}
}

type TicketWorkflowRecordFormField struct {
	Id         int64                `json:"id"`
	RecordId   int64                `gorm:"column:ticket_workflow_record_id" json:"recordId"`
	Record     TicketWorkflowRecord `gorm:"foreignKey:ticket_workflow_record_id" json:"record"`
	FieldType  int64                `gorm:"column:field_type" json:"fieldType"`
	FieldKey   string               `gorm:"column:field_key" json:"fieldKey"`
	FieldLabel string               `gorm:"column:field_label" json:"fieldLabel"`
	FieldValue string               `gorm:"column:field_value" json:"fieldValue"`
	Creator    string               `json:"creator"`
	CreateTime time.Time            `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time            `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketWorkflowRecordFormField) TableName() string {
	return TableNameTicketWorkflowRecordFormField
}

func (c *TicketWorkflowRecordFormField) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    TicketRecordFormPreload,
	}
}

type TicketRecordNodeUrge struct {
	Id          int64                `json:"id"`
	RecordId    int64                `gorm:"column:record_id" json:"recordId"`
	Record      TicketWorkflowRecord `gorm:"foreignKey:record_id" json:"record"`
	NodeStateId int64                `gorm:"column:node_state_id" json:"nodeStateId"`
	NodeState   TicketWorkflowState  `gorm:"foreignKey:node_state_id" json:"nodeState"`
	Creator     string               `json:"creator"`
	CreateTime  time.Time            `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time            `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*TicketRecordNodeUrge) TableName() string {
	return TableNameTicketRecordNodeUrge
}

func (c *TicketRecordNodeUrge) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

type ticketModel struct{}

func (c *ticketModel) GetRecordFormValue(recordId int64, fieldKey string, fieldType int64) (TicketWorkflowRecordFormField, error) {
	var result TicketWorkflowRecordFormField
	err := db.Where("field_key = ? AND field_type = ? AND ticket_workflow_record_id = ?",
		fieldKey, fieldType, recordId).
		First(&result).
		Error
	return result, err
}

func (c *ticketModel) FindByGroupId(model interface{}, groupId int64) error {
	err := db.Where("allowed_visibility_groups = '' OR FIND_IN_SET(?, allowed_visibility_groups) > 0", groupId).
		Find(model).
		Error
	return err
}

func (c *ticketModel) FindByProductIdByGroupId(model interface{}, productId, groupId int64) error {
	err := db.Where("product_id = ? AND allowed_visibility_groups = '' OR FIND_IN_SET(?, allowed_visibility_groups) > 0",
		productId, groupId).
		Preload("Product").
		Find(model).
		Error
	return err
}

func (c *ticketModel) FindByProductId(model interface{}, productId int64) error {
	err := db.Where("product_id = ?", productId).
		Preload("Product").
		Find(model).
		Error
	return err
}

func (c *ticketModel) ListProduct() ([]TicketProduct, error) {
	var productList []TicketProduct
	err := db.Find(&productList).Error
	return productList, err
}

func (c *ticketModel) FindCategoryByProductId(productId int64) ([]TicketCategory, error) {
	var list []TicketCategory
	err := db.Where("product_id = ?", productId).
		Preload("Product").
		Find(&list).
		Error
	return list, err
}

func (c *ticketModel) FindCategoryDocumentByCategoryId(categoryId int64) ([]TicketCategoryDocument, error) {
	var list []TicketCategoryDocument
	err := db.Where("category_id = ?", categoryId).
		Preload("Category").
		Preload("Category.Product").
		Find(&list).
		Error
	return list, err
}

func (c *ticketModel) GetParticipantModel(participantType int64) ModelOrmEngine {
	var md ModelOrmEngine
	switch participantType {
	case ParticipantTypeUser:
		md = &User{}
	case ParticipantTypeGroup:
		md = &Group{}
	default:
		md = &User{}
	}
	return md
}

func (c *ticketModel) FindParticipantList(participantType int64, participant string) (interface{}, error) {
	idList := strings.Split(participant, ",")
	int64s, err := parsers.ParseInt64ByStr(idList)
	if err != nil {
		return err, nil
	}
	var result []interface{}
	for _, id := range int64s {
		ormModel := c.GetParticipantModel(participantType)
		err = db.Where("id = ?", id).First(ormModel).Error
		if err != nil {
			continue
		}
		result = append(result, ormModel)
	}
	return result, nil
}

func (c *ticketModel) FindParticipantEmailList(participantType int64, participant string) ([]string, error) {
	idList := strings.Split(participant, ",")
	int64s, err := parsers.ParseInt64ByStr(idList)
	if err != nil {
		return nil, err
	}
	var emailList []string
	for _, id := range int64s {
		var user User
		switch participantType {
		case ParticipantTypeUser:
			user, err = UserModel.GetById(id)
		case ParticipantTypeGroup:
			user, err = UserModel.GetByGroupId(id)
		}
		if user.Id > 0 {
			emailList = append(emailList, user.Email)
		}
	}
	return emailList, nil
}

func (c *ticketModel) GetRecordById(recordId int64) (TicketWorkflowRecord, error) {
	var record TicketWorkflowRecord
	err := db.Where("id = ?", recordId).First(&record).Error
	return record, err
}

func (c *ticketModel) GetRecordBySn(sn string) (TicketWorkflowRecord, error) {
	var record TicketWorkflowRecord
	err := db.Where("sn = ?", sn).
		Preload("Category").
		Preload("Category.Product").
		Preload("State").
		First(&record).
		Error
	return record, err
}

func (c *ticketModel) GetWorkflowNodeById(id int64) (TicketWorkflowState, error) {
	var nodeState TicketWorkflowState
	err := db.Where("id = ?", id).First(&nodeState).Error
	return nodeState, err
}

func (c *ticketModel) FindStateByCategoryId(categoryId int64) ([]TicketWorkflowState, error) {
	var result []TicketWorkflowState
	stateCond := map[string]interface{}{"category_id": categoryId}
	if err := Orm.Scalars(&TicketWorkflowState{}, &result, stateCond); err != nil {
		return result, err
	}
	return result, nil
}
