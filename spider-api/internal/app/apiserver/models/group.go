package models

import (
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"gorm.io/gorm"
	"strings"
	"time"
)

type groupModel struct{}

type Group struct {
	Id               int64              `json:"id"`
	Name             string             `json:"name"`
	Email            string             `json:"email"`
	CnName           string             `gorm:"column:cn_name" json:"cnName"`
	MenuRoleBindings []*MenuRoleBinding `gorm:"many2many:rbac_menu_role_binding_group;joinForeignKey:group_id;joinReferences:role_binding_id" json:"-"`
	Description      string             `json:"description"`
	CreateTime       time.Time          `json:"createTime"`
	UpdateTime       time.Time          `json:"updateTime"`
}

func (*Group) TableName() string {
	return TableNameGroup
}

func (c *Group) BeforeCreate(tx *gorm.DB) (err error) {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return
}

func (c *Group) BeforeUpdate(tx *gorm.DB) (err error) {
	c.UpdateTime = time.Now()
	return
}

func (c *Group) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

func (c *groupModel) List() (group []Group, err error) {
	err = db.Find(&group).Error
	return group, err
}

func (c *groupModel) GetById(id int64) (result Group, err error) {
	err = db.Where("id = ?", id).First(&result).Error
	return
}

func (c *groupModel) GetByName(name string) (result Group, err error) {
	err = db.Where("name = ?", name).First(&result).Error
	return
}

func (c *groupModel) NotIn(ids []int64) (group []Group, err error) {
	err = db.Where("id NOT IN ?", ids).Find(&group).Error
	return group, err
}

func (c *groupModel) Create(m *Group) error {
	return db.Create(m).Error
}

func (c *groupModel) Update(m *Group) error {
	return db.Save(m).Error
}

func (c *groupModel) DeleteById(groupId int64) error {
	return db.Delete(&Group{}, groupId).Error
}

func (c *groupModel) FilterIdsByStr(ids string) ([]Group, error) {
	idList := strings.Split(ids, ",")
	int64s, err := parsers.ParseInt64ByStr(idList)
	if err != nil {
		return nil, err
	}
	var groups []Group
	for _, id := range int64s {
		g, err := c.GetById(id)
		if err == nil {
			groups = append(groups, g)
		}
	}
	return groups, nil
}

func (c *groupModel) IsValidIdsByStr(ids string) bool {
	idsLength := len(strings.Split(ids, ","))
	groups, _ := c.FilterIdsByStr(ids)
	if idsLength != len(groups) {
		return false
	}
	return true
}

func (c *groupModel) RelDelete(groupId int64) []error {
	var errs []error
	errs = append(errs, RBACMenuPermissionsGroupModel.DeleteByGroupId(groupId))
	errs = append(errs, RBACMenuRoleBindingGroupModel.DeleteByGroupId(groupId))
	errs = append(errs, RBACAPIRoleBindingGroupModel.DeleteByGroupId(groupId))
	return errs
}
