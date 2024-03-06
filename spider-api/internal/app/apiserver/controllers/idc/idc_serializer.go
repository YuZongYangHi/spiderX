package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type IdcSerializer struct {
	model  *[]models.Idc
	filter map[string]interface{}
}

func (c *IdcSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *IdcSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *IdcSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *IdcSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *IdcSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *IdcSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameIdc,
		FilterCondition:     c.filter,
		FilterConditionType: base.IdcFieldFilterCondition,
		Model:               c.model,
	}
}

func NewIdcSerializer() *IdcSerializer {
	return &IdcSerializer{
		model:  &[]models.Idc{},
		filter: map[string]interface{}{},
	}
}
