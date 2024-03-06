package user

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var (
	FieldFilterCondition = []base.SerializersField{
		{
			Field: "id",
			Type:  base.ContainsExpressionEnum,
		},
		{
			Field: "username",
			Type:  base.LikeExpressionEnum,
		},
		{
			Field: "name",
			Type:  base.LikeExpressionEnum,
		}, {
			Field: "email",
			Type:  base.LikeExpressionEnum,
		}, {
			Field:  "isAdmin",
			Column: "is_admin",
			Type:   base.EqualExpressionEnum,
		}, {
			Field:  "isActive",
			Column: "is_active",
			Type:   base.EqualExpressionEnum,
		}, {
			Field:  "groupId",
			Column: "group_id",
			Type:   base.EqualExpressionEnum,
		},
		{
			Field:  "users",
			Column: "username",
			Type:   base.ContainsExpressionEnum,
		},
		{
			Field:  "userIds",
			Column: "id",
			Type:   base.ContainsExpressionEnum,
		},
	}
)

type Serializer struct {
	model  *[]models.User
	Filter map[string]interface{}
}

func (c *Serializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *Serializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *Serializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *Serializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *Serializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *Serializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameUser,
		FilterCondition:     c.Filter,
		FilterConditionType: FieldFilterCondition,
		Model:               c.model,
	}
}

func NewSerializer() *Serializer {
	return &Serializer{
		model:  &[]models.User{},
		Filter: map[string]interface{}{},
	}
}
