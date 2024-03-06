package models

import "time"

type requestWhitelistModel struct{}

type RequestWhitelist struct {
	Id          int64     `gorm:"primaryKey" json:"id"`
	URI         string    `gorm:"size(256);not null" json:"uri"`
	Method      string    `json:"method"`
	Description string    `gorm:"size(256)" json:"description"`
	CreateUser  string    `gorm:"column:create_user"`
	CreatedAt   time.Time `gorm:"column:create_time" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"column:update_time" json:"updatedAt"`
}

func (*RequestWhitelist) TableName() string {
	return TableNameRequestWhitelist
}

func (c *requestWhitelistModel) GetByURI(uri string) (result *RequestWhitelist, err error) {
	db.Where("uri = ?", uri).First(&result)
	return
}
