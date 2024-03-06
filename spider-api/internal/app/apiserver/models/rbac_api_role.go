package models

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"time"
)

type rbacAPIRoleModel struct{}

func (c *APIRole) BeforeCreate(tx *gorm.DB) (err error) {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return
}

func (c *APIRole) BeforeUpdate(tx *gorm.DB) (err error) {
	c.UpdateTime = time.Now()
	return
}

func (*rbacAPIRoleModel) GetById(id int64) (action APIRole, err error) {
	err = db.Where("id = ?", id).Preload(clause.Associations).First(&action).Error
	return
}

func (*rbacAPIRoleModel) GetByName(name string) (action APIRole, err error) {
	err = db.Where("name = ?", name).Preload(clause.Associations).First(&action).Error
	return
}

func (c *rbacAPIRoleModel) Add(m *APIRole) error {
	return db.Create(m).Error
}

func (c *rbacAPIRoleModel) DeleteById(id int64) error {
	return db.Where("id = ?", id).Delete(&APIRole{}).Error
}
