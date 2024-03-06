package models

import (
	"gorm.io/gorm"
	"time"
)

type rbacAPIRoleBindingGroupModel struct{}

func (c *rbacAPIRoleBindingGroupModel) DeleteByGroupId(groupId int64) error {
	return db.Where("group_id = ?", groupId).Delete(&APIRoleBindingRelGroup{}).Error
}

func (*rbacAPIRoleBindingGroupModel) Add(m APIRoleBindingRelGroup) error {
	return db.Create(&m).Error
}

func (*rbacAPIRoleBindingGroupModel) DeleteById(id int64) error {
	return db.Where("id = ?", id).Delete(&APIRoleBindingRelGroup{}).Error
}

func (c *rbacAPIRoleBindingGroupModel) ListByRoleId(roleId int64) (result []APIRoleBindingRelGroup, err error) {
	err = db.Where("role_id = ?", roleId).Find(&result).Error
	return
}

func (c *rbacAPIRoleBindingGroupModel) DeleteByRoleBindingId(roleBindingId int64) error {
	return db.Where("role_binding_id = ?", roleBindingId).Delete(&APIRoleBindingRelGroup{}).Error
}

func (c *APIRoleBindingRelGroup) BeforeCreate(db *gorm.DB) error {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return nil
}

func (c *APIRoleBindingRelGroup) BeforeUpdate(db *gorm.DB) error {
	c.UpdateTime = time.Now()
	return nil
}
