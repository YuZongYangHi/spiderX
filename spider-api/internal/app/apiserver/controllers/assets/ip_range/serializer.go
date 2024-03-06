package ip_range

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type Serializer struct {
	model  *[]models.IpRange
	filter map[string]interface{}
}

func (c *Serializer) Preload() []string {
	return []string{"Node", "Node.ProductLines", "Ip"}
}

func (c *Serializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *Serializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *Serializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *Serializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *Serializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameServerIpRange,
		FilterCondition:     c.filter,
		FilterConditionType: base.IpRangeFilterCondition,
		Model:               c.model,
	}
}

func NewSerializer() *Serializer {
	return &Serializer{
		model:  &[]models.IpRange{},
		filter: map[string]interface{}{},
	}
}
