package models

import (
	"gorm.io/gorm"
	"time"
)

type MenuRoleBindingGroupInfo struct {
	Id            int64     `json:"id"`
	RoleBindingId int64     `json:"roleBindingId"`
	Group         Group     `json:"group"`
	CreateTime    time.Time `json:"createTime"`
	UpdateTime    time.Time `json:"updateTime"`
}

type MenuRoleBindingGroup struct {
	Id            int64     `json:"id"`
	GroupId       int64     `gorm:"primaryKey;column:group_id" json:"groupId"`
	RoleBindingId int64     `gorm:"primaryKey;column:role_binding_id; not null;" json:"roleBindingId"`
	CreateTime    time.Time `json:"createTime"`
	UpdateTime    time.Time `json:"updateTime"`
}

func (*MenuRoleBindingGroup) TableName() string {
	return TableNameRBACMenuRoleBindingGroup
}

func (c *MenuRoleBindingGroup) BeforeCreate(db *gorm.DB) error {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return nil
}

type menuRoleBindingGroupModel struct{}

func (*menuRoleBindingGroupModel) DeleteByRoleBindingIds(rbIds []int64) error {
	return db.Where("role_binding_id IN ?", rbIds).Delete(&MenuRoleBindingGroup{}).Error
}

func (*menuRoleBindingGroupModel) DeleteById(id int64) error {
	return db.Where("id = ?", id).Delete(&MenuRoleBindingGroup{}).Error
}

func (*menuRoleBindingGroupModel) GetByGroupIdAndRoleBindingId(groupId, roleBindingId int64) (result MenuRoleBindingGroup, err error) {
	err = db.Where("group_id = ? AND role_binding_id = ?", groupId, roleBindingId).First(&result).Error
	return
}

func (c *menuRoleBindingGroupModel) DeleteByGroupId(groupId int64) error {
	return db.Where("group_id = ?", groupId).Delete(&MenuRoleBindingGroup{}).Error
}

func (*menuRoleBindingGroupModel) Add(m MenuRoleBindingGroup) error {
	return db.Create(&m).Error
}
