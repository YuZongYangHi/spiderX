package models

import (
	"gorm.io/gorm"
	"time"
)

type MenuRoleBindingUserInfo struct {
	Id            int64     `json:"id"`
	RoleBindingId int64     `json:"roleBindingId"`
	User          User      `json:"user"`
	CreateTime    time.Time `json:"createTime"`
	UpdateTime    time.Time `json:"updateTime"`
}

type menuRoleBindingUserModel struct{}

type MenuRoleBindingUser struct {
	Id            int64     `json:"id"`
	UserId        int64     `gorm:"primaryKey;column:user_id" json:"userId"`
	RoleBindingId int64     `gorm:"primaryKey;column:role_binding_id; not null;" json:"roleBindingId"`
	CreateTime    time.Time `json:"createTime"`
	UpdateTime    time.Time `json:"updateTime"`
}

func (*MenuRoleBindingUser) TableName() string {
	return TableNameRBACMenuRoleBindingUser
}

func (c *MenuRoleBindingUser) BeforeCreate(db *gorm.DB) error {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return nil
}

func (*menuRoleBindingUserModel) DeleteByRoleBindingIds(rbIds []int64) error {
	return db.Where("role_binding_id IN ?", rbIds).Delete(&MenuRoleBindingUser{}).Error
}

func (*menuRoleBindingUserModel) DeleteById(id int64) error {
	return db.Where("id = ?", id).Delete(&MenuRoleBindingUser{}).Error
}

func (*menuRoleBindingUserModel) GetByUserIdAndRoleBindingId(userId, roleBindingId int64) (result MenuRoleBindingUser, err error) {
	err = db.Where("user_id = ? AND role_binding_id = ?", userId, roleBindingId).First(&result).Error
	return
}

func (*menuRoleBindingUserModel) Add(m MenuRoleBindingUser) error {
	return db.Create(&m).Error
}

func (c *menuRoleBindingUserModel) DeleteByUserId(userId int64) error {
	return db.Where("user_id = ?", userId).Delete(&MenuRoleBindingUser{}).Error
}
