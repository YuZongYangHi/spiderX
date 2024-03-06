package models

import "time"

type menuPermissionGroupModel struct{}

type MenuPermissionsGroup struct {
	Id         int64     `json:"id"`
	MenuId     int64     `gorm:"column:menu_id" json:"menuId"`
	GroupId    int64     `gorm:"column:group_id" json:"groupId"`
	Group      Group     `gorm:"foreignKey:GroupId" json:"group"`
	Menu       Menu      `gorm:"foreignKey:MenuId" json:"menu"`
	Read       bool      `gorm:"column:read" json:"read"`
	Create     bool      `gorm:"column:create" json:"create"`
	Update     bool      `gorm:"column:update" json:"update"`
	Delete     bool      `gorm:"column:delete" json:"delete"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*MenuPermissionsGroup) TableName() string {
	return TableNameRBACMenuRolePermissionGroup
}

func (*menuPermissionGroupModel) GetByMenuIdAndGroupId(menuId, groupId int64) (MenuPermissionsGroup, error) {
	var result MenuPermissionsGroup
	err := OrmDB().Where("group_id = ? AND menu_id = ?", groupId, menuId).First(&result).Error
	return result, err
}

func (c *menuPermissionGroupModel) GetByMenuId(menuId int64) (result []MenuPermissionsGroup, err error) {
	err = db.Distinct("group_id").Where("menu_id = ?", menuId).Find(&result).Error
	return
}

func (*menuPermissionGroupModel) GetByMenuIdAndId(menuId, id int64) (MenuPermissionsGroup, error) {
	var result MenuPermissionsGroup
	err := OrmDB().Where("id = ? AND menu_id = ?", id, menuId).First(&result).Error
	return result, err
}

func (c *menuPermissionGroupModel) DeleteByMenuId(menuId, permissionsId int64) error {
	return db.Where("menu_id = ? AND id = ?", menuId, permissionsId).Delete(&MenuPermissionsGroup{}).Error
}

func (c *menuPermissionGroupModel) UpdateById(id int64, m *PermissionsAction) error {
	return db.Model(&MenuPermissionsGroup{}).Where(" id = ?", id).Updates(
		map[string]interface{}{
			"read":   m.Read,
			"update": m.Update,
			"delete": m.Delete,
			"create": m.Create,
		}).Error
}

func (c *menuPermissionGroupModel) DeleteByGroupId(groupId int64) error {
	return db.Where("group_id = ?", groupId).Delete(&MenuPermissionsGroup{}).Error
}

func (c *menuPermissionGroupModel) Create(m MenuPermissionsGroup) error {
	return db.Create(&m).Error
}
