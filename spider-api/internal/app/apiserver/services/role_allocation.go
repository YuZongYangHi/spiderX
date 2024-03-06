package services

import (
	"errors"
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
)

type RoleResourcePermissionsParams struct {
	RoleTableName            string
	RoleRelModal             interface{}
	RoleField                string
	RoleBindingRoleTableName string
	RoleBindingRoleModel     interface{}
}

type RoleParams struct {
	TableName string
	Model     interface{}
}

type RoleBindingParams struct {
	TableName string
	Model     interface{}
}

type RoleResourcePermissionsAbstract interface {
	Payload() interface{}
	PermissionsParams() RoleResourcePermissionsParams
	GetRolePermissionsId() int64
	Create(roleBindingId int64) (interface{}, error)
	Delete(id int64) error
	RoleParams() RoleParams
	RoleBindingParams() RoleBindingParams
	CreateRoleBinding(roleId int64) int64
	GetRoleBindingId() int64
}

type RoleResourcePermissionsGroup struct {
	payload          *forms.MenuRoleGrantGroup
	RoleBindingModel *models.MenuRoleBinding
}

type RoleResourcePermissionsUser struct {
	payload          *forms.MenuRoleGrantUser
	RoleBindingModel *models.MenuRoleBinding
}

type APIRoleRelGroup struct {
	payload          *forms.APIRoleRelGrantGroup
	RoleBindingModel *models.APIRoleBinding
}

type APIRoleRelUser struct {
	payload          *forms.APIRoleRelGrantUser
	RoleBindingModel *models.APIRoleBinding
}

func (c *APIRoleRelUser) Payload() interface{} {
	return c.payload
}

func (c *APIRoleRelUser) GetRolePermissionsId() int64 {
	return c.payload.UserId
}

func (c *APIRoleRelUser) RoleParams() RoleParams {
	return RoleParams{
		TableName: models.TableNameRBACAPIRole,
		Model:     &models.APIRole{},
	}
}

func (c *APIRoleRelUser) RoleBindingParams() RoleBindingParams {
	return RoleBindingParams{
		TableName: models.TableNameRBACAPIRoleBinding,
		Model:     c.RoleBindingModel,
	}
}

func (c *APIRoleRelUser) CreateRoleBinding(roleId int64) int64 {
	m := &models.APIRoleBinding{
		RoleId: roleId,
	}
	err := models.RBACAPIRoleBindingModel.Add(m)
	if err == nil {
		return m.Id
	}
	return 0
}
func (c *APIRoleRelUser) GetRoleBindingId() int64 {
	return c.RoleBindingModel.Id
}

func (c *APIRoleRelUser) PermissionsParams() RoleResourcePermissionsParams {
	return RoleResourcePermissionsParams{
		RoleTableName:            models.TableNameUser,
		RoleRelModal:             &models.User{},
		RoleField:                "user_id",
		RoleBindingRoleTableName: models.TableNameRBACAPIRoleBindingRelUser,
		RoleBindingRoleModel:     &models.APIRoleBindingRelUser{},
	}
}

func (c *APIRoleRelUser) Create(rbId int64) (interface{}, error) {
	m := models.APIRoleBindingRelUser{
		UserId:        c.payload.UserId,
		RoleBindingId: rbId,
	}
	if err := models.RBACAPIRoleBindingUserModel.Add(m); err != nil {
		return nil, err
	}
	return c.payload, nil
}

func (c *APIRoleRelUser) Delete(id int64) error {
	return models.RBACAPIRoleBindingUserModel.DeleteById(id)
}

func (c *APIRoleRelGroup) Payload() interface{} {
	return c.payload
}

func (c *APIRoleRelGroup) GetRolePermissionsId() int64 {
	return c.payload.GroupId
}

func (c *APIRoleRelGroup) RoleParams() RoleParams {
	return RoleParams{
		TableName: models.TableNameRBACAPIRole,
		Model:     &models.APIRole{},
	}
}

func (c *APIRoleRelGroup) RoleBindingParams() RoleBindingParams {
	return RoleBindingParams{
		TableName: models.TableNameRBACAPIRoleBinding,
		Model:     c.RoleBindingModel,
	}
}

func (c *APIRoleRelGroup) CreateRoleBinding(roleId int64) int64 {
	m := &models.APIRoleBinding{
		RoleId: roleId,
	}
	err := models.RBACAPIRoleBindingModel.Add(m)
	if err == nil {
		return m.Id
	}
	return 0
}
func (c *APIRoleRelGroup) GetRoleBindingId() int64 {
	return c.RoleBindingModel.Id
}

func (c *APIRoleRelGroup) PermissionsParams() RoleResourcePermissionsParams {
	return RoleResourcePermissionsParams{
		RoleTableName:            models.TableNameGroup,
		RoleRelModal:             &models.Group{},
		RoleField:                "group_id",
		RoleBindingRoleTableName: models.TableNameRBACAPIRoleBindingRelGroup,
		RoleBindingRoleModel:     &models.APIRoleBindingRelGroup{},
	}
}

func (c *APIRoleRelGroup) Create(rbId int64) (interface{}, error) {
	m := models.APIRoleBindingRelGroup{
		GroupId:       c.payload.GroupId,
		RoleBindingId: rbId,
	}
	if err := models.RBACAPIRoleBindingGroupModel.Add(m); err != nil {
		return nil, err
	}
	return c.payload, nil
}

func (c *APIRoleRelGroup) Delete(id int64) error {
	return models.RBACAPIRoleBindingGroupModel.DeleteById(id)
}

func (c *RoleResourcePermissionsUser) RoleParams() RoleParams {
	return RoleParams{
		TableName: models.TableNameRBACMenuRole,
		Model:     &models.MenuRole{},
	}
}

func (c *RoleResourcePermissionsUser) RoleBindingParams() RoleBindingParams {
	return RoleBindingParams{
		TableName: models.TableNameRBACMenuRoleBinding,
		Model:     c.RoleBindingModel,
	}
}

func (c *RoleResourcePermissionsGroup) RoleParams() RoleParams {
	return RoleParams{
		TableName: models.TableNameRBACMenuRole,
		Model:     &models.MenuRole{},
	}
}

func (c *RoleResourcePermissionsGroup) RoleBindingParams() RoleBindingParams {
	return RoleBindingParams{
		TableName: models.TableNameRBACMenuRoleBinding,
		Model:     c.RoleBindingModel,
	}
}

func (c *RoleResourcePermissionsUser) Payload() interface{} {
	return c.payload
}

func (c *RoleResourcePermissionsUser) GetRolePermissionsId() int64 {
	return c.payload.UserId
}

func (c *RoleResourcePermissionsUser) CreateRoleBinding(roleId int64) int64 {
	m := models.MenuRoleBinding{
		RoleId: roleId,
	}
	id, err := models.RBACMenuRoleBindingModel.Add(m)
	if err == nil {
		return id
	}
	return 0
}
func (c *RoleResourcePermissionsUser) GetRoleBindingId() int64 {
	return c.RoleBindingModel.Id
}

func (c *RoleResourcePermissionsUser) Create(rbId int64) (interface{}, error) {
	m := models.MenuRoleBindingUser{
		UserId:        c.payload.UserId,
		RoleBindingId: rbId,
	}
	if err := models.RBACMenuRoleBindingUserModel.Add(m); err != nil {
		return nil, err
	}
	return c.payload, nil
}

func (c *RoleResourcePermissionsUser) Delete(id int64) error {
	return models.RBACMenuRoleBindingUserModel.DeleteById(id)
}

func (c *RoleResourcePermissionsGroup) Payload() interface{} {
	return c.payload
}

func (c *RoleResourcePermissionsGroup) GetRolePermissionsId() int64 {
	return c.payload.GroupId
}

func (c *RoleResourcePermissionsGroup) CreateRoleBinding(roleId int64) int64 {
	m := models.MenuRoleBinding{
		RoleId: roleId,
	}
	id, err := models.RBACMenuRoleBindingModel.Add(m)
	if err == nil {
		return id
	}
	return 0
}
func (c *RoleResourcePermissionsGroup) GetRoleBindingId() int64 {
	return c.RoleBindingModel.Id
}

func (c *RoleResourcePermissionsUser) PermissionsParams() RoleResourcePermissionsParams {
	return RoleResourcePermissionsParams{
		RoleTableName:            models.TableNameUser,
		RoleRelModal:             &models.User{},
		RoleField:                "user_id",
		RoleBindingRoleTableName: models.TableNameRBACMenuRoleBindingUser,
		RoleBindingRoleModel:     &models.MenuRoleBindingUser{},
	}
}

func (c *RoleResourcePermissionsGroup) Create(rbId int64) (interface{}, error) {
	m := models.MenuRoleBindingGroup{
		GroupId:       c.payload.GroupId,
		RoleBindingId: rbId,
	}
	if err := models.RBACMenuRoleBindingGroupModel.Add(m); err != nil {
		return nil, err
	}
	return c.payload, nil
}

func (c *RoleResourcePermissionsGroup) Delete(id int64) error {
	return models.RBACMenuRoleBindingGroupModel.DeleteById(id)
}

func (c *RoleResourcePermissionsGroup) PermissionsParams() RoleResourcePermissionsParams {
	return RoleResourcePermissionsParams{
		RoleTableName:            models.TableNameGroup,
		RoleRelModal:             &models.Group{},
		RoleField:                "group_id",
		RoleBindingRoleTableName: models.TableNameRBACMenuRoleBindingGroup,
		RoleBindingRoleModel:     &models.MenuRoleBindingGroup{},
	}
}

type RoleResourcePermissionsAllocation struct {
	ctx             echo.Context
	permissionsRole RoleResourcePermissionsAbstract
}

func (c *RoleResourcePermissionsAllocation) Create() (interface{}, error) {
	cc := c.ctx.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return nil, errors.New("invalid roleId")
	}

	valid := base.NewValidator(c.ctx)
	if err := valid.IsValid(c.permissionsRole.Payload()); err != nil {
		return nil, err
	}

	err := models.OrmDB().
		Table(c.permissionsRole.PermissionsParams().RoleTableName).
		Where("id = ?", c.permissionsRole.GetRolePermissionsId()).
		First(c.permissionsRole.PermissionsParams().RoleRelModal).
		Error
	if err != nil {
		return nil, err
	}

	if err = models.OrmDB().
		Table(c.permissionsRole.RoleParams().TableName).
		Where("id = ?", roleId).
		First(c.permissionsRole.RoleParams().Model).
		Error; err != nil {
		return nil, err
	}

	var roleBindingId int64
	err = models.OrmDB().
		Table(c.permissionsRole.RoleBindingParams().TableName).
		Where("role_id = ?", roleId).
		First(c.permissionsRole.RoleBindingParams().Model).
		Error
	if err != nil {
		roleBindingId = c.permissionsRole.CreateRoleBinding(roleId)
	} else {
		roleBindingId = c.permissionsRole.GetRoleBindingId()
	}

	exp := fmt.Sprintf("%s = ? AND role_binding_id = ?", c.permissionsRole.PermissionsParams().RoleField)
	row := models.OrmDB().
		Table(c.permissionsRole.PermissionsParams().RoleBindingRoleTableName).
		Where(exp, c.permissionsRole.GetRolePermissionsId(), roleBindingId).
		First(c.permissionsRole.PermissionsParams().RoleBindingRoleModel).RowsAffected
	if row > 0 {
		return nil, errors.New("data already exists")
	}
	return c.permissionsRole.Create(roleBindingId)
}

func (c *RoleResourcePermissionsAllocation) Delete() error {
	cc := c.ctx.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return errors.New("invalid id")
	}

	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return errors.New("invalid roleId")
	}

	role, err := models.RBACMenuRoleModel.GetById(roleId)
	if err != nil || role.Id == 0 {
		return errors.New("get role error")
	}
	return c.permissionsRole.Delete(id)
}

func NewRoleResourcePermissionsAllocation(ctx echo.Context, role RoleResourcePermissionsAbstract) *RoleResourcePermissionsAllocation {
	return &RoleResourcePermissionsAllocation{
		ctx:             ctx,
		permissionsRole: role,
	}
}

func NewRoleResourcePermissionsGroup() *RoleResourcePermissionsGroup {
	return &RoleResourcePermissionsGroup{
		payload:          &forms.MenuRoleGrantGroup{},
		RoleBindingModel: &models.MenuRoleBinding{},
	}
}

func NewRoleResourcePermissionsUser() *RoleResourcePermissionsUser {
	return &RoleResourcePermissionsUser{
		payload:          &forms.MenuRoleGrantUser{},
		RoleBindingModel: &models.MenuRoleBinding{},
	}
}

func NewAPIRoleRelGroup() *APIRoleRelGroup {
	return &APIRoleRelGroup{
		payload:          &forms.APIRoleRelGrantGroup{},
		RoleBindingModel: &models.APIRoleBinding{},
	}
}

func NewAPIRoleRelUser() *APIRoleRelUser {
	return &APIRoleRelUser{
		payload:          &forms.APIRoleRelGrantUser{},
		RoleBindingModel: &models.APIRoleBinding{},
	}
}
