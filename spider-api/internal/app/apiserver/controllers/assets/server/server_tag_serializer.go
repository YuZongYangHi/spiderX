package server

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type TagSerializer struct {
	model  *[]models.ServerTag
	filter map[string]interface{}
}

func (c *TagSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *TagSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *TagSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *TagSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *TagSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *TagSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameServerTag,
		FilterCondition:     c.filter,
		FilterConditionType: base.SuitNameFilterCondition,
		Model:               c.model,
	}
}

func NewServerTagSerializer() *TagSerializer {
	return &TagSerializer{
		model:  &[]models.ServerTag{},
		filter: map[string]interface{}{},
	}
}
