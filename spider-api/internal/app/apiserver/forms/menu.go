package forms

import "github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"

type CreateMenuForm struct {
	Name     string `validate:"required" json:"name"`
	Key      string `validate:"required" json:"key"`
	ParentId int64  `json:"parentId"`
}

type UpdateMenuForm struct {
	Name     string `validate:"required" json:"name"`
	Key      string `validate:"required" json:"key"`
	ParentId int64  `json:"parentId"`
}

type CreateGrantGroupPermissionsForm struct {
	GroupId int64 `validate:"required" json:"groupId"`
	models.PermissionsAction
}

type CreateGrantUserPermissionsForm struct {
	UserId int64 `validate:"required" json:"userId"`
	models.PermissionsAction
}

type MenuRoleCreateForm struct {
	Name        string `validate:"required" json:"name"`
	Description string `json:"description"`
}

type MenuRoleResource struct {
	MenuId int64 `json:"menuId"`
}

type MenuRoleGrantGroup struct {
	GroupId int64 `json:"groupId"`
}

type MenuRoleGrantUser struct {
	UserId int64 `json:"userId"`
}
