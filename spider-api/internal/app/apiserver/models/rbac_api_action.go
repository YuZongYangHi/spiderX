package models

import (
	"gorm.io/gorm"
	"time"
)

type rbacAPIActionModel struct{}

func (c *APIAction) BeforeCreate(tx *gorm.DB) (err error) {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return
}

func (c *APIAction) BeforeUpdate(tx *gorm.DB) (err error) {
	c.UpdateTime = time.Now()
	return
}

func (*rbacAPIActionModel) FetchSingleResourceActionData(resource, verb string) (action APIAction, err error) {
	err = db.Where("resource = ? AND verb = ?", resource, verb).First(&action).Error
	return
}

func (*rbacAPIActionModel) GetById(id int64) (action APIAction, err error) {
	err = db.Where("id = ?", id).First(&action).Error
	return
}

func (c *rbacAPIActionModel) Add(m *APIAction) error {
	return db.Create(m).Error
}

func (c *rbacAPIActionModel) DeleteById(id int64) error {
	return db.Where("id = ?", id).Delete(&APIAction{}).Error
}

func (c *rbacAPIActionModel) Update(m *APIAction) error {
	return db.Save(m).Error
}

func (c *rbacAPIActionModel) ListByNotResourceIds(resourceIds []int64) (result []APIAction, err error) {
	err = db.Where("id NOT IN ?", resourceIds).Find(&result).Error
	return
}

func (c *rbacAPIActionModel) List() (result []APIAction, err error) {
	err = db.Find(&result).Error
	return
}
