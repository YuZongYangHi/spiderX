package node

import (
	"errors"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var FieldFilterCondition = []base.SerializersField{
	{
		Field: "id",
		Type:  base.EqualExpressionEnum,
	},
	{
		Field: "name",
		Type:  base.LikeExpressionEnum,
	}, {
		Field:  "cnName",
		Type:   base.LikeExpressionEnum,
		Column: "cn_name",
	}, {
		Field: "operator",
		Type:  base.EqualExpressionEnum,
	}, {
		Field: "bandwidth",
		Type:  base.LikeExpressionEnum,
	}, {
		Field: "region",
		Type:  base.EqualExpressionEnum,
	}, {
		Field: "province",
		Type:  base.EqualExpressionEnum,
	}, {
		Field: "status",
		Type:  base.EqualExpressionEnum,
	}, {
		Field: "creator",
		Type:  base.LikeExpressionEnum,
	}, {
		Field: "attribute",
		Type:  base.EqualExpressionEnum,
	}, {
		Field: "grade",
		Type:  base.EqualExpressionEnum,
	}, {
		Field: "contract",
		Type:  base.EqualExpressionEnum,
	}, {
		Field:  "isDeleted",
		Type:   base.EqualExpressionEnum,
		Column: "is_deleted",
	},
}

type Serializer struct {
	// Pagination Result
	model *[]models.Node

	allModel *[]models.Node
	filter   map[string]interface{}
}

func (c *Serializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *Serializer) Order() []string {
	return []string{"update_time desc, status"}
}

func (c *Serializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	if !base.GetQueryIsDeleted(query) {
		return map[string]interface{}{"is_deleted": "0"}
	}
	return nil
}

func (c *Serializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	if v, ok := query["productLines"]; ok {
		var result []models.Node
		tx.Preload(clause.Associations).Find(&result)
		var nodeIds []int64
		treeIds := util.ParseIntArrayByStr(v.(string))
		if len(treeIds) == 0 {
			return tx, errors.New("tree params invalid")
		}
		for _, treeId := range treeIds {
			for _, item := range result {
				if len(item.ProductLines) == 0 {
					continue
				}
				for _, dpl := range item.ProductLines {
					if dpl.Id == treeId {
						nodeIds = append(nodeIds, item.Id)
						break
					}
				}
			}
		}
		return models.OrmDB().Table(models.TableNameNode).
			Where("id IN (?)", nodeIds), nil
	}
	return tx, nil
}

func (c *Serializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *Serializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameNode,
		FilterCondition:     c.filter,
		FilterConditionType: FieldFilterCondition,
		Model:               c.model,
	}
}

func NewSerializer() *Serializer {
	return &Serializer{
		model:  &[]models.Node{},
		filter: map[string]interface{}{},
	}
}
