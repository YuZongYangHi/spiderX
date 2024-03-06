package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type IdcRoomSerializer struct {
	model  *[]models.IdcRoom
	filter map[string]interface{}
}

func (c *IdcRoomSerializer) Preload() []string {
	return []string{"Idc", "Idc.PhysicsAz", "Idc.VirtualAz"}
}

func (c *IdcRoomSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *IdcRoomSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *IdcRoomSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *IdcRoomSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *IdcRoomSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameIdcRoom,
		FilterCondition:     c.filter,
		FilterConditionType: base.IdcRoomFilterCondition,
		Model:               c.model,
	}
}

func NewIdcRoomSerializer() *IdcRoomSerializer {
	return &IdcRoomSerializer{
		model:  &[]models.IdcRoom{},
		filter: map[string]interface{}{},
	}
}
