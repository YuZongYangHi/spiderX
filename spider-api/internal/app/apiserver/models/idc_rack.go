package models

import "time"

type IdcRack struct {
	Id         int64     `json:"id"`
	Name       string    `json:"name"`
	Row        string    `json:"row"`
	Col        string    `json:"col"`
	Group      string    `json:"group"`
	UNum       int64     `gorm:"column:u_num" json:"uNum"`
	RatedPower int64     `gorm:"column:rated_power" json:"ratedPower"`
	NetUNum    int64     `gorm:"column:net_u_num" json:"netUNum"`
	Current    int64     `json:"current"`
	IdcRoomId  int64     `gorm:"column:idc_room_id" json:"idcRoomId"`
	IdcRoom    IdcRoom   `gorm:"foreignKey:idc_room_id" json:"idcRoom"`
	Status     int64     `json:"status"`
	Creator    string    `json:"creator"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*IdcRack) TableName() string {
	return TableNameIdcRack
}

func (c *IdcRack) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

func (*IdcRack) GetByName(name string) (IdcRack, error) {
	var idcRack IdcRack
	err := db.Where("name = ?", name).First(&idcRack).Error
	return idcRack, err
}
