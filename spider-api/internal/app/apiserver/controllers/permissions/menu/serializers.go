package menu

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SerializerMenuGrantUser struct {
	model  *[]models.MenuPermissionsUser
	Filter map[string]interface{}
}

type SerializerMenuGrantGroup struct {
	model  *[]models.MenuPermissionsGroup
	Filter map[string]interface{}
}

type SerializerMenuRole struct {
	model  *[]models.MenuRole
	Filter map[string]interface{}
}

type SerializerMenuRoleBindingMenu struct {
	model  *[]models.MenuRoleBindingMenu
	Filter map[string]interface{}
}

type SerializerMenuRoleBinding struct {
	model  *[]models.MenuRoleBinding
	Filter map[string]interface{}
}

type SerializerMenuRoleBindingGroup struct {
	model  *[]models.MenuRoleBindingGroup
	Filter map[string]interface{}
}

type SerializerMenuRoleBindingUser struct {
	model  *[]models.MenuRoleBindingUser
	Filter map[string]interface{}
}

func (c *SerializerMenuRoleBindingUser) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACMenuRoleBindingUser,
		FilterCondition:     c.Filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

func (c *SerializerMenuRoleBindingUser) Preload() []string {
	return []string{}
}

func (c *SerializerMenuRoleBindingUser) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SerializerMenuRoleBindingUser) Order() []string {
	return []string{}
}

func (c *SerializerMenuRoleBindingUser) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SerializerMenuRoleBindingUser) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var result []models.MenuRoleBindingUserInfo
	for _, r := range *c.model {
		user, err := models.UserModel.GetById(r.UserId)
		if err != nil {
			continue
		}
		result = append(result, models.MenuRoleBindingUserInfo{
			Id:            r.Id,
			RoleBindingId: r.RoleBindingId,
			User:          user,
			CreateTime:    r.CreateTime,
			UpdateTime:    r.UpdateTime,
		})
	}
	data.List = result
	return data
}

func (c *SerializerMenuRoleBindingGroup) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACMenuRoleBindingGroup,
		FilterCondition:     c.Filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

func (c *SerializerMenuRoleBindingGroup) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SerializerMenuRoleBindingGroup) Preload() []string {
	return []string{}
}

func (c *SerializerMenuRoleBindingGroup) Order() []string {
	return []string{}
}

func (c *SerializerMenuRoleBindingGroup) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SerializerMenuRoleBindingGroup) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var result []models.MenuRoleBindingGroupInfo
	for _, r := range *c.model {
		group, err := models.GroupModel.GetById(r.GroupId)
		if err != nil {
			continue
		}
		result = append(result, models.MenuRoleBindingGroupInfo{
			Id:            r.Id,
			RoleBindingId: r.RoleBindingId,
			Group:         group,
			CreateTime:    r.CreateTime,
			UpdateTime:    r.UpdateTime,
		})
	}
	data.List = result
	return data
}

func (c *SerializerMenuRoleBinding) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACMenuRoleBinding,
		FilterCondition:     c.Filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

func (c *SerializerMenuRoleBinding) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SerializerMenuRoleBinding) Preload() []string {
	return []string{clause.Associations}
}

func (c *SerializerMenuRoleBinding) Order() []string {
	return []string{}
}

func (c *SerializerMenuRoleBinding) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SerializerMenuRoleBinding) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *SerializerMenuRoleBindingMenu) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACMenuRoleBindingMenu,
		FilterCondition:     c.Filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

func (c *SerializerMenuRoleBindingMenu) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SerializerMenuRoleBindingMenu) Preload() []string {
	return []string{"Role"}
}

func (c *SerializerMenuRoleBindingMenu) Order() []string {
	return []string{}
}

func (c *SerializerMenuRoleBindingMenu) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SerializerMenuRoleBindingMenu) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var response []models.MenuRoleRoleBindingResource
	for _, rb := range *c.model {
		menu, err := models.MenuModel.GetById(rb.MenuId)
		if err != nil {
			continue
		}
		response = append(response, models.MenuRoleRoleBindingResource{
			Id: rb.Id,
			Role: models.MenuRoleResource{
				Id:   rb.Role.Id,
				Name: rb.Role.Name,
			},
			Menu: models.MenuRoleMenuResource{
				Id:   menu.Id,
				Name: menu.Name,
				Key:  menu.Key,
			},
			CreateTime: rb.CreateTime,
			UpdateTime: rb.UpdateTime,
		})
	}
	data.List = response
	return data
}

func (c *SerializerMenuRole) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:       models.TableNameRBACMenuRole,
		FilterCondition: c.Filter,
		FilterConditionType: []base.SerializersField{
			{
				Field: "name",
				Type:  "like",
			},
		},
		Model: c.model,
	}
}

func (c *SerializerMenuRole) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SerializerMenuRole) Preload() []string {
	return []string{clause.Associations}
}

func (c *SerializerMenuRole) Order() []string {
	return []string{}
}

func (c *SerializerMenuRole) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SerializerMenuRole) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *SerializerMenuGrantUser) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACMenuRolePermissionUser,
		FilterCondition:     c.Filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

func (c *SerializerMenuGrantUser) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SerializerMenuGrantUser) Preload() []string {
	return []string{clause.Associations}
}

func (c *SerializerMenuGrantUser) Order() []string {
	return []string{}
}

func (c *SerializerMenuGrantUser) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SerializerMenuGrantUser) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *SerializerMenuGrantGroup) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SerializerMenuGrantGroup) Preload() []string {
	return []string{clause.Associations}
}

func (c *SerializerMenuGrantGroup) Order() []string {
	return []string{}
}

func (c *SerializerMenuGrantGroup) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SerializerMenuGrantGroup) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *SerializerMenuGrantGroup) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameRBACMenuRolePermissionGroup,
		FilterCondition:     c.Filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

type SerializerMenu struct {
	model *[]models.Menu
}

func (c *SerializerMenu) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SerializerMenu) Preload() []string {
	return []string{}
}

func (c *SerializerMenu) Order() []string {
	return []string{}
}

func (c *SerializerMenu) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SerializerMenu) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var parentList []models.Menu
	for _, m := range *c.model {
		if m.ParentId == 0 {
			parentList = append(parentList, m)
		}
	}
	result := models.MenuModel.ListTree(parentList)
	data.List = result
	return data
}

func (c *SerializerMenu) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:       models.TableNameRBACMenu,
		FilterCondition: nil,
		FilterConditionType: []base.SerializersField{
			{
				Field: "name",
				Type:  "like",
			},
			{
				Field: "id",
				Type:  "equal",
			},
		},
		Model: c.model,
	}
}

func NewSerializerMenu() *SerializerMenu {
	return &SerializerMenu{model: &[]models.Menu{}}
}

func NewSerializerUserPermissions() *SerializerMenuGrantUser {
	return &SerializerMenuGrantUser{
		model:  &[]models.MenuPermissionsUser{},
		Filter: map[string]interface{}{},
	}
}

func NewSerializerGroupPermissions() *SerializerMenuGrantGroup {
	return &SerializerMenuGrantGroup{
		model:  &[]models.MenuPermissionsGroup{},
		Filter: map[string]interface{}{},
	}
}

func NewSerializerMenuRole() *SerializerMenuRole {
	return &SerializerMenuRole{
		model:  &[]models.MenuRole{},
		Filter: map[string]interface{}{},
	}
}

func NewSerializerMenuRoleBindingMenu() *SerializerMenuRoleBindingMenu {
	return &SerializerMenuRoleBindingMenu{
		model:  &[]models.MenuRoleBindingMenu{},
		Filter: map[string]interface{}{},
	}
}

func NewSerializerMenuRoleBinding() *SerializerMenuRoleBinding {
	return &SerializerMenuRoleBinding{
		model:  &[]models.MenuRoleBinding{},
		Filter: map[string]interface{}{},
	}
}

func NewSerializerMenuRoleBindingGroup() *SerializerMenuRoleBindingGroup {
	return &SerializerMenuRoleBindingGroup{
		model:  &[]models.MenuRoleBindingGroup{},
		Filter: map[string]interface{}{},
	}
}

func NewSerializerMenuRoleBindingUser() *SerializerMenuRoleBindingUser {
	return &SerializerMenuRoleBindingUser{
		model:  &[]models.MenuRoleBindingUser{},
		Filter: map[string]interface{}{},
	}
}
