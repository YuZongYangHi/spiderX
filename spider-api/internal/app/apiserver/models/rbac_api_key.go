package models

import (
	"gorm.io/gorm"
	"time"
)

type apiKeyModel struct{}

func (c *APIKey) BeforeCreate(db *gorm.DB) error {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return nil
}

func (c *APIKey) BeforeUpdate(db *gorm.DB) error {
	c.UpdateTime = time.Now()
	return nil
}

func (c *APIKeyRelRole) BeforeCreate(db *gorm.DB) error {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return nil
}

func (c *APIKeyRelRole) BeforeUpdate(db *gorm.DB) error {
	c.UpdateTime = time.Now()
	return nil
}

func (*apiKeyModel) GetByName(name string) (APIKey, error) {
	var result APIKey
	err := db.Where("name = ?", name).First(&result).Error
	return result, err
}

func (*apiKeyModel) Add(m *APIKey) error {
	return db.Create(m).Error
}

func (*apiKeyModel) Delete(id int64) error {
	return db.Where("id = ?", id).Delete(&APIKey{}).Error
}
