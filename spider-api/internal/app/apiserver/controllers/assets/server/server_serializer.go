package server

import (
	"errors"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type TreeSerializer struct {
	model  *[]models.Server
	filter map[string]interface{}
}

func (c *TreeSerializer) Preload() []string {
	return models.ServerModel.Preload()
}

func (c *TreeSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *TreeSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	if !base.GetQueryIsDeleted(query) {
		return map[string]interface{}{"is_deleted": "0"}
	}
	return nil
}

func (c *TreeSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	cc := ctx.(*base.Context)
	var serverList []models.Server
	tx.Preload(clause.Associations).Find(&serverList)
	var serverIds []int64
	if v, ok := query["productLines"]; ok {
		treeIds := util.ParseIntArrayByStr(v.(string))
		for _, treeId := range treeIds {
			for _, item := range serverList {
				if len(item.ProductLines) == 0 {
					continue
				}
				for _, dpl := range item.ProductLines {
					if dpl.Id == treeId {
						serverIds = append(serverIds, item.Id)
						break
					}
				}
			}
		}
	} else {
		for _, server := range serverList {
			serverIds = append(serverIds, server.Id)
		}
	}

	treeId := cc.ParseInt("treeId")
	if treeId == 0 {
		return nil, errors.New(base.InvalidInstanceId)
	}

	treeList, err := models.TreeModel.FindRelNamePathByTreeId(treeId)
	if err != nil {
		return nil, err
	}

	var treeIds []int64
	for _, tree := range treeList {
		treeIds = append(treeIds, tree.Id)
	}

	var result []models.Server
	isDeleted, ok := query["isDeleted"]
	if !ok {
		isDeleted = 0
	}

	err = models.OrmDB().
		Raw(models.QueryRelTreeNodePathServerByTreeIdsSQL, treeIds, isDeleted, serverIds).
		Find(&result).
		Error
	if err != nil {
		return nil, err
	}
	serverIds = make([]int64, 0)
	for _, server := range result {
		serverIds = append(serverIds, server.Id)
	}
	return models.OrmDB().Table(models.TableNameServer).
		Where("id IN (?)", serverIds), nil
}

func (c *TreeSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *TreeSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameServer,
		FilterCondition:     c.filter,
		FilterConditionType: base.ServerFilterCondition,
		Model:               c.model,
	}
}

func NewTreeSerializer() *TreeSerializer {
	return &TreeSerializer{
		model:  &[]models.Server{},
		filter: map[string]interface{}{},
	}
}

type Serializer struct {
	model          *[]models.Server
	filter         map[string]interface{}
	TreeSerializer *TreeSerializer
}

func (c *Serializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *Serializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameServer,
		FilterCondition:     c.filter,
		FilterConditionType: base.ServerFilterCondition,
		Model:               c.model,
	}
}

func (c *Serializer) Preload() []string {
	return models.ServerModel.Preload()
}

func (c *Serializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *Serializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	if !base.GetQueryIsDeleted(query) {
		return map[string]interface{}{"is_deleted": "0"}
	}
	return nil
}

func (c *Serializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil

}

func NewSerializer() *Serializer {
	return &Serializer{
		model:          &[]models.Server{},
		filter:         map[string]interface{}{},
		TreeSerializer: NewTreeSerializer(),
	}
}
