package models

import "time"

type IpRange struct {
	Id          int64     `json:"id"`
	Cidr        string    `json:"cidr"`
	Env         int64     `gorm:"column:env" json:"env"`
	Version     int64     `json:"version"`
	Status      int64     `json:"status"`
	Operator    int64     `json:"operator"`
	Ip          []NetIp   `json:"ip"`
	NodeId      int64     `gorm:"column:node_id" json:"nodeId"`
	Node        Node      `gorm:"foreignKey:node_id" json:"node"`
	Gateway     string    `json:"gateway"`
	Type        int64     `json:"type"`
	Creator     string    `json:"creator"`
	Description string    `json:"description"`
	CreateTime  time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*IpRange) TableName() string {
	return TableNameServerIpRange
}

func (c *IpRange) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
