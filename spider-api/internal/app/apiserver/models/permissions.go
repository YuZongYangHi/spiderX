package models

type PermissionsAction struct {
	Read   bool `gorm:"column:read" json:"read"`
	Create bool `gorm:"column:create" json:"create"`
	Update bool `gorm:"column:update" json:"update"`
	Delete bool `gorm:"column:delete" json:"delete"`
}

func AllPermissionsAction() PermissionsAction {
	return PermissionsAction{
		Read:   true,
		Create: true,
		Update: true,
		Delete: true,
	}
}

func ReadOnlyPermissionAction() PermissionsAction {
	return PermissionsAction{
		Read:   true,
		Create: false,
		Update: false,
		Delete: false,
	}
}
