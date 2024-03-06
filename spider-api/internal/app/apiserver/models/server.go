package models

import (
	"time"
)

type ServerTag struct {
	Id         int64     `json:"id"`
	Name       string    `json:"name"`
	Creator    string    `json:"creator"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*ServerTag) TableName() string {
	return TableNameServerTag
}

func (c *ServerTag) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

type ServerRelTag struct {
	Id         int64     `json:"id"`
	ServerId   int64     `gorm:"column:server_id" json:"serverId"`
	TagId      int64     `gorm:"column:tag_id" json:"tagId"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*ServerRelTag) TableName() string {
	return TableNameServerRelTag
}

func (c *ServerRelTag) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

type serverModel struct{}

type Server struct {
	Id            int64        `json:"id"`
	Sn            string       `json:"sn"`
	Hostname      string       `json:"hostname"`
	Type          int64        `json:"type"`
	Suit          Suit         `gorm:"foreignKey:suit_id" json:"suit"`
	SuitId        int64        `gorm:"column:suit_id" json:"suitId"`
	PowerInfo     string       `gorm:"column:power_info" json:"powerInfo"`
	PowerCost     string       `gorm:"column:power_cost" json:"powerCost"`
	Role          int64        `json:"role"`
	Operator      int64        `json:"operator"`
	ProviderId    int64        `gorm:"column:provider_id" json:"providerId"`
	Provider      Provider     `gorm:"foreignKey:provider_id" json:"provider"`
	FactoryId     int64        `gorm:"column:factory_id" json:"factoryId"`
	Factory       Factory      `gorm:"foreignKey:factory_id" json:"factory"`
	NodeId        int64        `gorm:"column:node_id" json:"nodeId"`
	Node          Node         `gorm:"foreignKey:node_id" json:"node"`
	IdcRackSlotId int64        `gorm:"column:idc_rack_slot_id" json:"idcRackSlotId"`
	IdcRackSlot   IdcRackSlot  `gorm:"foreignKey:idc_rack_slot_id" json:"idcRackSlot"`
	Status        int64        `json:"status"`
	AppEnv        string       `gorm:"column:app_env" json:"appEnv"`
	AppEnvDesc    string       `gorm:"column:app_env_desc" json:"appEnvDesc"`
	SystemType    string       `gorm:"column:system_type" json:"systemType"`
	SystemVersion string       `gorm:"column:system_version" json:"systemVersion"`
	SystemArch    string       `gorm:"column:system_arch" json:"systemArch"`
	BelongTo      string       `gorm:"column:belong_to" json:"belongTo"`
	BelongToDesc  string       `gorm:"column:belong_to_desc" json:"belongToDesc"`
	ArrivalTime   string       `gorm:"column:arrival_time" json:"arrivalTime"`
	OverdueTime   string       `gorm:"column:overdue_time" json:"overdueTime"`
	PrivNetIp     string       `gorm:"column:priv_net_ip" json:"privNetIp"`
	PrivNetMask   string       `gorm:"column:priv_net_mask" json:"privNetMask"`
	PrivNetGw     string       `gorm:"column:priv_net_gw" json:"privNetGw"`
	PubNetIp      string       `gorm:"column:pub_net_ip" json:"pubNetIp"`
	PubNetMask    string       `gorm:"column:pub_net_mask" json:"pubNetMask"`
	PubNetGw      string       `gorm:"column:pub_net_gw" json:"pubNetGw"`
	MgmtPortIp    string       `gorm:"column:mgmt_port_ip" json:"mgmtPortIp"`
	MgmtPortMask  string       `gorm:"column:mgmt_port_mask" json:"mgmtPortMask"`
	MgmtPortGw    string       `gorm:"column:mgmt_port_gw" json:"mgmtPortGw"`
	Comment       string       `json:"comment"`
	Creator       string       `json:"creator"`
	Tags          []*ServerTag `gorm:"many2many:server_rel_tag;joinForeignKey:server_id;joinReferences:tag_id" json:"tags"`
	ProductLines  []*Tree      `gorm:"many2many:tree_resource_mapping;joinForeignKey:resource_id;joinReferences:tree_id" json:"productLines"`
	IsDeleted     int64        `gorm:"column:is_deleted" json:"isDeleted"`
	CreateTime    time.Time    `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime    time.Time    `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*Server) TableName() string {
	return TableNameServer
}

func (*serverModel) Preload() []string {
	return []string{"Tags", "ProductLines", "Suit", "Provider", "Provider",
		"Factory", "Node", "IdcRackSlot", "IdcRackSlot.IdcRack", "IdcRackSlot.IdcRack.IdcRoom",
		"IdcRackSlot.IdcRack.IdcRoom.Idc", "IdcRackSlot.IdcRack.IdcRoom.Idc.PhysicsAz",
		"IdcRackSlot.IdcRack.IdcRoom.Idc.VirtualAz"}
}

func (c *serverModel) GetBySn(sn string) (Server, error) {
	var result Server
	err := db.Where("sn = ?", sn).First(&result).Error
	return result, err
}

func (c *serverModel) GetById(id int64) (Server, error) {
	var result Server
	tx := db.Where("id = ?", id)
	for _, p := range c.Preload() {
		tx = tx.Preload(p)
	}
	err := tx.First(&result).Error
	return result, err
}

func (c *serverModel) GetByHostname(hostname string) (Server, error) {
	var result Server
	err := db.Where("hostname = ?", hostname).First(&result).Error
	return result, err
}

func (c *Server) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
