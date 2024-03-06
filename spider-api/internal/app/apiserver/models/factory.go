package models

import "time"

type factoryModel struct{}

type Factory struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name"`
	Creator     string    `json:"creator"`
	ModeName    string    `gorm:"column:mode_name" json:"modeName"`
	EnName      string    `gorm:"column:en_name" json:"enName"`
	CnName      string    `gorm:"column:cn_name" json:"cnName"`
	Description string    `json:"description"`
	CreateTime  time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*factoryModel) GetByName(name string) (Factory, error) {
	var factory Factory
	err := db.Where("name = ?", name).First(&factory).Error
	return factory, err
}

func (*Factory) TableName() string {
	return TableNameFactory
}

func (c *Factory) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
