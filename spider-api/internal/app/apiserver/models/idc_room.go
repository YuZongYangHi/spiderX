package models

import "time"

type IdcRoom struct {
	Id          int64     `json:"id"`
	RoomName    string    `gorm:"column:room_name" json:"roomName"`
	IdcId       int64     `gorm:"column:idc_id" json:"idcId"`
	Idc         Idc       `gorm:"foreignKey:idc_id" json:"idc"`
	PduStandard string    `gorm:"column:pdu_standard" json:"pduStandard"`
	PowerMode   string    `gorm:"column:power_mode" json:"powerMode"`
	RackSize    string    `gorm:"column:rack_size" json:"rackSize"`
	BearerType  string    `gorm:"column:bearer_type" json:"bearerType"`
	BearWeight  string    `gorm:"column:bear_weight" json:"bearWeight"`
	Status      int64     `json:"status"`
	Creator     string    `json:"creator"`
	CreateTime  time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*IdcRoom) TableName() string {
	return TableNameIdcRoom
}

func (c *IdcRoom) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

func (*IdcRoom) GetByName(name string) (IdcRoom, error) {
	var idcRoom IdcRoom
	err := db.Where("room_name = ?", name).First(&idcRoom).Error
	return idcRoom, err
}
