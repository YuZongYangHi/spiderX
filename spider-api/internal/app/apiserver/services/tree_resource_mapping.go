package services

import (
	"errors"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"k8s.io/klog/v2"
)

type TreeResourceMapping struct{}

func (*TreeResourceMapping) BuildModelListByTreeId(t, resourceId int64, treeIds []int64) []models.TreeResourceMapping {
	var l []models.TreeResourceMapping
	for _, treeId := range treeIds {
		l = append(l, models.TreeResourceMapping{
			TreeId:     treeId,
			ResourceId: resourceId,
			Type:       t,
		})
	}
	return l
}

func (c *TreeResourceMapping) AddByNode(resourceId, resourceType int64, treeIds []int64) error {
	validIds := models.TreeModel.FilterValidIds(treeIds)
	if len(validIds) == 0 {
		return errors.New(base.ProductLineListInvalid)
	}

	if err := c.Clear(resourceId, resourceType); err != nil {
		return err
	}

	payloads := c.BuildModelListByTreeId(resourceType, resourceId, validIds)
	for _, i := range payloads {
		if tree, err := c.Get(i.TreeId, i.ResourceId, i.Type); tree.Id > 0 || err == nil {
			continue
		}
		if err := models.OrmDB().Create(&i).Error; err != nil {
			klog.Error(err.Error())
		}
	}
	return nil
}

func (c *TreeResourceMapping) Migrate(srcTreeId int64, targetIds []int64, resourceId, resourceType int64) error {
	if err := c.Delete(srcTreeId, resourceId, resourceType); err != nil {
		return err
	}
	payloads := c.BuildModelListByTreeId(resourceType, resourceId, targetIds)
	for _, i := range payloads {
		if tree, err := c.Get(i.TreeId, i.ResourceId, i.Type); tree.Id > 0 || err == nil {
			continue
		}
		if err := models.OrmDB().Create(&i).Error; err != nil {
			klog.Error(err.Error())
		}
	}
	return nil
}

func (c *TreeResourceMapping) Get(treeId, resourceId, t int64) (models.TreeResourceMapping, error) {
	var result models.TreeResourceMapping
	err := models.OrmDB().
		Where("resource_id = ? AND tree_id = ? AND type = ?", resourceId, treeId, t).
		First(&result).
		Error
	return result, err
}

func (c *TreeResourceMapping) Clear(resourceId, t int64) error {
	var result models.TreeResourceMapping
	return models.OrmDB().
		Where("resource_id = ? AND type = ?", resourceId, t).
		Delete(&result).
		Error
}

func (c *TreeResourceMapping) Delete(treeId, resourceId, resourceType int64) error {
	var result []models.TreeResourceMapping
	return models.OrmDB().
		Where("tree_id = ? AND resource_id = ? AND type = ?", treeId, resourceId, resourceType).
		Delete(&result).
		Error
}

func NewTreeResourceMapping() *TreeResourceMapping {
	return &TreeResourceMapping{}
}
