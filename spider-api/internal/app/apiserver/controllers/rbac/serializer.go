package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var (
	ActionFieldFilterCondition = []base.SerializersField{
		{
			Field: "resource",
			Type:  base.LikeExpressionEnum,
		},
		{
			Field: "verb",
			Type:  base.EqualExpressionEnum,
		},
	}
	RoleFiledFilterCondition = []base.SerializersField{
		{
			Field: "name",
			Type:  base.LikeExpressionEnum,
		},
	}
	APIKeyFilterCondition = []base.SerializersField{
		{
			Field: "name",
			Type:  base.LikeExpressionEnum,
		},
		{
			Field: "owner",
			Type:  base.LikeExpressionEnum,
		},
	}
)

type APIKeySerializer struct {
	model  *[]models.APIKey
	Filter map[string]interface{}
}

type APIActionSerializer struct {
	model  *[]models.APIAction
	Filter map[string]interface{}
}

type APIRoleSerializer struct {
	model  *[]models.APIRole
	Filter map[string]interface{}
}

type APIRoleResourceSerializer struct {
	model  *[]models.APIRoleRelAction
	Filter map[string]interface{}
}

type APIRoleRelGroupSerializer struct {
	model  *[]models.APIRoleBindingRelGroup
	Filter map[string]interface{}
}

type APIRoleRelUserSerializer struct {
	model  *[]models.APIRoleBindingRelUser
	Filter map[string]interface{}
}

func (c *APIKeySerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *APIKeySerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *APIKeySerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *APIKeySerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *APIKeySerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *APIKeySerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACAPIKey,
		FilterCondition:     c.Filter,
		FilterConditionType: APIKeyFilterCondition,
		Model:               c.model,
	}
}

func (c *APIRoleRelUserSerializer) Preload() []string {
	return []string{"User"}
}

func (c *APIRoleRelUserSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *APIRoleRelUserSerializer) Order() []string {
	return []string{}
}

func (c *APIRoleRelUserSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *APIRoleRelUserSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var result []models.APIRoleBindingRelUser
	for _, r := range *c.model {
		user, err := models.UserModel.GetById(r.UserId)
		if err != nil {
			continue
		}
		result = append(result, models.APIRoleBindingRelUser{
			Id:            r.Id,
			RoleBindingId: r.RoleBindingId,
			UserId:        r.UserId,
			User:          user,
			CreateTime:    r.CreateTime,
			UpdateTime:    r.UpdateTime,
		})

	}
	data.List = result
	return data
}

func (c *APIRoleRelUserSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACAPIRoleBindingRelUser,
		FilterCondition:     c.Filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

func (c *APIRoleRelGroupSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *APIRoleRelGroupSerializer) Preload() []string {
	return []string{"Group"}
}

func (c *APIRoleRelGroupSerializer) Order() []string {
	return []string{}
}

func (c *APIRoleRelGroupSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *APIRoleRelGroupSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *APIRoleRelGroupSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACAPIRoleBindingRelGroup,
		FilterCondition:     c.Filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

func (c *APIRoleResourceSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *APIRoleResourceSerializer) Preload() []string {
	return []string{"Role", "Action"}
}

func (c *APIRoleResourceSerializer) Order() []string {
	return []string{}
}

func (c *APIRoleResourceSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *APIRoleResourceSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *APIRoleResourceSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACAPIRoleRlAction,
		FilterCondition:     c.Filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

func (c *APIActionSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *APIActionSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *APIActionSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *APIActionSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *APIActionSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *APIActionSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACAPIAction,
		FilterCondition:     c.Filter,
		FilterConditionType: ActionFieldFilterCondition,
		Model:               c.model,
	}
}

func (c *APIRoleSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *APIRoleSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *APIRoleSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *APIRoleSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *APIRoleSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *APIRoleSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACAPIRole,
		FilterCondition:     c.Filter,
		FilterConditionType: RoleFiledFilterCondition,
		Model:               c.model,
	}
}

func NewAPIRoleSerializer() *APIRoleSerializer {
	return &APIRoleSerializer{
		model:  &[]models.APIRole{},
		Filter: map[string]interface{}{},
	}
}

func NewAPIActionSerializer() *APIActionSerializer {
	return &APIActionSerializer{
		model:  &[]models.APIAction{},
		Filter: map[string]interface{}{},
	}
}

func NewAPIRoleResourceSerializer() *APIRoleResourceSerializer {
	return &APIRoleResourceSerializer{
		model:  &[]models.APIRoleRelAction{},
		Filter: map[string]interface{}{},
	}
}

func NewAPIRoleRelGroupSerializer() *APIRoleRelGroupSerializer {
	return &APIRoleRelGroupSerializer{
		model:  &[]models.APIRoleBindingRelGroup{},
		Filter: map[string]interface{}{},
	}
}

func NewAPIRoleRelUserSerializer() *APIRoleRelUserSerializer {
	return &APIRoleRelUserSerializer{
		model:  &[]models.APIRoleBindingRelUser{},
		Filter: map[string]interface{}{},
	}
}

func NewAPIKeySerializer() *APIKeySerializer {
	return &APIKeySerializer{
		model:  &[]models.APIKey{},
		Filter: map[string]interface{}{},
	}
}
