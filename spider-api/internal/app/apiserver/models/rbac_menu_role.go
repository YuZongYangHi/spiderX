package models

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"time"
)

type menuRoleModel struct{}

type MenuRole struct {
	Id          int64              `json:"id"`
	Name        string             `gorm:"column:name;unique;not null" json:"name"`
	Menus       []*Menu            `gorm:"many2many:rbac_menu_role_binding_menu;joinForeignKey:role_id;joinReferences:menu_id" json:"menus"`
	RoleBinding []*MenuRoleBinding `gorm:"foreignKey:RoleId"`
	Description string             `json:"description"`
	CreateTime  time.Time          `json:"createTime"`
	UpdateTime  time.Time          `json:"updateTime"`
}

func (*MenuRole) TableName() string {
	return TableNameRBACMenuRole
}

func (u *MenuRole) BeforeCreate(tx *gorm.DB) (err error) {
	u.CreateTime = time.Now()
	u.UpdateTime = time.Now()
	return
}

func (u *MenuRole) BeforeUpdate(tx *gorm.DB) (err error) {
	u.UpdateTime = time.Now()
	return
}

func (*menuRoleModel) GetById(id int64) (result MenuRole, err error) {
	err = db.Where("id = ?", id).First(&result).Error
	return
}

func (*menuRoleModel) List() (result []MenuRole, err error) {
	err = db.Preload(clause.Associations).Find(&result).Error
	return
}

func (*menuRoleModel) Add(m *MenuRole) error {
	return db.Create(m).Error
}

func (*menuRoleModel) Delete(id int64) error {
	return db.Delete(&MenuRole{}, id).Error
}

func (*menuRoleModel) Update(m *MenuRole) error {
	return db.Save(m).Error
}
