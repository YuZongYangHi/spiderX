package models

import (
	"gorm.io/gorm"
	"time"
)

type Tree struct {
	Id           int64     `json:"id"`
	Name         string    `gorm:"column:name" json:"name"`
	Level        int64     `json:"level"`
	ParentId     int64     `gorm:"column:parent_id" json:"parentId"`
	FullNamePath string    `gorm:"column:full_name_path" json:"fullNamePath"`
	FullIdPath   string    `gorm:"column:full_id_path" json:"fullIdPath"`
	CreateTime   time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime   time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type treeModel struct{}

func (*Tree) TableName() string {
	return TableNameTree
}

func (c *Tree) BeforeCreate(tx *gorm.DB) (err error) {
	c.CreateTime = time.Now()
	c.UpdateTime = time.Now()
	return
}

func (c *Tree) BeforeUpdate(tx *gorm.DB) (err error) {
	c.UpdateTime = time.Now()
	return
}

func (*treeModel) GetAll() ([]Tree, error) {
	var result []Tree
	err := OrmDB().Order("level").Find(&result).Error
	return result, err
}

func (*treeModel) RelDeleteByFullIdPath(fullIdPath string) error {
	return db.Where("full_id_path LIKE ?", "%"+fullIdPath+"%").Delete(&Tree{}).Error
}

func (*treeModel) GetLastRecordOrderId() Tree {
	var result Tree
	db.Order("-id").Last(&result)
	return result
}

func (*treeModel) GetById(id int64) (Tree, error) {
	var result Tree
	err := db.Where("id = ?", id).First(&result).Error
	return result, err
}

func (*treeModel) GetByName(name string) (Tree, error) {
	var result Tree
	err := db.Where("name = ?", name).First(&result).Error
	return result, err
}

func (*treeModel) GetByFullNamePath(fullNamePath string) (Tree, error) {
	var result Tree
	err := db.Where("fullNamePath = ?", fullNamePath).First(&result).Error
	return result, err
}

func (*treeModel) FindByPid(pid int64) ([]Tree, error) {
	var result []Tree
	err := db.Where("parent_id = ?", pid).Find(&result).Error
	return result, err
}

func (*treeModel) FindByFullIdPath(fullIdPath string) ([]Tree, error) {
	var result []Tree
	err := db.Where("full_id_path LIKE ?", "%"+fullIdPath+"%").Find(&result).Error
	return result, err
}

func (*treeModel) FindByFullNamePath(fullNamePath string) ([]Tree, error) {
	var result []Tree
	err := db.Where("full_name_path LIKE ?", "%"+fullNamePath+"%").Find(&result).Error
	return result, err
}

func (*treeModel) FindContainsNodePathName(name string) ([]Tree, error) {
	var result []Tree
	err := db.Where("full_name_path LIKE ?", "%"+name+"%").Find(&result).Error
	return result, err
}

func (c *treeModel) FindById(id int64) ([]Tree, error) {
	tree, err := c.GetById(id)
	if err != nil {
		return nil, err
	}

	treeList, err := c.FindContainsNodePathName(tree.FullNamePath)
	if err != nil {
		return nil, err
	}
	return treeList, nil
}

func (c *treeModel) FindIdByFullNames(s1 ...string) []int64 {
	var ids []int64
	for _, s := range s1 {
		result, err := c.GetByFullNamePath(s)
		if err != nil {
			continue
		}
		ids = append(ids, result.Id)
	}
	return ids
}

func (c *treeModel) FilterValidIds(ids []int64) []int64 {
	var validIds []int64
	for _, productLineId := range ids {
		m, _ := c.GetById(productLineId)
		if m.Id == 0 {
			continue
		}
		validIds = append(validIds, m.Id)
	}
	return validIds
}

func (c *treeModel) FindResourceMappingByIds(treeIds []int64, rtype int64) ([]TreeResourceMapping, error) {
	var treeMapping []TreeResourceMapping
	err := db.Where("resource_id IN ? AND type = ?", treeIds, rtype).Find(&treeMapping).Error
	return treeMapping, err
}

func (c *treeModel) FindRelNamePathByTreeId(treeId int64) ([]Tree, error) {
	tree, err := c.GetById(treeId)
	if err != nil {
		return nil, err
	}
	return c.FindByFullNamePath(tree.FullNamePath)
}
