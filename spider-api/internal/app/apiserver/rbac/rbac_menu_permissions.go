package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"gorm.io/gorm/clause"
)

type MenuGrantPermissionsType struct {
	PermissionsTableName string
	RoleTableName        string
	SelectFields         string
	RoleModel            interface{}
}

type MenuGrantPermissions interface {
	AllRoleResult() (interface{}, error)
	GetParams() MenuGrantPermissionsType
}

type MenuUserGrantPermissions struct {
	UserModel *[]models.User
}

func (*MenuUserGrantPermissions) AllRoleResult() (interface{}, error) {
	return models.UserModel.List()
}

func (c *MenuUserGrantPermissions) GetParams() MenuGrantPermissionsType {
	return MenuGrantPermissionsType{
		PermissionsTableName: models.TableNameRBACMenuRolePermissionUser,
		RoleTableName:        models.TableNameUser,
		SelectFields:         "user_id",
		RoleModel:            c.UserModel,
	}
}

type MenuGroupGrantPermissions struct {
	GroupModel *[]models.Group
}

func (c *MenuGroupGrantPermissions) GetParams() MenuGrantPermissionsType {
	return MenuGrantPermissionsType{
		PermissionsTableName: models.TableNameRBACMenuRolePermissionGroup,
		RoleTableName:        models.TableNameGroup,
		SelectFields:         "group_id",
		RoleModel:            c.GroupModel,
	}
}

func (*MenuGroupGrantPermissions) AllRoleResult() (interface{}, error) {
	return models.GroupModel.List()
}

func NewMenuUserGrantPermissionsManager() *MenuUserGrantPermissions {
	return &MenuUserGrantPermissions{
		UserModel: &[]models.User{},
	}
}

func NewMenuGroupGrantPermissionsManager() *MenuGroupGrantPermissions {
	return &MenuGroupGrantPermissions{
		GroupModel: &[]models.Group{},
	}
}

func ListRoleByMenuId(menuId int64, roleManager MenuGrantPermissions) (interface{}, error) {
	var ids []string
	err := models.OrmDB().
		Table(roleManager.GetParams().PermissionsTableName).
		Select(roleManager.GetParams().SelectFields).
		Where("menu_id = ?", menuId).
		Find(&ids).
		Error

	if err != nil {
		return nil, err
	}

	if len(ids) == 0 {
		return roleManager.AllRoleResult()
	}

	err = models.OrmDB().
		Table(roleManager.GetParams().RoleTableName).
		Not("id IN ?", ids).
		Find(roleManager.GetParams().RoleModel).
		Preload(clause.Associations).
		Error
	return roleManager.GetParams().RoleModel, err
}
