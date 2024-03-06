package models

import (
	"errors"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"time"
)

type menuRoleBindingModel struct{}

type MenuRoleBinding struct {
	Id         int64     `json:"id"`
	RoleId     int64     `gorm:"column:role_id; not null;" json:"-"`
	Role       MenuRole  `gorm:"foreignKey:RoleId" json:"role"`
	Users      []User    `gorm:"many2many:rbac_menu_role_binding_user;joinForeignKey:role_binding_id;joinReferences:user_id" json:"users"`
	Groups     []Group   `gorm:"many2many:rbac_menu_role_binding_group;joinForeignKey:role_binding_id;joinReferences:group_id" json:"groups"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func (*MenuRoleBinding) TableName() string {
	return TableNameRBACMenuRoleBinding
}

func (c *MenuRoleBinding) BeforeCreate(db *gorm.DB) error {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return nil
}

func (*menuRoleBindingModel) ListByUser(user *User) ([]MenuRoleBinding, error) {
	var rb []MenuRoleBinding
	err := OrmDB().Raw(QueryMenuRoleBindingByUserIdOrGroupId, user.Id, user.Group.Id).
		Preload("Role.Menus").
		Preload("Users").
		Preload("Groups").
		Find(&rb).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	return rb, err
}

func (*menuRoleBindingModel) ListMenuByRoleBinding(rb []MenuRoleBinding) (menus []Menu) {
	m := map[int64]Menu{}
	for _, r := range rb {
		for _, menu := range r.Role.Menus {
			m[menu.Id] = *menu
		}
	}
	for _, value := range m {
		menus = append(menus, value)
	}
	return
}

func (*menuRoleBindingModel) DeleteByRoleId(roleId int64) error {
	return db.Where("role_id = ?", roleId).Delete(&MenuRoleBinding{}).Error
}

func (*menuRoleBindingModel) ListByRoleId(roleId int64) (result []MenuRoleBinding, err error) {
	err = db.Where("role_id = ?", roleId).Preload(clause.Associations).Find(&result).Error
	return
}

func (*menuRoleBindingModel) GetByRoleId(roleId int64) (result MenuRoleBinding, err error) {
	err = db.Where("role_id = ?", roleId).First(&result).Error
	return
}

func (*menuRoleBindingModel) FilterIds(rb []MenuRoleBinding) []int64 {
	var ids []int64
	for _, r := range rb {
		ids = append(ids, r.Id)
	}
	return ids
}

func (*menuRoleBindingModel) FilterUserIds(rb []MenuRoleBinding) []int64 {
	var ids []int64
	for _, r := range rb {
		for _, user := range r.Users {
			ids = append(ids, user.Id)
		}
	}
	return ids
}

func (*menuRoleBindingModel) FilterGroupIds(rb []MenuRoleBinding) []int64 {
	var ids []int64
	for _, r := range rb {
		for _, group := range r.Groups {
			ids = append(ids, group.Id)
		}
	}
	return ids
}

func (*menuRoleBindingModel) Add(m MenuRoleBinding) (int64, error) {
	result := db.Create(&m)
	if result.Error != nil {
		return 0, result.Error
	}
	return m.Id, nil
}
