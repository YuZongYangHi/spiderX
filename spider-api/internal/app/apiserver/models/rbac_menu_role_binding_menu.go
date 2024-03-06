package models

import (
	"gorm.io/gorm"
	"time"
)

type MenuRoleResource struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

type MenuRoleMenuResource struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
	Key  string `json:"key"`
}

type MenuRoleRoleBindingResource struct {
	Id         int64                `json:"id"`
	Role       MenuRoleResource     `json:"role"`
	Menu       MenuRoleMenuResource `json:"menu"`
	CreateTime time.Time            `json:"createTime"`
	UpdateTime time.Time            `json:"updateTime"`
}

type MenuRoleBindingMenu struct {
	Id         int64     `json:"id"`
	RoleId     int64     `gorm:"primaryKey;column:role_id" json:"roleId"`
	MenuId     int64     `gorm:"primaryKey;column:menu_id; not null;" json:"menuId"`
	Role       MenuRole  `gorm:"foreignKey:RoleId" json:"role"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func (*MenuRoleBindingMenu) TableName() string {
	return TableNameRBACMenuRoleBindingMenu
}

func (c *MenuRoleBindingMenu) BeforeCreate(db *gorm.DB) error {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return nil
}

type menuRoleBindingMenuModel struct{}

func (c *menuRoleBindingMenuModel) ListByRoleId(roleId int64) (result []MenuRoleBindingMenu, err error) {
	err = db.Where("role_id = ?", roleId).Find(&result).Error
	return
}

func (c *menuRoleBindingMenuModel) DeleteById(id int64) error {
	return db.Where("id = ?", id).Delete(&MenuRoleBindingMenu{}).Error
}

func (c *menuRoleBindingMenuModel) DeleteByRoleId(roleId int64) error {
	return db.Where("role_id = ?", roleId).Delete(&MenuRoleBindingMenu{}).Error
}

func (c *menuRoleBindingMenuModel) GetByMenuIdAndRoleId(menuId, roleId int64) (*MenuRoleBindingMenu, error) {
	var result MenuRoleBindingMenu
	err := db.Where("menu_id = ? AND role_id = ?", menuId, roleId).First(&result).Error
	return &result, err
}

func (c *menuRoleBindingMenuModel) Add(m *MenuRoleBindingMenu) error {
	return db.Create(&m).Error
}

func (c *menuRoleBindingMenuModel) DeleteByIdAndRoleId(id, roleId int64) error {
	return db.Where("id = ? AND role_id = ?", id, roleId).Delete(&MenuRoleBindingMenu{}).Error
}
