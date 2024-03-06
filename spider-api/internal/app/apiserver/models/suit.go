package models

import "time"

type suitModel struct{}

type Suit struct {
	Id         int64     `json:"id"`
	Name       string    `json:"name"`
	Season     string    `json:"season"`
	Type       string    `json:"type"`
	Cpu        string    `json:"cpu"`
	Memory     string    `json:"memory"`
	Storage    string    `json:"storage"`
	Gpu        string    `json:"gpu"`
	Raid       string    `json:"raid"`
	Psu        string    `json:"psu"`
	Nic        string    `json:"nic"`
	Creator    string    `json:"creator"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type SuitType struct {
	Id         int64     `json:"id"`
	Name       string    `json:"name"`
	Creator    string    `json:"creator"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type SuitSeason struct {
	Id         int64     `json:"id"`
	Name       string    `json:"name"`
	Creator    string    `json:"creator"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*Suit) TableName() string {
	return TableNameSuit
}

func (c *Suit) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

func (*SuitType) TableName() string {
	return TableNameSuitType
}

func (c *SuitType) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

func (*SuitSeason) TableName() string {
	return TableNameSuitSeason
}

func (c *SuitSeason) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

func (*suitModel) GetByName(name string) (Suit, error) {
	var suit Suit
	err := db.Where("name = ?", name).First(&suit).Error
	return suit, err

}
