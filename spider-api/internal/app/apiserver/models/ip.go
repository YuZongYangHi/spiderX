package models

import "time"

type netIpModel struct{}

type NetIp struct {
	Id          int64     `json:"id"`
	IpRangeId   int64     `gorm:"column:ip_range_id" json:"ipRangeId"`
	Ip          string    `gorm:"column:ip" json:"ip"`
	Netmask     string    `gorm:"column:netmask" json:"netmask"`
	Gateway     string    `json:"gateway"`
	IpRange     IpRange   `gorm:"foreignKey:ip_range_id" json:"ipRange"`
	Type        int64     `json:"type"`
	Version     int64     `json:"version"`
	Operator    int64     `json:"operator"`
	Env         int64     `json:"env"`
	Status      int64     `json:"status"`
	Creator     string    `json:"creator"`
	Description string    `json:"description"`
	CreateTime  time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type NetIpRelResource struct {
	Id         int64     `json:"id"`
	Type       int64     `json:"type"`
	ResourceId int64     `gorm:"column:resource_id" json:"ResourceId"`
	IpNetId    int64     `gorm:"column:ip_net_id" json:"ipNetId"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*NetIp) TableName() string {
	return TableNameServerIp
}

func (*NetIpRelResource) TableName() string {
	return TableNameServerIpRelResource
}

func (c *NetIp) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    NetIpRelPreload,
	}
}

func (c *netIpModel) GetByIp(ip string) (NetIp, error) {
	var result NetIp
	err := db.Where("ip = ?", ip).Preload("IpRange").First(&result).Error
	return result, err
}

func (c *netIpModel) ClearRelResource(id int64) error {
	var result NetIpRelResource
	return db.Where("ip_net_id = ?", id).Delete(&result).Error
}

func (c *netIpModel) GetRelResource(m NetIpRelResource) (NetIpRelResource, error) {
	var result NetIpRelResource
	err := db.Where("resource_id = ? AND type = ? AND ip_net_id = ?", m.ResourceId, m.Type, m.IpNetId).
		First(&result).
		Error
	return result, err
}

func (c *NetIpRelResource) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
