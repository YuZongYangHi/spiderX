package models

import "time"

type NetSwitch struct {
	Id          int64       `json:"id"`
	Status      int64       `json:"status"`
	Sn          string      `json:"sn"`
	Name        string      `json:"name"`
	RackSlotId  int64       `gorm:"column:idc_rack_slot_id" json:"rackSlotId"`
	RackSlot    IdcRackSlot `gorm:"foreignKey:idc_rack_slot_id" json:"rackSlot"`
	FactoryId   int64       `gorm:"column:factory_id" json:"factoryId"`
	Factory     Factory     `gorm:"foreignKey:factory_id" json:"factory"`
	IpNetId     int64       `gorm:"column:ip_net_id" json:"ipNetId"`
	IP          NetIp       `gorm:"foreignKey:ip_net_id" json:"ip"`
	NodeId      int64       `gorm:"column:node_id" json:"nodeId"`
	Node        Node        `gorm:"foreignKey:node_id" json:"node"`
	MutualRelIp string      `gorm:"column:mutual_rel_ip" json:"mutualRelIp"`
	UpRelPort   string      `gorm:"column:up_rel_port" json:"upRelPort"`
	UpIpRelPort string      `gorm:"column:up_ip_rel_port" json:"upIpRelPort"`
	Type        int64       `json:"type"`
	Username    string      `json:"username"`
	Password    string      `json:"password"`
	Creator     string      `json:"creator"`
	Description string      `json:"description"`
	CreateTime  time.Time   `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time   `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*NetSwitch) TableName() string {
	return TableNameNetSwitch
}

func (c *NetSwitch) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    NetSwitchRelPreload,
	}
}
