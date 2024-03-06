package models

import (
	"errors"
	"net"
	"time"
)

type blacklistModel struct{}

type RequestBlacklist struct {
	Id           int64     `json:"id"`
	IpCollection string    `gorm:"column:ip_collection" json:"ipCollection"`
	Type         int       `json:"type"`
	Description  string    `json:"description"`
	CreateTime   time.Time `json:"createTime"`
	UpdateTime   time.Time `json:"updateTime"`
}

func (*RequestBlacklist) TableName() string {
	return TableNameRequestBlacklist
}

func (*blacklistModel) GetByIp(ip string) (*RequestBlacklist, error) {
	var result RequestBlacklist
	err := OrmDB().Where("ip_collection = ? AND type = 0", ip).First(&result).Error
	return &result, err
}

func (*blacklistModel) GetByCidr(ip string) (*RequestBlacklist, error) {
	var list []RequestBlacklist
	OrmDB().Where("type = 1").Find(&list)
	if len(list) == 0 {
		return nil, errors.New("content not found")
	}

	netIp := net.ParseIP(ip)

	for _, obj := range list {
		_, cidr, _ := net.ParseCIDR(obj.IpCollection)
		if cidr.Contains(netIp) {
			return &obj, nil
		}
	}
	return nil, errors.New("content not found")
}

func (c *blacklistModel) GetIpByCollection(ip string) (*RequestBlacklist, error) {
	ipInstance, err := c.GetByIp(ip)
	if ipInstance.Id > 0 && err == nil {
		return ipInstance, nil
	}
	return c.GetByCidr(ip)
}
