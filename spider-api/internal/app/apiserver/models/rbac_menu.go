package models

import (
	"gorm.io/gorm/clause"
	"time"
)

type rbacMenuModel struct{}

type Menu struct {
	Id          int64       `json:"id"`
	Name        string      `gorm:"column:name" json:"name"`
	Key         string      `gorm:"column:key" json:"key"`
	ParentId    int64       `gorm:"column:parent_id" json:"parentId"`
	CreateUser  string      `gorm:"column:create_user" json:"createUser"`
	Roles       []*MenuRole `gorm:"many2many:rbac_menu_role_binding_menu;joinForeignKey:menu_id;joinReferences:role_id" json:"roles"`
	Description string      `json:"description"`
	CreateTime  time.Time   `json:"createTime"`
	UpdateTime  time.Time   `json:"updateTime"`
}

type RBACMenuCollection struct {
	Menu
	Children []Menu `json:"children"`
}

func (*Menu) TableName() string {
	return TableNameRBACMenu
}

func (c *rbacMenuModel) GetByNameAndKey(name, key string) (result []Menu, err error) {
	err = db.Where("`key` = ? AND name = ?", key, name).Find(&result).Error
	return
}

func (c *rbacMenuModel) GetById(id int64) (menu Menu, err error) {
	err = db.Where("id = ?", id).First(&menu).Error
	return
}

func (c *rbacMenuModel) Create(m Menu) error {
	err := db.Create(&m).Error
	return err
}

func (c *rbacMenuModel) UpdateById(id int64, m *Menu) error {
	return db.Model(&Menu{}).Where("id = ?", id).Updates(
		Menu{Name: m.Name, Key: m.Key, ParentId: m.ParentId, UpdateTime: time.Now()}).Error
}

func (c *rbacMenuModel) DeleteById(id int64) error {
	return db.Delete(&Menu{}, id).Error
}

func (c *rbacMenuModel) DeleteByParentId(id int64) error {
	return db.Delete(&Menu{}, "parent_id = ?", id).Error
}

func (c *rbacMenuModel) SearchByName(name string) (result []Menu, err error) {
	err = db.Where("name LIKE ?", "%"+name+"%").Find(&result).Error
	return result, err
}

func (c *rbacMenuModel) GetAll() (result []Menu, err error) {
	err = db.Find(&result).Error
	return result, err
}

func (c *rbacMenuModel) ListByParentId(parentId int64) ([]Menu, error) {
	var menu []Menu
	err := db.Where("parent_id = ?", parentId).
		Preload(clause.Associations).
		Find(&menu).
		Error
	return menu, err
}

func (c *rbacMenuModel) List() []RBACMenuCollection {
	parentList, _ := c.ListByParentId(0)
	return c.ListTree(parentList)
}

func (c *rbacMenuModel) ListTree(list []Menu) []RBACMenuCollection {
	var result []RBACMenuCollection
	for _, parent := range list {
		childrenList, _ := c.ListByParentId(parent.Id)
		var children []Menu
		if childrenList != nil {
			for _, child := range childrenList {
				children = append(children, child)
			}
		}
		result = append(result, RBACMenuCollection{
			Menu:     parent,
			Children: children,
		})
	}
	return result
}

func (c *rbacMenuModel) ListAllKeys() []string {
	var keys []string
	var result []Menu
	err := db.Find(&result).Error
	if err != nil {
		return keys
	}
	for _, r := range result {
		keys = append(keys, r.Key)
	}
	return keys
}

func (c *rbacMenuModel) ListKeysByUser(user *User) []string {
	if user.IsAdmin {
		return c.ListAllKeys()
	}
	result := []string{}
	rbList, err := RBACMenuRoleBindingModel.ListByUser(user)
	if rbList == nil || err != nil {
		return result
	}

	menus := RBACMenuRoleBindingModel.ListMenuByRoleBinding(rbList)
	for _, m := range menus {
		result = append(result, m.Key)
	}
	return result
}

func (c *rbacMenuModel) ListMenu() ([]Menu, error) {
	var menus []Menu

	err := OrmDB().Find(&menus).Error
	return menus, err
}
