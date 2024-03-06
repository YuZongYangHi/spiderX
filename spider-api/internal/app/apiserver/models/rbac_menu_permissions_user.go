package models

import "time"

type menuPermissionsUserModel struct{}

type MenuPermissionsUser struct {
	Id         int64     `json:"id"`
	MenuId     int64     `gorm:"column:menu_id" json:"menuId"`
	UserId     int64     `gorm:"column:user_id" json:"userId"`
	User       User      `gorm:"references:Id" json:"user"`
	Menu       Menu      `gorm:"foreignKey:MenuId" json:"menu"`
	Read       bool      `gorm:"column:read" json:"read"`
	Create     bool      `gorm:"column:create" json:"create"`
	Update     bool      `gorm:"column:update" json:"update"`
	Delete     bool      `gorm:"column:delete" json:"delete"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*MenuPermissionsUser) TableName() string {
	return TableNameRBACMenuRolePermissionUser
}

func (*menuPermissionsUserModel) GetByMenuIdAndUserId(menuId, userId int64) (MenuPermissionsUser, error) {
	var result MenuPermissionsUser
	err := OrmDB().Where("user_id = ? AND menu_id = ?", userId, menuId).First(&result).Error
	return result, err
}

func (c *menuPermissionsUserModel) ListByUsers(menuId int64, users []User) (result []MenuPermissionsUser, err error) {
	for _, user := range users {
		perm, err := c.GetByMenuIdAndUserId(menuId, user.Id)
		if err != nil {
			return nil, err
		}
		result = append(result, perm)
	}
	return
}

func (c *menuPermissionsUserModel) GetByMenuId(menuId int64) (result []MenuPermissionsUser, err error) {
	err = db.Distinct("user_id").Where("menu_id = ?", menuId).Find(&result).Error
	return
}

func (*menuPermissionsUserModel) GetByMenuIdAndId(menuId, id int64) (MenuPermissionsUser, error) {
	var result MenuPermissionsUser
	err := OrmDB().Where("id = ? AND menu_id = ?", id, menuId).First(&result).Error
	return result, err
}

func (c *menuPermissionsUserModel) DeleteByMenuId(menuId, permissionsId int64) error {
	return db.Where("menu_id = ? AND id = ?", menuId, permissionsId).Delete(&MenuPermissionsUser{}).Error
}

func (c *menuPermissionsUserModel) UpdateById(id int64, m *PermissionsAction) error {
	return db.Model(&MenuPermissionsUser{}).Where(" id = ?", id).Updates(
		map[string]interface{}{
			"read":   m.Read,
			"update": m.Update,
			"delete": m.Delete,
			"create": m.Create,
		}).Error
}

func (c *menuPermissionsUserModel) DeleteByUserId(userId int64) error {
	return db.Where("user_id = ?", userId).Delete(&MenuPermissionsUser{}).Error
}

func (c *menuPermissionsUserModel) Create(m MenuPermissionsUser) error {
	return db.Create(&m).Error
}
