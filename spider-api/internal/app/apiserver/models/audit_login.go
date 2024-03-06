package models

import "time"

type AuditLogin struct {
	Id         int64     `json:"id"`
	Username   string    `json:"username"`
	Type       int64     `json:"type"`
	Datetime   time.Time `json:"datetime"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*AuditLogin) TableName() string {
	return TableNameAuditLogin
}

func (c *AuditLogin) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
