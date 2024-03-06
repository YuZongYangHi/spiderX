package services

import (
	"errors"
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/cache"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/locales/en_us"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/locales/zh_cn"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/pkg/mail"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/requests"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"k8s.io/klog/v2"
	"net/url"
	"strings"
	"time"
)

type TicketService struct {
	ctx *base.Context
}

func (c *TicketService) FindByCategoryId(modelEngine models.ModelOrmEngine, result interface{}) error {
	workflowId := c.ctx.ParseInt("categoryId")
	if workflowId == 0 {
		return errors.New(base.InvalidInstanceId)
	}
	tx := models.OrmDB().Table(modelEngine.Builder().TableName).Where("category_id = ?", workflowId)
	tx = models.Orm.AddPreload(tx, modelEngine.Builder().Preload)
	return tx.Find(result).Error
}

func (c *TicketService) IsValidCategoryId(workflowId int64) bool {
	var workflow models.TicketCategory
	err := models.Orm.GetRelPreloadById(&workflow, workflowId)

	if err != nil || workflow.Id == 0 {
		return false
	}
	return true
}

func (c *TicketService) IsValidProductId(productId int64) bool {
	var product models.TicketProduct
	err := models.Orm.GetRelPreloadById(&product, productId)

	if err != nil || product.Id == 0 {
		return false
	}
	return true
}

func (c *TicketService) IsValidNodeStated(stateId int64) bool {
	var state models.TicketWorkflowState
	err := models.Orm.GetRelPreloadById(&state, stateId)

	if err != nil || state.Id == 0 {
		return false
	}
	return true
}

func (c *TicketService) GetCategoryById(categoryId int64) (models.TicketCategory, error) {
	var category models.TicketCategory
	err := models.Orm.GetById(&category, categoryId)
	return category, err
}

func NewTicketService(ctx *base.Context) *TicketService {
	return &TicketService{ctx: ctx}
}

type TicketProductService struct {
	ctx        *base.Context
	genericSet *Generic
}

func (c *TicketProductService) Create() error {
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: []base.ValidatorHandFunc{c.postFormCustomValidator},
		ModelEngine:            &models.TicketProduct{},
		Payload:                &forms.TicketProductCreate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Create(params)
}

func (c *TicketProductService) Update() error {
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: []base.ValidatorHandFunc{c.putFormCustomValidator},
		ModelEngine:            &models.TicketProduct{},
		Payload:                &forms.TicketProductUpdate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Update(params)
}

func (c *TicketProductService) Delete() error {
	return c.genericSet.Delete(&models.TicketProduct{})
}

func (c *TicketProductService) Retrieve() error {
	return c.genericSet.Retrieve(&models.TicketProduct{})
}

func (c *TicketProductService) List() error {
	var list []models.TicketProduct
	var err error

	user, _ := c.ctx.CurrentUser()
	if user.IsAdmin {
		list, err = models.TicketModel.ListProduct()
	} else {
		err = models.TicketModel.FindByGroupId(&list, user.GroupId)
	}

	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessResponse(c.ctx, list)
}

func (c *TicketProductService) putFormCustomValidator(payload interface{}) bool {
	m := payload.(*forms.TicketProductUpdate)
	return models.Orm.IsValidIdsByStr(&models.Group{}, m.AllowedVisibilityGroups)
}

func (c *TicketProductService) postFormCustomValidator(payload interface{}) bool {
	m := payload.(*forms.TicketProductCreate)
	return models.Orm.IsValidIdsByStr(&models.Group{}, m.AllowedVisibilityGroups)
}

func NewTicketProductService(ctx *base.Context) *TicketProductService {
	return &TicketProductService{
		ctx:        ctx,
		genericSet: NewGeneric(ctx),
	}
}

type TicketCategoryService struct {
	ctx        *base.Context
	genericSet *Generic
}

func (c *TicketCategoryService) Delete() error {
	return c.genericSet.Delete(&models.TicketCategory{})
}

func (c *TicketCategoryService) Retrieve() error {
	return c.genericSet.Retrieve(&models.TicketCategory{})
}

func (c *TicketCategoryService) List() error {
	var list []models.TicketCategory
	var err error

	user, _ := c.ctx.CurrentUser()
	if user.IsAdmin {
		err = models.Orm.FindAll(&list)
	} else {
		err = models.TicketModel.FindByGroupId(&list, user.GroupId)
	}

	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessResponse(c.ctx, list)
}

func (c *TicketCategoryService) ListByProductId() error {
	var list []models.TicketCategory
	var err error

	user, _ := c.ctx.CurrentUser()
	productId := c.ctx.ParseInt("productId")

	if user.IsAdmin {
		err = models.TicketModel.FindByProductId(&list, productId)
	} else {
		err = models.TicketModel.FindByProductIdByGroupId(&list, productId, user.GroupId)
	}
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessResponse(c.ctx, list)

}

func (c *TicketCategoryService) PutFormGroupsCustomValidator(payload interface{}) bool {
	m := payload.(*forms.TicketCategoryUpdate)
	return models.Orm.IsValidIdsByStr(&models.Group{}, m.AllowedVisibilityGroups)
}

func (c *TicketCategoryService) PostFormGroupIdsCustomValidator(payload interface{}) bool {
	m := payload.(*forms.TicketCategoryCreate)
	return models.Orm.IsValidIdsByStr(&models.Group{}, m.AllowedVisibilityGroups)
}

func (c *TicketCategoryService) PostFormProductIdCustomValidator(payload interface{}) bool {
	var product models.TicketProduct
	m := payload.(*forms.TicketCategoryCreate)
	err := models.Orm.GetRelPreloadById(&product, m.ProductId)

	if err != nil || product.Id == 0 {
		return false
	}
	return true
}

func (c *TicketCategoryService) Create() error {
	validators := []base.ValidatorHandFunc{
		c.PostFormGroupIdsCustomValidator,
		c.PostFormProductIdCustomValidator,
	}
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: validators,
		ModelEngine:            &models.TicketCategory{},
		Payload:                &forms.TicketCategoryCreate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Create(params)
}

func (c *TicketCategoryService) Update() error {
	validators := []base.ValidatorHandFunc{
		c.PutFormGroupsCustomValidator,
	}
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: validators,
		ModelEngine:            &models.TicketCategory{},
		Payload:                &forms.TicketCategoryUpdate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Update(params)
}

func (c *TicketCategoryService) FindByCategoryId() error {
	productId := c.ctx.ParseInt("productId")
	if productId == 0 {
		return base.BadRequestResponse(c.ctx, "productId not found")
	}
	list, err := models.TicketModel.FindCategoryByProductId(productId)
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessResponse(c.ctx, list)
}

func NewTicketCategoryService(ctx *base.Context) *TicketCategoryService {
	return &TicketCategoryService{
		ctx:        ctx,
		genericSet: NewGeneric(ctx),
	}
}

type TicketCategoryDocumentService struct {
	ctx        *base.Context
	genericSet *Generic
}

func (c *TicketCategoryDocumentService) Create() error {
	validators := []base.ValidatorHandFunc{
		c.PostFormWorkflowIdCustomValidator,
	}
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: validators,
		ModelEngine:            &models.TicketCategoryDocument{},
		Payload:                &forms.TicketWorkflowCategoryDocumentCreate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Create(params)
}

func (c *TicketCategoryDocumentService) PostFormWorkflowIdCustomValidator(payload interface{}) bool {
	var category models.TicketCategory
	m := payload.(*forms.TicketWorkflowCategoryDocumentCreate)
	err := models.Orm.GetRelPreloadById(&category, m.CategoryId)

	if err != nil || category.Id == 0 {
		return false
	}
	return true
}

func (c *TicketCategoryDocumentService) Update() error {
	params := GenericPostOrPutParams{
		ModelEngine: &models.TicketCategoryDocument{},
		Payload:     &forms.TicketWorkflowCategoryDocumentUpdate{},
		Extra:       c.ctx.GetUserMap(),
	}
	return c.genericSet.Update(params)
}

func (c *TicketCategoryDocumentService) Delete() error {
	return c.genericSet.Delete(&models.TicketCategoryDocument{})
}

func (c *TicketCategoryDocumentService) Retrieve() error {
	return c.genericSet.Retrieve(&models.TicketCategoryDocument{})
}

func (c *TicketCategoryDocumentService) ListByWorkflowId() error {
	categoryId := c.ctx.ParseInt("categoryId")
	if categoryId == 0 {
		return base.BadRequestResponse(c.ctx, "categoryId not found")
	}
	list, err := models.TicketModel.FindCategoryDocumentByCategoryId(categoryId)
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessResponse(c.ctx, list)
}

func NewTicketCategoryDocumentService(ctx *base.Context) *TicketCategoryDocumentService {
	return &TicketCategoryDocumentService{
		ctx:        ctx,
		genericSet: NewGeneric(ctx),
	}
}

/*
	Workflow Node State Service
*/

type TicketWorkflowNodeState struct {
	ctx        *base.Context
	genericSet *Generic
	core       *TicketService
}

func (c *TicketWorkflowNodeState) FindFormFields() (map[string]interface{}, error) {
	body, err := c.ctx.GetRequestBody()
	if err != nil {
		return nil, err
	}
	form := make(map[string]interface{}, 0)
	for key, value := range body {
		if strings.HasPrefix(key, "form") {
			form[key] = value
		}
	}
	return form, nil
}

func (c *TicketWorkflowNodeState) ValidParticipant(participant string, participantType, handleFuncType int64) bool {
	switch {
	case models.ParticipantTypeUser == participantType && participantType == handleFuncType:
		return models.Orm.IsValidIdsByStr(&models.User{}, participant)

	case models.ParticipantTypeGroup == participantType && participantType == handleFuncType:
		return models.Orm.IsValidIdsByStr(&models.Group{}, participant)
	default:
		return true
	}
}

func (c *TicketWorkflowNodeState) Delete() error {
	return c.genericSet.Delete(&models.TicketWorkflowState{})
}

func (c *TicketWorkflowNodeState) Retrieve() error {
	return c.genericSet.Retrieve(&models.TicketWorkflowState{})
}

func (c *TicketWorkflowNodeState) ValidCreateFormWorkflowId(payload interface{}) bool {
	m := payload.(*forms.TicketWorkflowNodeStateCreate)
	return c.core.IsValidCategoryId(m.CategoryId)
}

func (c *TicketWorkflowNodeState) ValidCreateFormGroupIds(payload interface{}) bool {
	m := payload.(*forms.TicketWorkflowNodeStateCreate)
	return c.ValidParticipant(m.Participant, m.ParticipantType, models.ParticipantTypeUser)
}

func (c *TicketWorkflowNodeState) ValidCreateFormUserIds(payload interface{}) bool {
	m := payload.(*forms.TicketWorkflowNodeStateCreate)
	return c.ValidParticipant(m.Participant, m.ParticipantType, models.ParticipantTypeGroup)
}

func (c *TicketWorkflowNodeState) ValidUpdateFormGroupIds(payload interface{}) bool {
	m := payload.(*forms.TicketWorkflowNodeStateUpdate)
	return c.ValidParticipant(m.Participant, m.ParticipantType, models.ParticipantTypeUser)
}

func (c *TicketWorkflowNodeState) ValidUpdateFormUserIds(payload interface{}) bool {
	m := payload.(*forms.TicketWorkflowNodeStateUpdate)
	return c.ValidParticipant(m.Participant, m.ParticipantType, models.ParticipantTypeGroup)
}

func (c *TicketWorkflowNodeState) Create() error {
	validators := []base.ValidatorHandFunc{
		c.ValidCreateFormWorkflowId,
		c.ValidCreateFormGroupIds,
		c.ValidCreateFormUserIds,
	}
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: validators,
		ModelEngine:            &models.TicketWorkflowState{},
		Payload:                &forms.TicketWorkflowNodeStateCreate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Create(params)
}

func (c *TicketWorkflowNodeState) Update() error {
	validators := []base.ValidatorHandFunc{
		c.ValidUpdateFormUserIds,
		c.ValidUpdateFormGroupIds,
	}
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: validators,
		ModelEngine:            &models.TicketWorkflowState{},
		Payload:                &forms.TicketWorkflowNodeStateUpdate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Update(params)
}

func NewTicketWorkflowNodeState(ctx *base.Context) *TicketWorkflowNodeState {
	return &TicketWorkflowNodeState{
		ctx:        ctx,
		genericSet: NewGeneric(ctx),
		core:       NewTicketService(ctx),
	}
}

/*
	Workflow Node State Transition
*/

type TicketWorkflowNodeStateTransition struct {
	ctx           *base.Context
	genericSet    *Generic
	core          *TicketService
	recordService *TicketRecordService
}

func (c *TicketWorkflowNodeStateTransition) Delete() error {
	return c.genericSet.Delete(&models.TicketWorkflowTransition{})
}

func (c *TicketWorkflowNodeStateTransition) Retrieve() error {
	return c.genericSet.Retrieve(&models.TicketWorkflowTransition{})
}

func (c *TicketWorkflowNodeStateTransition) Create() error {
	validators := []base.ValidatorHandFunc{
		c.ValidCreateFormWorkflowId,
	}
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: validators,
		ModelEngine:            &models.TicketWorkflowTransition{},
		Payload:                &forms.TicketWorkflowNodeTransitionCreate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Create(params)
}

func (c *TicketWorkflowNodeStateTransition) Update() error {
	validators := []base.ValidatorHandFunc{
		c.ValidUpdateFormWorkflowId,
	}
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: validators,
		ModelEngine:            &models.TicketWorkflowTransition{},
		Payload:                &forms.TicketWorkflowNodeTransitionUpdate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Update(params)
}

func (c *TicketWorkflowNodeStateTransition) ValidCreateFormWorkflowId(payload interface{}) bool {
	m := payload.(*forms.TicketWorkflowNodeTransitionCreate)
	return c.Valid(m.CurrentWorkflowStateId, m.TargetWorkflowStateId, m.CategoryId)
}

func (c *TicketWorkflowNodeStateTransition) ValidUpdateFormWorkflowId(payload interface{}) bool {
	m := payload.(*forms.TicketWorkflowNodeTransitionUpdate)
	return c.Valid(m.CurrentWorkflowStateId, m.TargetWorkflowStateId, 0)
}

func (c *TicketWorkflowNodeStateTransition) ValidTransitionIdIsequal(src, dest int64) bool {
	return src == dest
}

func (c *TicketWorkflowNodeStateTransition) Valid(srrNodeId, destNodeId, workflowId int64) bool {
	stateIds := []int64{srrNodeId, destNodeId}

	if workflowId > 0 {
		if !c.core.IsValidCategoryId(workflowId) {
			return false
		}
	}

	for _, id := range stateIds {
		if !c.core.IsValidNodeStated(id) {
			return false
		}
	}

	if c.ValidTransitionIdIsequal(srrNodeId, destNodeId) {
		return false
	}
	return true
}

func (c *TicketWorkflowNodeStateTransition) ListProcessButtonTransition() ([]models.TicketWorkflowTransition, error) {
	var result []models.TicketWorkflowTransition
	sn := c.ctx.Param("sn")
	if sn == "" {
		return nil, errors.New(base.InvalidInstanceId)
	}
	record, err := models.TicketModel.GetRecordBySn(sn)
	if err != nil {
		return result, err
	}

	cond := map[string]interface{}{
		"current_workflow_state_id": record.StateId,
		"category_id":               record.CategoryId,
	}

	user, _ := c.ctx.CurrentUser()
	if user.IsAdmin || c.recordService.CheckUserHasCurrentNodeApproval(*user, record.State) {
		err = models.Orm.Scalars(&models.TicketWorkflowTransition{}, &result, cond)
		return result, err
	}
	return result, nil
}

func NewTicketWorkflowNodeStateTransition(ctx *base.Context) *TicketWorkflowNodeStateTransition {
	return &TicketWorkflowNodeStateTransition{
		ctx:           ctx,
		genericSet:    NewGeneric(ctx),
		core:          NewTicketService(ctx),
		recordService: NewTicketRecordService(ctx),
	}
}

/*
	Workflow Custom Form
*/

type TicketWorkflowCustomForm struct {
	ctx        *base.Context
	genericSet *Generic
	core       *TicketService
}

func (c *TicketWorkflowCustomForm) Delete() error {
	return c.genericSet.Delete(&models.TicketWorkflowCustomFormField{})
}

func (c *TicketWorkflowCustomForm) Retrieve() error {
	return c.genericSet.Retrieve(&models.TicketWorkflowCustomFormField{})
}

func (c *TicketWorkflowCustomForm) Valid(payload interface{}) bool {
	form := payload.(*forms.TicketWorkflowCustomFormCreate)
	return c.core.IsValidCategoryId(form.CategoryId)
}
func (c *TicketWorkflowCustomForm) Create() error {
	validators := []base.ValidatorHandFunc{
		c.Valid,
	}
	params := GenericPostOrPutParams{
		ValidatorHandFuncHooks: validators,
		ModelEngine:            &models.TicketWorkflowCustomFormField{},
		Payload:                &forms.TicketWorkflowCustomFormCreate{},
		Extra:                  c.ctx.GetUserMap(),
	}
	return c.genericSet.Create(params)
}

func (c *TicketWorkflowCustomForm) Update() error {
	params := GenericPostOrPutParams{
		ModelEngine: &models.TicketWorkflowCustomFormField{},
		Payload:     &forms.TicketWorkflowCustomFormUpdate{},
		Extra:       c.ctx.GetUserMap(),
	}
	return c.genericSet.Update(params)
}

func (c *TicketWorkflowCustomForm) ListByCategoryId() error {
	categoryId := c.ctx.ParseInt("categoryId")
	if categoryId == 0 {
		return base.BadRequestResponse(c.ctx, base.InvalidInstanceId)
	}

	var result []models.TicketWorkflowCustomFormField
	cond := map[string]interface{}{"category_id": categoryId}
	err := models.Orm.Scalars(&models.TicketWorkflowCustomFormField{}, &result, cond)
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessResponse(c.ctx, result)
}

func NewTicketWorkflowCustomForm(ctx *base.Context) *TicketWorkflowCustomForm {
	return &TicketWorkflowCustomForm{
		ctx:        ctx,
		genericSet: NewGeneric(ctx),
		core:       NewTicketService(ctx),
	}
}

/*
	Ticket Record Service
*/

type TicketRecordService struct {
	ctx        *base.Context
	genericSet *Generic
	core       *TicketService
	cache      *cache.TicketCache
	httpClient *requests.HTTPClient
	user       *models.User
}

func (c *TicketRecordService) GetRecordObjBySnByRequest() (models.TicketWorkflowRecord, error) {
	var record models.TicketWorkflowRecord
	sn := c.ctx.Param("sn")

	if sn == "" {
		return record, errors.New(base.InvalidInstanceId)
	}
	record, err := models.TicketModel.GetRecordBySn(sn)
	if err != nil {
		return record, err
	}
	return record, nil
}

func (c *TicketRecordService) Subscribe(record models.TicketWorkflowRecord,
	transitionForm forms.TicketRecordApproval, formValues []forms.TicketRecordForm) error {
	state, err := c.GetStateNodeById(transitionForm.TargetId)
	if err != nil {
		return err
	}

	reqBody := forms.TicketWebhook{
		SN:              record.SN,
		CurrentNode:     state.StateName,
		CurrentApprover: state.Participant,
		RelLink:         fmt.Sprintf("/ticket/workflow/%s", record.SN),
		CategoryName:    state.Category.Name,
		FormValues:      formValues,
	}

	category, _ := c.core.GetCategoryById(record.CategoryId)

	urls := []string{
		category.Webhook,
		state.Webhook,
	}

	for _, webhookURL := range urls {
		if webhookURL == "" {
			continue
		}
		if err = c.SendWebhook(webhookURL, reqBody); err != nil {
			klog.Errorf("send webhook error: %s", err.Error())
		}
	}
	return nil
}

func (c *TicketRecordService) SendWebhook(rawURL string, body forms.TicketWebhook) error {
	if _, err := url.ParseRequestURI(rawURL); err != nil {
		return err
	}

	var result interface{}
	req := &requests.PostOrPutParams{
		URL:         rawURL,
		Body:        &body,
		Empowerment: &result,
	}

	return c.httpClient.POST(req)
}

func (c *TicketRecordService) GetSrcTransitionByStateId(stateId int64, stateType string) (models.TicketWorkflowTransition, error) {
	var transition models.TicketWorkflowTransition
	condition := map[string]interface{}{"current_workflow_state_id": stateId, "button_type": stateType}
	err := models.Orm.Get(&transition, condition)
	return transition, err
}

func (c *TicketRecordService) GetTargetTransitionByStateId(stateId int64, stateType string) (models.TicketWorkflowTransition, error) {
	var transition models.TicketWorkflowTransition
	condition := map[string]interface{}{"target_workflow_state_id": stateId, "button_type": stateType}
	err := models.Orm.Get(&transition, condition)
	return transition, err
}

func (c *TicketRecordService) GetStateNodeById(stateId int64) (models.TicketWorkflowState, error) {
	var state models.TicketWorkflowState
	condition := map[string]interface{}{"id": stateId}
	err := models.Orm.Get(&state, condition)
	return state, err
}

func (c *TicketRecordService) SetRecordNextNodeState(record models.TicketWorkflowRecord, targetStateId int64,
	approvalType string) error {
	states, err := models.TicketModel.FindStateByCategoryId(record.CategoryId)
	if err != nil {
		klog.Errorf("get current ticket record node state list error: %s", err.Error())
		return err
	}

	if len(states) == 0 || len(states) < 3 {
		return errors.New(base.TicketWorkflowNodeStateNoComplete)
	}

	transition, err := c.GetSrcTransitionByStateId(targetStateId, approvalType)
	if err != nil {
		klog.Errorf("get next transition error: %s", err.Error())
		return err
	}

	for {
		flowNodeTransition := forms.TicketRecordApproval{
			SrcId:    transition.TargetWorkflowStateId,
			TargetId: transition.TargetWorkflowStateId,
			Approver: "system",
			CurTime:  record.UpdateTime.Format("2006-01-02 15:04:05"),
			PreTime:  record.UpdateTime.Format("2006-01-02 15:04:05"),
		}
		switch transition.TargetState.ApprovalType {
		case models.ApprovalTypeAutoPass:
			transition, err = c.GetSrcTransitionByStateId(transition.TargetWorkflowStateId, "agree")
			flowNodeTransition.Suggestion = "系统自动通过"
			flowNodeTransition.ButtonName = transition.ButtonName
			flowNodeTransition.ApproverStatus = transition.ButtonType
			c.AddRecordFlowLog(record, flowNodeTransition)
		case models.ApprovalTypeAutoReject:
			transition, err = c.GetSrcTransitionByStateId(transition.TargetWorkflowStateId, "reject")
			flowNodeTransition.Suggestion = "系统自动拒绝"
			flowNodeTransition.ButtonName = transition.ButtonName
			flowNodeTransition.ApproverStatus = transition.ButtonType
			c.AddRecordFlowLog(record, flowNodeTransition)
		case models.ApprovalTypePerson, models.ApprovalTypeNoNeed:
			if transition.TargetWorkflowStateId == states[len(states)-1].Id {
				record.Status = 1
				record.State = states[len(states)-1]
			} else {
				record.State = transition.TargetState
			}
			return models.OrmDB().Save(&record).Error
		}
	}
}

func (c *TicketRecordService) AddRecordFlowLog(record models.TicketWorkflowRecord, approvalForm forms.TicketRecordApproval) error {
	state, _ := c.GetStateNodeById(approvalForm.SrcId)
	flowLog := models.TicketWorkflowRecordFlowLog{
		Approver:       approvalForm.Approver,
		RecordId:       record.Id,
		Status:         approvalForm.ButtonName,
		WorkflowNode:   state.StateName,
		NodePriority:   state.Priority,
		ApprovalStatus: approvalForm.ApproverStatus,
		HandleDuration: parsers.GetTimeDifference(approvalForm.PreTime, approvalForm.CurTime),
		Suggestion:     approvalForm.Suggestion,
	}
	return models.OrmDB().Create(&flowLog).Error
}

func (c *TicketRecordService) AddOrPutRecordFormFields(record models.TicketWorkflowRecord, formValues []forms.TicketRecordForm) error {
	var err error
	for _, data := range formValues {
		formInstance := models.TicketWorkflowRecordFormField{
			FieldType:  data.FieldType,
			FieldKey:   data.FieldKey,
			FieldLabel: data.FieldLabel,
			FieldValue: data.FieldValue,
			RecordId:   record.Id,
			Creator:    c.ctx.CurrentUsername(),
			CreateTime: time.Now(),
			UpdateTime: time.Now(),
		}

		formRecordDB, _ := models.TicketModel.GetRecordFormValue(record.Id, data.FieldKey, data.FieldType)
		if formRecordDB.Id == 0 {
			err = models.OrmDB().Create(&formInstance).Error
		} else {
			formInstance.Id = formRecordDB.Id
			err = models.OrmDB().Save(&formInstance).Error
		}
		if err != nil {
			klog.Errorf("recordId: %d, fieldKey: %s, fieldType: %d add to db error: %s", record.Id, data.FieldKey, data.FieldType)
			return err
		}
	}
	return nil
}

func (c *TicketRecordService) RecordHandleProcess(
	formValues []forms.TicketRecordForm,
	record models.TicketWorkflowRecord, transitionFormValue forms.TicketRecordApproval) error {
	var err error

	if err = c.AddOrPutRecordFormFields(record, formValues); err != nil {
		return err
	}
	if err = c.AddRecordFlowLog(record, transitionFormValue); err != nil {
		return err
	}
	if err = c.Subscribe(record, transitionFormValue, formValues); err != nil {
		klog.Errorf("sn: %s Subscribe error: %s", record.SN, err.Error())
	}
	return nil
}

func (c *TicketRecordService) CreateTicketRecord() error {
	var realFormValues []forms.TicketRecordForm
	var state models.TicketWorkflowState

	user, _ := c.ctx.CurrentUser()

	err := c.ctx.Bind(&realFormValues)
	if err != nil {
		return base.BadRequestResponse(c.ctx, err.Error())
	}

	category, err := c.core.GetCategoryById(c.ctx.ParseInt("categoryId"))
	if category.Id == 0 {
		return base.BadRequestResponse(c.ctx, base.InvalidInstanceId)
	}

	err = models.Orm.Get(&state, map[string]interface{}{"category_id": category.Id})
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	transition, err := c.GetSrcTransitionByStateId(state.Id, "agree")
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	sn, err := c.cache.GetTicketRecordSnBySnRule(category.SnRuleIdentifier)
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	var record models.TicketWorkflowRecord
	recordModel := models.TicketWorkflowRecord{
		SN:         sn,
		StateId:    transition.TargetWorkflowStateId,
		CategoryId: category.Id,
		Creator:    user.Username,
	}

	if err = models.OrmDB().
		Preload("State").
		Create(&recordModel).
		Scan(&record).
		Error; err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	approvalForm := forms.TicketRecordApproval{
		TargetId:       transition.TargetWorkflowStateId,
		Suggestion:     "",
		ApproverStatus: transition.ButtonType,
		Approver:       user.Username,
		ButtonName:     transition.ButtonName,
		CurTime:        parsers.TimeNowFormat(),
		PreTime:        parsers.TimeNowFormat(),
		SrcId:          transition.SrcState.Id,
	}

	if err = c.RecordHandleProcess(realFormValues, record, approvalForm); err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	if err = c.SetRecordNextNodeState(recordModel, state.Id, models.ApprovalButtonAgree); err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	resp := map[string]string{
		"sn":       record.SN,
		"nodeName": transition.TargetState.StateName,
	}
	return base.SuccessResponse(c.ctx, resp)
}

func (c *TicketRecordService) UpdateTicketRecord() error {
	sn := c.ctx.Param("sn")
	approvalType := c.ctx.QueryParam("approvalType")
	suggestion := c.ctx.QueryParam("suggestion")

	if sn == "" || approvalType == "" {
		return base.BadRequestResponse(c.ctx, base.InvalidInstanceId)
	}

	var formValues []forms.TicketRecordForm
	err := c.ctx.Bind(&formValues)
	if err != nil {
		return base.BadRequestResponse(c.ctx, err.Error())
	}

	record, err := models.TicketModel.GetRecordBySn(sn)
	if err != nil {
		return base.BadRequestResponse(c.ctx, err.Error())
	}

	if record.Status != 0 {
		return base.ServerInternalErrorResponse(c.ctx, base.TicketRecordNoProcess)
	}

	currentTransition, err := c.GetSrcTransitionByStateId(record.StateId, approvalType)
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	preTime := record.UpdateTime.Format("2006-01-02 15:04:05")
	record.State = currentTransition.TargetState
	record.StateId = currentTransition.TargetState.Id

	if err = models.OrmDB().Save(&record).Error; err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	approvalForm := forms.TicketRecordApproval{
		TargetId:       currentTransition.TargetWorkflowStateId,
		Suggestion:     suggestion,
		ApproverStatus: currentTransition.ButtonType,
		Approver:       c.user.Username,
		ButtonName:     currentTransition.ButtonName,
		PreTime:        preTime,
		CurTime:        parsers.TimeNowFormat(),
		SrcId:          currentTransition.SrcState.Id,
	}

	if err = c.RecordHandleProcess(formValues, record, approvalForm); err != nil {
		klog.Errorf("update record handle process error: %s", err.Error())
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	if err = c.SetRecordNextNodeState(record, currentTransition.SrcState.Id, approvalType); err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	resp := map[string]string{
		"sn":       record.SN,
		"nodeName": currentTransition.TargetState.StateName,
	}
	return base.SuccessResponse(c.ctx, resp)
}

func (c *TicketRecordService) Discard(record models.TicketWorkflowRecord) error {
	nodeStates, err := models.TicketModel.FindStateByCategoryId(record.CategoryId)
	if err != nil {
		return err
	}

	srcStateId := record.StateId
	target := nodeStates[len(nodeStates)-1]

	if srcStateId == target.Id {
		return errors.New(base.TicketRecordIsDiscard)
	}
	preTime := record.UpdateTime.Format("2006-01-02 15:04:05")
	record.Status = 2
	record.State = target

	if err = models.OrmDB().Save(&record).Error; err != nil {
		return err
	}

	transition := forms.TicketRecordApproval{
		SrcId:          srcStateId,
		TargetId:       target.Id,
		Suggestion:     "工单废弃, 流程结束",
		Approver:       c.ctx.CurrentUsername(),
		ButtonName:     "废弃",
		ApproverStatus: "cancel",
		CurTime:        parsers.TimeNowFormat(),
		PreTime:        preTime,
	}

	if err = c.RecordHandleProcess([]forms.TicketRecordForm{}, record, transition); err != nil {
		return err
	}
	return nil
}

func (c *TicketRecordService) CheckUserHasCurrentNodeApproval(user models.User, node models.TicketWorkflowState) bool {
	var instanceId int64
	switch node.ParticipantType {
	case models.ParticipantTypeUser:
		instanceId = user.Id
	case models.ParticipantTypeGroup:
		instanceId = user.GroupId
	}
	if hit := util.ContainsInt64(node.Participant, ",", instanceId); hit {
		return true
	}
	return false
}

func (c *TicketRecordService) CheckUserHasRecordApproval(record models.TicketWorkflowRecord, user models.User) (bool, error) {
	if user.IsAdmin {
		return true, nil
	}
	nodeStates, err := models.TicketModel.FindStateByCategoryId(record.CategoryId)
	if err != nil {
		return false, err
	}
	for _, nodeState := range nodeStates {
		if c.CheckUserHasCurrentNodeApproval(user, nodeState) {
			return true, nil
		}
	}
	return false, nil
}

func (c *TicketRecordService) HasPermissions() (bool, error) {
	record, err := c.GetRecordObjBySnByRequest()
	if err != nil {
		return false, err
	}

	hasAppRoval, err := c.CheckUserHasRecordApproval(record, *c.user)
	if err != nil {
		return false, err
	}

	if (c.user.IsAdmin) || (record.Creator == c.user.Username) || (hasAppRoval) {
		return true, nil
	}
	return false, nil
}

func (c *TicketRecordService) Delete() error {
	return c.genericSet.Delete(&models.TicketWorkflowRecord{})
}

func (c *TicketRecordService) ListForm() ([]models.TicketWorkflowRecordFormField, error) {
	sn := c.ctx.Param("sn")
	if sn == "" {
		return nil, errors.New(base.InvalidInstanceId)
	}
	record, err := models.TicketModel.GetRecordBySn(sn)
	if err != nil {
		return nil, err
	}

	var result []models.TicketWorkflowRecordFormField
	cond := map[string]interface{}{"ticket_workflow_record_id": record.Id}
	err = models.Orm.Scalars(&models.TicketWorkflowRecordFormField{}, &result, cond)
	return result, err
}

func NewTicketRecordService(ctx *base.Context) *TicketRecordService {
	user, _ := ctx.CurrentUser()
	return &TicketRecordService{
		ctx:        ctx,
		genericSet: NewGeneric(ctx),
		core:       NewTicketService(ctx),
		cache:      cache.NewTicketCache(),
		httpClient: requests.NewHTTPClient(),
		user:       user,
	}
}

type TicketWorkflowUrge struct {
	ctx        *base.Context
	genericSet *Generic
}

func (c *TicketWorkflowUrge) GetForm() (forms.TicketWorkflowUrge, error) {
	sn := c.ctx.Param("sn")
	nodeId := c.ctx.ParseInt("nodeId")

	f := forms.TicketWorkflowUrge{
		NodeStateId: nodeId,
		RecordSn:    sn,
	}
	if sn == "" || nodeId == 0 {
		return f, errors.New(base.InvalidInstanceId)
	}
	return f, nil
}

func (c *TicketWorkflowUrge) SendUrge() error {
	f, err := c.GetForm()
	if err != nil {
		return err
	}

	user, _ := c.ctx.CurrentUser()

	record, _ := models.TicketModel.GetRecordBySn(f.RecordSn)

	if record.Creator != user.Username {
		return errors.New(base.HTTP403Message)
	}

	m := models.TicketRecordNodeUrge{
		RecordId:    record.Id,
		NodeStateId: f.NodeStateId,
		Creator:     user.Username,
	}

	var mailTitle string
	var mailContent string

	switch config.ApiServerConfig().Language {
	case config.LanguageZhCn:
		mailTitle = zh_cn.TicketRecordNodeUrgeTitle
		mailContent = zh_cn.TicketRecordNodeUrgeContent
	case config.LanguageEnUs:
		mailTitle = en_us.TicketRecordNodeUrgeTitle
		mailContent = en_us.TicketRecordNodeUrgeContent
	}

	emailList, err := models.TicketModel.FindParticipantEmailList(record.State.ParticipantType, record.State.Participant)
	if err != nil {
		return err
	}

	link := fmt.Sprintf("%s/ticket/workflow/:%s", c.ctx.GetRequestDomain(), record.SN)
	mailContent = fmt.Sprintf(mailContent, link)

	err = mail.Send(emailList, mailTitle, mailContent)
	if err != nil {
		klog.Errorf("urge mail send fail: %s", err.Error())
		return err
	}
	return models.OrmDB().Create(&m).Error
}

func (c *TicketWorkflowUrge) GetUrge() (models.TicketRecordNodeUrge, error) {
	var urge models.TicketRecordNodeUrge
	f, err := c.GetForm()
	if err != nil {
		return urge, err
	}

	record, err := models.TicketModel.GetRecordBySn(f.RecordSn)
	if err != nil {
		return urge, err
	}

	user, _ := c.ctx.CurrentUser()
	nodeState, err := models.TicketModel.GetWorkflowNodeById(f.NodeStateId)
	if err != nil {
		return urge, err
	}

	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	todayEnd := todayStart.AddDate(0, 0, 1).Add(-time.Nanosecond)

	err = models.OrmDB().
		Where("record_id = ? AND node_state_id = ? AND creator = ? AND create_time BETWEEN ? AND ?",
			record.Id, nodeState.Id, user.Username, todayStart, todayEnd).
		Preload("Record").
		First(&urge).
		Error
	return urge, err
}

func NewTicketWorkflowUrge(ctx *base.Context) *TicketWorkflowUrge {
	return &TicketWorkflowUrge{
		ctx:        ctx,
		genericSet: NewGeneric(ctx),
	}
}

type TicketRecordComment struct {
	ctx        *base.Context
	genericSet *Generic
}

func (c *TicketRecordComment) GetRecord() (models.TicketWorkflowRecord, error) {
	var record models.TicketWorkflowRecord
	var err error

	sn := c.ctx.Param("sn")
	if sn == "" {
		return record, errors.New(base.InvalidInstanceId)
	}

	record, err = models.TicketModel.GetRecordBySn(sn)
	if err != nil {
		return record, err
	}
	return record, nil
}

func (c *TicketRecordComment) ListComment() error {
	record, err := c.GetRecord()
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}

	cond := map[string]interface{}{
		"ticket_workflow_record_id": record.Id,
	}
	var commentList []models.TicketWorkflowRecordComment
	err = models.Orm.Scalars(&models.TicketWorkflowRecordComment{}, &commentList, cond)
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessResponse(c.ctx, commentList)
}

func (c *TicketRecordComment) AddComment() error {
	_, err := c.GetRecord()
	if err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	params := GenericPostOrPutParams{
		ModelEngine: &models.TicketWorkflowRecordComment{},
		Payload:     &forms.TicketComment{},
	}
	return c.genericSet.Create(params)
}

func NewTicketRecordComment(c *base.Context) *TicketRecordComment {
	return &TicketRecordComment{
		ctx:        c,
		genericSet: NewGeneric(c),
	}
}
