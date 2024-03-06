package models

import (
	"time"
)

type providerModel struct{}

type Provider struct {
	Id         int64     `json:"id"`
	Name       string    `json:"name"`
	Alias      string    `json:"alias"`
	Creator    string    `json:"creator"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*Provider) TableName() string {
	return TableNameProvider
}

func (*providerModel) GetByName(name string) (Provider, error) {
	var provider Provider
	err := db.Where("name = ?", name).First(&provider).Error
	return provider, err
}

func (c *Provider) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
