package models

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/security"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"time"
)

type userModel struct{}

type User struct {
	Id               int64              `json:"id"`
	UserId           string             `gorm:"column:user_id; not null; unique; size:255" json:"userId"`
	Username         string             `gorm:"column:username; not null; unique; size:255" json:"username"`
	Password         string             `gorm:"column:password; not null; size:255" json:"password"`
	Name             string             `gorm:"column:name; not null; size:255" json:"name"`
	Email            string             `gorm:"column:email; not null; size:255; unique" json:"email"`
	Photo            string             `gorm:"column:photo" json:"photo"`
	LastLoginTime    time.Time          `gorm:"column:last_login_time" json:"lastLoginTime"`
	LastLoginIp      string             `gorm:"column:last_login_ip" json:"lastLoginIp"`
	GroupId          int64              `json:"-"`
	Group            Group              `gorm:"foreignKey:GroupId" json:"group"`
	MenuRoleBindings []*MenuRoleBinding `gorm:"many2many:rbac_menu_role_binding_user;joinForeignKey:user_id;joinReferences:role_binding_id" json:"-"`
	IsAdmin          bool               `json:"isAdmin"`
	IsActive         bool               `json:"isActive"`
	IsDelete         bool               `gorm:"column:photo" json:"isDeleted"`
	CreateTime       time.Time          `json:"createTime"`
	UpdateTime       time.Time          `json:"updateTime"`
}

func (*User) TableName() string {
	return TableNameUser
}

func (c *User) BeforeCreate(tx *gorm.DB) (err error) {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	c.LastLoginTime = time.Now()
	return
}

func (c *User) BeforeUpdate(tx *gorm.DB) (err error) {
	c.UpdateTime = time.Now()
	return
}

func (*userModel) EncodeRawPassword(rawPassword string) string {
	salt := config.ApiServerConfig().Security.AccountSalt
	return security.MD5Encode(fmt.Sprintf("%s%s", salt, rawPassword))
}

func (c *userModel) Login(username, rawPassword string) (user *User, err error) {
	password := c.EncodeRawPassword(rawPassword)
	err = db.Where("username = ? AND password = ?", username, password).
		Preload(clause.Associations).
		First(&user).Error
	return
}

func (c *userModel) GetByUserId(userId string) (*User, error) {
	var user User
	err := db.Where("user_id = ?", userId).Preload("Group").First(&user).Error
	return &user, err
}

func (c *userModel) GetById(id int64) (result User, err error) {
	err = db.Where("id = ?", id).First(&result).Error
	return
}

func (c *userModel) GetByGroupId(groupId int64) (result User, err error) {
	err = db.Where("group_id = ?", groupId).First(&result).Error
	return
}

func (c *userModel) GetByUsername(username string) (result User, err error) {
	err = db.Where("username = ?", username).First(&result).Error
	return
}

func (c *userModel) List() (users []User, err error) {
	err = db.Preload(clause.Associations).Find(&users).Error
	return users, err
}

func (c *userModel) NotIn(ids []int64) (user []User, err error) {
	err = db.Where("id NOT IN ?", ids).Find(&user).Error
	return user, err
}

func (c *userModel) Add(user *User) error {
	return db.Create(user).Error
}

func (c *userModel) DeleteByUserId(userId string) error {
	return db.Where("user_id = ?", userId).Delete(&User{}).Error
}

func (c *userModel) RelDelete(userId int64) []error {
	var errs []error
	errs = append(errs, RBACMenuPermissionsUserModel.DeleteByUserId(userId))
	errs = append(errs, RBACMenuRoleBindingUserModel.DeleteByUserId(userId))
	errs = append(errs, RBACAPIRoleBindingUserModel.DeleteByUserId(userId))
	return errs
}

func (c *User) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
	}
}
