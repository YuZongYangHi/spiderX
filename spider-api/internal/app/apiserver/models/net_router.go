package models

import "time"

type NetRouter struct {
	Id          int64       `json:"id"`
	Name        string      `json:"name"`
	Status      int64       `json:"status"`
	Sn          string      `json:"sn"`
	RackSlotId  int64       `gorm:"column:idc_rack_slot_id" json:"rackSlotId"`
	RackSlot    IdcRackSlot `gorm:"foreignKey:idc_rack_slot_id" json:"rackSlot"`
	FactoryId   int64       `gorm:"column:factory_id" json:"factoryId"`
	Factory     Factory     `gorm:"foreignKey:factory_id" json:"factory"`
	IP          NetIp       `gorm:"foreignKey:ip_net_id" json:"ip"`
	IpNetId     int64       `gorm:"column:ip_net_id" json:"ipNetId"`
	NodeId      int64       `gorm:"column:node_id" json:"nodeId"`
	Node        Node        `gorm:"foreignKey:node_id" json:"node"`
	Creator     string      `json:"creator"`
	Username    string      `json:"username"`
	Password    string      `json:"password"`
	Description string      `json:"description"`
	CreateTime  time.Time   `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time   `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*NetRouter) TableName() string {
	return TableNameNetRouter
}

func (c *NetRouter) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    NetRouterRelPreload,
	}
}
