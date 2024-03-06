package models

import "time"

type Az struct {
	Id         int64     `json:"id"`
	Name       string    `json:"name"`
	CnName     string    `gorm:"column:cn_name" json:"cnName"`
	Region     string    `json:"region"`
	Province   string    `json:"province"`
	Type       int64     `json:"type"`
	Status     int64     `json:"status"`
	Creator    string    `json:"creator"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*Az) TableName() string {
	return TableNameAz
}

func (c *Az) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
