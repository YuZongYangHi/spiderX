package models

import "time"

type APIAction struct {
	Id          int64     `json:"id"`
	Resource    string    `json:"resource"`
	Verb        string    `json:"verb"`
	Owner       string    `json:"owner"`
	Description string    `json:"description"`
	CreateTime  time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type APIRole struct {
	Id          int64        `json:"id"`
	Name        string       `json:"name"`
	Owner       string       `json:"owner"`
	Actions     []*APIAction `gorm:"many2many:rbac_api_role_actions;joinForeignKey:role_id;joinReferences:action_id" json:"actions"`
	Description string       `json:"description"`
	CreateTime  time.Time    `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time    `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type APIRoleRelAction struct {
	Id         int64     `json:"id"`
	RoleId     int64     `gorm:"primaryKey;column:role_id" json:"roleId"`
	ActionId   int64     `gorm:"primaryKey;column:action_id" json:"actionId"`
	Role       APIRole   `gorm:"foreignKey:RoleId" json:"role"`
	Action     APIAction `gorm:"foreignKey:ActionId" json:"action"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type APIRoleBinding struct {
	Id         int64     `json:"id"`
	RoleId     int64     `gorm:"column:role_id" json:"roleId"`
	Role       APIRole   `gorm:"foreignKey:RoleId" json:"role"`
	Users      []User    `gorm:"many2many:rbac_api_role_binding_users;joinForeignKey:role_binding_id;joinReferences:user_id" json:"users"`
	Groups     []Group   `gorm:"many2many:rbac_api_role_binding_groups;joinForeignKey:role_binding_id;joinReferences:group_id" json:"groups"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type APIRoleBindingRelUser struct {
	Id            int64     `json:"id"`
	RoleBindingId int64     `gorm:"column:role_binding_id" json:"roleBindingId"`
	UserId        int64     `gorm:"column:user_id" json:"userId"`
	User          User      `gorm:"foreignKey:UserId" json:"user"`
	CreateTime    time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime    time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type APIRoleBindingRelGroup struct {
	Id            int64     `json:"id"`
	RoleBindingId int64     `gorm:"column:role_binding_id" json:"roleBindingId"`
	GroupId       int64     `gorm:"column:group_id" json:"groupId"`
	Group         Group     `gorm:"foreignKey:GroupId" json:"group"`
	CreateTime    time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime    time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type APIKey struct {
	Id          int64      `json:"id"`
	Name        string     `json:"name"`
	Token       string     `json:"token"`
	ExpireIn    int64      `gorm:"column:expire_in" json:"expireIn"`
	Description string     `json:"description"`
	Roles       []*APIRole `gorm:"many2many:rbac_api_key_roles;joinForeignKey:key_id;joinReferences:role_id" json:"roles"`
	Owner       string     `json:"owner"`
	CreateTime  time.Time  `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time  `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type APIKeyRelRole struct {
	Id         int64     `json:"id"`
	RoleId     int64     `gorm:"column:role_id" json:"roleId"`
	KeyId      int64     `gorm:"column:key_id" json:"keyId"`
	Role       APIRole   `gorm:"foreignKey:RoleId" json:"role"`
	Key        APIKey    `gorm:"foreignKey:KeyId" json:"key"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*APIKey) TableName() string {
	return TableNameRBACAPIKey
}

func (*APIKeyRelRole) TableName() string {
	return TableNameRBACAPIKeyRelRole
}

func (*APIAction) TableName() string {
	return TableNameRBACAPIAction
}

func (*APIRole) TableName() string {
	return TableNameRBACAPIRole
}

func (*APIRoleRelAction) TableName() string {
	return TableNameRBACAPIRoleRlAction
}

func (*APIRoleBinding) TableName() string {
	return TableNameRBACAPIRoleBinding
}

func (*APIRoleBindingRelUser) TableName() string {
	return TableNameRBACAPIRoleBindingRelUser
}

func (*APIRoleBindingRelGroup) TableName() string {
	return TableNameRBACAPIRoleBindingRelGroup
}

func (c *APIRole) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
