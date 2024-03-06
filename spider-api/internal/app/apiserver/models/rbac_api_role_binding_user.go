package models

import (
	"gorm.io/gorm"
	"time"
)

type rbacAPIRoleBindingUserModel struct{}

func (c *rbacAPIRoleBindingUserModel) DeleteByUserId(userId int64) error {
	return db.Where("user_id = ?", userId).Delete(&APIRoleBindingRelUser{}).Error
}

func (*rbacAPIRoleBindingUserModel) Add(m APIRoleBindingRelUser) error {
	return db.Create(&m).Error
}

func (*rbacAPIRoleBindingUserModel) DeleteById(id int64) error {
	return db.Where("id = ?", id).Delete(&APIRoleBindingRelUser{}).Error
}

func (c *rbacAPIRoleBindingUserModel) ListByRoleId(roleId int64) (result []APIRoleBindingRelUser, err error) {
	err = db.Where("role_id = ?", roleId).Find(&result).Error
	return
}

func (c *rbacAPIRoleBindingUserModel) DeleteByRoleBindingId(roleBindingId int64) error {
	return db.Where("role_binding_id = ?", roleBindingId).Delete(&APIRoleBindingRelUser{}).Error
}

func (c *APIRoleBindingRelUser) BeforeCreate(db *gorm.DB) error {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return nil
}

func (c *APIRoleBindingRelUser) BeforeUpdate(db *gorm.DB) error {
	c.UpdateTime = time.Now()
	return nil
}
