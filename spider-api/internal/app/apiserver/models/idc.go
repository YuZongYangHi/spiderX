package models

import (
	"time"
)

type idcModel struct{}

type Idc struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name"`
	CnName      string    `gorm:"column:cn_name" json:"cnName"`
	Status      int64     `json:"status"`
	PhysicsAzId int64     `gorm:"column:physics_az_id" json:"physicsAzId"`
	VirtualAzId int64     `gorm:"column:virtual_az_id" json:"virtualAzId"`
	Address     string    `json:"address"`
	Region      string    `json:"region"`
	City        string    `json:"city"`
	CabinetNum  int64     `gorm:"column:cabinet_num" json:"cabinetNum"`
	IdcPhone    string    `gorm:"column:idc_phone" json:"idcPhone"`
	IdcMail     string    `gorm:"column:idc_mail" json:"idcMail"`
	Comment     string    `json:"comment"`
	Creator     string    `json:"creator"`
	PhysicsAz   Az        `gorm:"foreignKey:physics_az_id" json:"physicsAz"`
	VirtualAz   Az        `gorm:"foreignKey:virtual_az_id" json:"virtualAz"`
	CreateTime  time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*Idc) TableName() string {
	return TableNameIdc
}

func (c *Idc) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
		Preload:    IdcRelPreload,
	}
}

func (*idcModel) GetByName(name string) (Idc, error) {
	var idc Idc
	err := db.Where("name = ?", name).First(&idc).Error
	return idc, err
}
