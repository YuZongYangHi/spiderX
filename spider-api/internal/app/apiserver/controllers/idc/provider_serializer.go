package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ProviderSerializer struct {
	model  *[]models.Provider
	filter map[string]interface{}
}

func (c *ProviderSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *ProviderSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *ProviderSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *ProviderSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *ProviderSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *ProviderSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameProvider,
		FilterCondition:     c.filter,
		FilterConditionType: base.ProviderFieldFilterCondition,
		Model:               c.model,
	}
}

func NewProviderSerializer() *ProviderSerializer {
	return &ProviderSerializer{
		model:  &[]models.Provider{},
		filter: map[string]interface{}{},
	}
}
