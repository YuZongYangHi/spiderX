package services

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/rbac"
)

type MenuUserGrant struct {
	user            *models.User
	userPermissions *models.MenuPermissionsUser
	payload         *forms.CreateGrantUserPermissionsForm
}

type MenuGroupGrant struct {
	group            *models.Group
	groupPermissions *models.MenuPermissionsGroup
	payload          *forms.CreateGrantGroupPermissionsForm
}

func (c *MenuUserGrant) Payload() interface{} {
	return c.payload
}

func (c *MenuUserGrant) Model() rbac.MenuModelParams {
	return rbac.MenuModelParams{
		RoleTableName:            models.TableNameUser,
		RoleFilter:               map[string]interface{}{"id": c.payload.UserId},
		RoleModel:                c.user,
		RolePermissionsTableName: models.TableNameRBACMenuRolePermissionUser,
		RolePermissionsModel:     c.userPermissions,
		RolePermissionsFilter:    map[string]interface{}{"user_id": c.payload.UserId},
	}
}

func (c *MenuUserGrant) Create(menuId int64) (interface{}, error) {
	m := models.MenuPermissionsUser{
		MenuId: menuId,
		UserId: c.payload.UserId,
		Read:   c.payload.Read,
		Create: c.payload.Create,
		Update: c.payload.Update,
		Delete: c.payload.Delete,
	}

	if err := models.RBACMenuPermissionsUserModel.Create(m); err != nil {
		return nil, err
	}
	return c.payload, nil
}

func (c *MenuUserGrant) Delete(menuId, permissionsId int64) error {
	return models.RBACMenuPermissionsUserModel.DeleteByMenuId(menuId, permissionsId)
}

func (c *MenuGroupGrant) Payload() interface{} {
	return c.payload
}

func (c *MenuGroupGrant) Model() rbac.MenuModelParams {
	return rbac.MenuModelParams{
		RoleTableName:            models.TableNameGroup,
		RoleFilter:               map[string]interface{}{"id": c.payload.GroupId},
		RoleModel:                c.group,
		RolePermissionsTableName: models.TableNameRBACMenuRolePermissionGroup,
		RolePermissionsModel:     c.groupPermissions,
		RolePermissionsFilter:    map[string]interface{}{"group_id": c.payload.GroupId},
	}
}

func (c *MenuGroupGrant) Create(menuId int64) (interface{}, error) {
	m := models.MenuPermissionsGroup{
		MenuId:  menuId,
		GroupId: c.payload.GroupId,
		Read:    c.payload.Read,
		Create:  c.payload.Create,
		Update:  c.payload.Update,
		Delete:  c.payload.Delete,
	}

	if err := models.RBACMenuPermissionsGroupModel.Create(m); err != nil {
		return nil, err
	}
	return c.payload, nil
}

func (c *MenuGroupGrant) Delete(menuId, permissionsId int64) error {
	return models.RBACMenuPermissionsGroupModel.DeleteByMenuId(menuId, permissionsId)
}

func NewMenuUserGrant() *MenuUserGrant {
	return &MenuUserGrant{
		payload:         &forms.CreateGrantUserPermissionsForm{},
		user:            &models.User{},
		userPermissions: &models.MenuPermissionsUser{},
	}
}

func NewMenuGroupGrant() *MenuGroupGrant {
	return &MenuGroupGrant{
		group:            &models.Group{},
		groupPermissions: &models.MenuPermissionsGroup{},
		payload:          &forms.CreateGrantGroupPermissionsForm{},
	}
}
