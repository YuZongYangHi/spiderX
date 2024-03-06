package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type RackSlotSerializer struct {
	model  *[]models.IdcRackSlot
	filter map[string]interface{}
}

func (c *RackSlotSerializer) Preload() []string {
	return []string{"IdcRack", "IdcRack.IdcRoom", "IdcRack.IdcRoom.Idc", "IdcRack.IdcRoom.Idc.PhysicsAz", "IdcRack.IdcRoom.Idc.VirtualAz"}
}

func (c *RackSlotSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *RackSlotSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *RackSlotSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *RackSlotSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *RackSlotSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameIdcRackSlot,
		FilterCondition:     c.filter,
		FilterConditionType: base.IdcRackSlotFilterCondition,
		Model:               c.model,
	}
}

func NewRackSlotSerializer() *RackSlotSerializer {
	return &RackSlotSerializer{
		model:  &[]models.IdcRackSlot{},
		filter: map[string]interface{}{},
	}
}
