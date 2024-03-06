package forms

type TicketProductCreate struct {
	Name                    string `validate:"required" json:"name"`
	Icon                    string `validate:"required" json:"icon"`
	AllowedVisibilityGroups string `json:"allowedVisibilityGroups"`
	Description             string `json:"description"`
}

type TicketProductUpdate struct {
	Icon                    string `validate:"required" json:"icon"`
	AllowedVisibilityGroups string `json:"allowedVisibilityGroups"`
	Description             string `json:"description"`
}

type TicketCategoryCreate struct {
	Name                    string `validate:"required" json:"name"`
	Icon                    string `validate:"required" json:"icon"`
	AllowedVisibilityGroups string `json:"allowedVisibilityGroups"`
	Description             string `json:"description"`
	ProductId               int64  `validate:"required" json:"productId"`
	SnRuleIdentifier        string `validate:"required,len=4" json:"snRuleIdentifier"`
	Webhook                 string `json:"webhook"`
	Layout                  string `json:"layout"`
}

type TicketCategoryUpdate struct {
	Icon                    string `validate:"required" json:"icon"`
	AllowedVisibilityGroups string `json:"allowedVisibilityGroups"`
	Description             string `json:"description"`
	Webhook                 string `json:"webhook"`
	Layout                  string `json:"layout"`
}

type TicketWorkflowCategoryDocumentCreate struct {
	Name        string `validate:"required" json:"name"`
	URL         string `validate:"required,http_url" json:"url"`
	CategoryId  int64  `validate:"required" json:"categoryId"`
	Description string `json:"description"`
}

type TicketWorkflowCategoryDocumentUpdate struct {
	Name        string `validate:"required" json:"name"`
	URL         string `validate:"required,http_url" json:"url"`
	Description string `json:"description"`
}

type TicketWorkflowNodeStateCreate struct {
	StateName                string `validate:"required" json:"stateName"`
	Priority                 int64  `validate:"required" json:"priority"`
	CurrentFormFieldStateSet string `validate:"required,json" json:"currentFormFieldStateSet"`
	HiddenState              int64  `validate:"required,gte=1,lte=2" json:"hiddenState"`
	ParticipantType          int64  `validate:"required,gte=1,lte=4" json:"participantType"`
	Participant              string `validate:"required" json:"participant"`
	Webhook                  string `json:"webhook"`
	CategoryId               int64  `validate:"required" json:"categoryId"`
	ApprovalType             int64  `validate:"required,gte=1,lte=4" json:"approvalType"`
}

type TicketWorkflowNodeStateUpdate struct {
	StateName                string `validate:"required" json:"stateName"`
	Priority                 int64  `validate:"required" json:"priority"`
	CurrentFormFieldStateSet string `validate:"required,json" json:"currentFormFieldStateSet"`
	HiddenState              int64  `validate:"required,gte=1,lte=2" json:"hiddenState"`
	ParticipantType          int64  `validate:"required,gte=1,lte=4" json:"participantType"`
	Participant              string `validate:"required" json:"participant"`
	Webhook                  string `json:"webhook"`
	ApprovalType             int64  `validate:"required,gte=1,lte=4" json:"approvalType"`
}

type TicketWorkflowNodeTransitionCreate struct {
	ButtonName             string `validate:"required" json:"buttonName"`
	ButtonType             string `validate:"required" json:"buttonType"`
	CurrentWorkflowStateId int64  `validate:"required,gt=0" json:"currentWorkflowStateId"`
	TargetWorkflowStateId  int64  `validate:"required,gt=0" json:"targetWorkflowStateId"`
	CategoryId             int64  `validate:"required" json:"categoryId"`
}

type TicketWorkflowNodeTransitionUpdate struct {
	ButtonName             string `validate:"required" json:"buttonName"`
	ButtonType             string `validate:"required" json:"buttonType"`
	CurrentWorkflowStateId int64  `validate:"required,gt=0" json:"currentWorkflowStateId"`
	TargetWorkflowStateId  int64  `validate:"required,gt=0" json:"targetWorkflowStateId"`
}

type TicketWorkflowRecordCreate struct {
	Title       string `validate:"required" json:"title"`
	CategoryId  int64  `validate:"required" json:"categoryId"`
	Description string `validate:"required" json:"description"`
}

type TicketWorkflowRecordUpdate struct {
	Description string `validate:"required" json:"description"`
}

type TicketWorkflowCustomFormCreate struct {
	CategoryId   int64  `validate:"required" json:"categoryId"`
	FieldType    int64  `validate:"required,gte=1,lte=14" json:"fieldType"`
	FieldKey     string `validate:"required" json:"fieldKey"`
	FieldLabel   string `validate:"required" json:"fieldLabel"`
	Placeholder  string `validate:"required" json:"placeholder"`
	Required     int    `validate:"required" json:"required"`
	DefaultValue string `json:"defaultValue"`
	RemoteURL    string `json:"remoteURL"`
	FieldOptions string `json:"fieldOptions"`
	Priority     int64  `validate:"required" json:"priority"`
	Width        string `json:"width"`
	RowMargin    int64  `json:"rowMargin"`
}

type TicketWorkflowCustomFormUpdate struct {
	Placeholder  string `validate:"required" json:"placeholder"`
	Required     int    `validate:"required" json:"required"`
	DefaultValue string `json:"defaultValue"`
	RemoteURL    string `json:"remoteURL"`
	FieldOptions string `json:"fieldOptions"`
	Priority     int64  `validate:"required" json:"priority"`
	Width        string `json:"width"`
	RowMargin    int64  `json:"rowMargin"`
}

type TicketRecordForm struct {
	FieldType  int64  `validate:"required,gt=0" json:"fieldType"`
	FieldLabel string `validate:"required" json:"fieldLabel"`
	FieldKey   string `validate:"required" json:"fieldKey"`
	FieldValue string `validate:"required" json:"fieldValue"`
}

type TicketRecordApproval struct {
	SrcId          int64  `validate:"required" json:"srcId"`
	TargetId       int64  `validate:"required" json:"targetId"`
	Suggestion     string `validate:"required" json:"suggestion"`
	Approver       string `validate:"required" json:"approver"`
	ButtonName     string `validate:"required" json:"buttonName"`
	ApproverStatus string `validate:"required" json:"approverStatus"`
	PreTime        string `json:"preTime"`
	CurTime        string `json:"CurTime"`
}

type TicketWebhook struct {
	SN              string      `json:"sn"`
	CurrentNode     string      `json:"currentNode"`
	CurrentApprover string      `json:"currentApprover"`
	RelLink         string      `json:"relLink"`
	CategoryName    string      `json:"categoryName"`
	FormValues      interface{} `json:"formValues"`
}

type TicketWorkflowUrge struct {
	NodeStateId int64  `validate:"required" json:"nodeStateId"`
	RecordSn    string `validate:"required" json:"recordSn"`
}

type TicketComment struct {
	Content      string `validate:"required" json:"content"`
	CurrentState string `validate:"required" json:"currentState"`
	UserId       int64  `validate:"required" json:"userId"`
	RecordId     int64  `validate:"required" json:"ticket_workflow_record_id"`
}
