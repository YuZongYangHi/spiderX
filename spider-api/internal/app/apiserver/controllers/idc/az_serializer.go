package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type AzSerializer struct {
	model  *[]models.Az
	filter map[string]interface{}
}

func (c *AzSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *AzSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *AzSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *AzSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *AzSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *AzSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameAz,
		FilterCondition:     c.filter,
		FilterConditionType: base.AzFieldFilterCondition,
		Model:               c.model,
	}
}

func NewAzSerializer() *AzSerializer {
	return &AzSerializer{
		model:  &[]models.Az{},
		filter: map[string]interface{}{},
	}
}
