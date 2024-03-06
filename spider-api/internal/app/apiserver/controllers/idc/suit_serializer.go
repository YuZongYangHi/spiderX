package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SuitSerializer struct {
	model  *[]models.Suit
	filter map[string]interface{}
}

func (c *SuitSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *SuitSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *SuitSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SuitSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SuitSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *SuitSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameSuit,
		FilterCondition:     c.filter,
		FilterConditionType: base.SuitFieldFilterCondition,
		Model:               c.model,
	}
}

func NewSuitSerializer() *SuitSerializer {
	return &SuitSerializer{
		model:  &[]models.Suit{},
		filter: map[string]interface{}{},
	}
}

type SuitTypeSerializer struct {
	model  *[]models.SuitType
	filter map[string]interface{}
}

func (c *SuitTypeSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *SuitTypeSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *SuitTypeSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SuitTypeSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SuitTypeSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *SuitTypeSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameSuitType,
		FilterCondition:     c.filter,
		FilterConditionType: base.SuitNameFilterCondition,
		Model:               c.model,
	}
}

func NewSuitTypeSerializer() *SuitTypeSerializer {
	return &SuitTypeSerializer{
		model:  &[]models.SuitType{},
		filter: map[string]interface{}{},
	}
}

type SuitSeasonSerializer struct {
	model  *[]models.SuitSeason
	filter map[string]interface{}
}

func (c *SuitSeasonSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *SuitSeasonSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *SuitSeasonSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *SuitSeasonSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *SuitSeasonSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *SuitSeasonSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameSuitSeason,
		FilterCondition:     c.filter,
		FilterConditionType: base.SuitNameFilterCondition,
		Model:               c.model,
	}
}

func NewSuitSeasonSerializer() *SuitSeasonSerializer {
	return &SuitSeasonSerializer{
		model:  &[]models.SuitSeason{},
		filter: map[string]interface{}{},
	}
}
