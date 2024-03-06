package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type FactorySerializer struct {
	model  *[]models.Factory
	filter map[string]interface{}
}

func (c *FactorySerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *FactorySerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *FactorySerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *FactorySerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *FactorySerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *FactorySerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameFactory,
		FilterCondition:     c.filter,
		FilterConditionType: base.FactoryFieldFilterCondition,
		Model:               c.model,
	}
}

func NewFactorySerializer() *FactorySerializer {
	return &FactorySerializer{
		model:  &[]models.Factory{},
		filter: map[string]interface{}{},
	}
}
