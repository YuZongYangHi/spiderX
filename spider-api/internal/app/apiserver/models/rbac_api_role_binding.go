package models

import (
	"errors"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"time"
)

type rbacAPIRoleBindingModel struct{}

func (c *APIRoleBinding) BeforeCreate(db *gorm.DB) error {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return nil
}

func (c *APIRoleBinding) BeforeUpdate(db *gorm.DB) error {
	c.UpdateTime = time.Now()
	return nil
}

func (*rbacAPIRoleBindingModel) ListByUserIdOrGroupId(userId, groupId int64) ([]APIRoleBinding, error) {
	var rb []APIRoleBinding
	err := OrmDB().Raw(queryResourceExistenceByUserOrGroupRawSQL, userId, groupId).
		Preload("Role.Actions").
		Preload("Users").
		Preload("Groups").
		Find(&rb).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	return rb, err
}

func (c *rbacAPIRoleBindingModel) HasPermissions(user *User, actionId int64) bool {
	roleBindings, err := c.ListByUserIdOrGroupId(user.Id, user.GroupId)
	if len(roleBindings) == 0 || err != nil {
		return false
	}
	for _, rb := range roleBindings {
		if rb.Role.Id > 0 {
			for _, action := range rb.Role.Actions {
				if action.Id == actionId {
					return true
				}
			}
		}
	}
	return false
}

func (*rbacAPIRoleBindingModel) GetByRoleId(roleId int64) (result APIRoleBinding, err error) {
	err = db.Where("role_id = ?", roleId).Preload(clause.Associations).First(&result).Error
	return
}

func (*rbacAPIRoleBindingModel) Add(m *APIRoleBinding) error {
	return db.Create(m).Error
}

func (*rbacAPIRoleBindingModel) ListByRoleId(roleId int64) (result []APIRoleBinding, err error) {
	err = db.Where("role_id = ?", roleId).Preload(clause.Associations).Find(&result).Error
	return
}

func (*rbacAPIRoleBindingModel) DeleteByRoleId(roleId int64) error {
	return db.Where("role_id = ?", roleId).Delete(&APIRoleBinding{}).Error
}
