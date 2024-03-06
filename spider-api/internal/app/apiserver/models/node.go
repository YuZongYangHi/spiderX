package models

import (
	"gorm.io/gorm/clause"
	"time"
)

type nodeModel struct{}

type Node struct {
	Id           int64     `json:"id"`
	Name         string    `json:"name"`
	CnName       string    `gorm:"column:cn_name" json:"cnName"`
	Operator     int64     `json:"operator"`
	Bandwidth    string    `json:"bandwidth"`
	Region       string    `json:"region"`
	Province     string    `json:"province"`
	Status       int64     `json:"status"`
	Creator      string    `json:"creator"`
	Attribute    int64     `json:"attribute"`
	Grade        int64     `json:"grade"`
	Comment      string    `json:"comment"`
	Contract     int64     `json:"contract"`
	ProductLines []*Tree   `gorm:"many2many:tree_resource_mapping;joinForeignKey:resource_id;joinReferences:tree_id" json:"productLines"`
	CreateTime   time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime   time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
	IsDeleted    int64     `gorm:"column:is_deleted" json:"isDeleted"`
}

func (*Node) TableName() string {
	return TableNameNode
}

func (*nodeModel) GetByName(name string) (Node, error) {
	var result Node
	err := db.Where("name = ?", name).First(&result).Error
	return result, err
}

func (*nodeModel) GetById(id int64) (Node, error) {
	var result Node
	err := db.Where("id = ?", id).Preload(clause.Associations).First(&result).Error
	return result, err
}

func (*nodeModel) AddByStruct(m *Node) error {
	return db.Create(m).Error
}

func (c *Node) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
