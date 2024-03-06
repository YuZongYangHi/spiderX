package models

import (
	"errors"
	"fmt"
	"time"
)

type idcRackSlotModel struct{}

type IdcRackSlotFull struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

type IdcRackSlot struct {
	Id         int64     `json:"id"`
	IdcRackId  int64     `gorm:"column:idc_rack_id" json:"idcRackId"`
	IdcRack    IdcRack   `gorm:"foreignKey:idc_rack_id" json:"idcRack"`
	Type       int64     `json:"type"`
	UNum       int64     `gorm:"column:u_num" json:"uNum"`
	Port       int64     `json:"port"`
	Status     int64     `json:"status"`
	Slot       int64     `json:"slot"`
	Creator    string    `json:"creator"`
	CreateTime time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (c *idcRackSlotModel) GetBySlot(slot int64) (IdcRackSlot, error) {
	var idcRackSlot IdcRackSlot
	err := db.Where("slot = ?", slot).
		Preload("IdcRack", "IdcRack.IdcRoom", "IdcRack.IdcRoom.Idc").
		First(&idcRackSlot).
		Error
	return idcRackSlot, err
}

func (c *idcRackSlotModel) GetFullNameBySlot(fullName string, slot int64) (*IdcRackSlot, error) {
	var idcRackSlots []IdcRackSlot
	err := db.Where("slot = ?", slot).
		Preload("IdcRack").
		Preload("IdcRack.IdcRoom").
		Preload("IdcRack.IdcRoom.Idc").
		Find(&idcRackSlots).
		Error
	if err != nil {
		return nil, err
	}

	for _, idcRackSlot := range idcRackSlots {
		if fullName == idcRackSlot.FullName() {
			return &idcRackSlot, nil
		}
	}
	return nil, errors.New("not found")
}

func (c *IdcRackSlot) FullName() string {
	return fmt.Sprintf("%s_%s_%s_%d", c.IdcRack.IdcRoom.Idc.Name, c.IdcRack.IdcRoom.RoomName, c.IdcRack.Name, c.Slot)
}

func (*IdcRackSlot) TableName() string {
	return TableNameIdcRackSlot
}

func (c *IdcRackSlot) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}
