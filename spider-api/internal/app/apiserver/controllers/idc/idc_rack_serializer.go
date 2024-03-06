package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type IdcRackSerializer struct {
	model  *[]models.IdcRack
	filter map[string]interface{}
}

func (c *IdcRackSerializer) Preload() []string {
	return []string{"IdcRoom", "IdcRoom.Idc", "IdcRoom.Idc.PhysicsAz", "IdcRoom.Idc.VirtualAz"}
}

func (c *IdcRackSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *IdcRackSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *IdcRackSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *IdcRackSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *IdcRackSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameIdcRack,
		FilterCondition:     c.filter,
		FilterConditionType: base.IdcRackFilterCondition,
		Model:               c.model,
	}
}

func NewIdcRackSerializer() *IdcRackSerializer {
	return &IdcRackSerializer{
		model:  &[]models.IdcRack{},
		filter: map[string]interface{}{},
	}
}
