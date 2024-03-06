package net_device

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type NetSwitchSerializer struct {
	model  *[]models.NetSwitch
	filter map[string]interface{}
}

func (c *NetSwitchSerializer) Preload() []string {
	return []string{"IP", "RackSlot", "Factory", "Node", "RackSlot.IdcRack", "RackSlot.IdcRack.IdcRoom", "RackSlot.IdcRack.IdcRoom.Idc"}
}

func (c *NetSwitchSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *NetSwitchSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *NetSwitchSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *NetSwitchSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *NetSwitchSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameNetSwitch,
		FilterCondition:     c.filter,
		FilterConditionType: base.NetSwitchFilterCondition,
		Model:               c.model,
	}
}

func NewNetSwitchSerializer() *NetSwitchSerializer {
	return &NetSwitchSerializer{
		model:  &[]models.NetSwitch{},
		filter: map[string]interface{}{},
	}
}

type NetRouterSerializer struct {
	model  *[]models.NetRouter
	filter map[string]interface{}
}

func (c *NetRouterSerializer) Preload() []string {
	return []string{"IP", "RackSlot", "Factory", "Node", "RackSlot.IdcRack", "RackSlot.IdcRack.IdcRoom", "RackSlot.IdcRack.IdcRoom.Idc"}
}

func (c *NetRouterSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *NetRouterSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *NetRouterSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *NetRouterSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *NetRouterSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameNetRouter,
		FilterCondition:     c.filter,
		FilterConditionType: base.NetRouterFilterCondition,
		Model:               c.model,
	}
}

func NewNetRouterSerializer() *NetRouterSerializer {
	return &NetRouterSerializer{
		model:  &[]models.NetRouter{},
		filter: map[string]interface{}{},
	}
}
