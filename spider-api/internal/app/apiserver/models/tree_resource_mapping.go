package models

import "time"

const (
	TreeResourceMappingServerType = 1
	TreeResourceMappingNodeType   = 2
)

type TreeResourceMapping struct {
	Id         int64     `json:"id"`
	TreeId     int64     `gorm:"column:tree_id" json:"treeId"`
	ResourceId int64     `gorm:"column:resource_id" json:"resourceId"`
	Type       int64     `json:"type"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0);autoUpdateTime" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0);autoUpdateTime" json:"updateTime"`
}

func (*TreeResourceMapping) TableName() string {
	return TableNameTreeResourceMapping
}

func (c *TreeResourceMapping) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
	}
}
