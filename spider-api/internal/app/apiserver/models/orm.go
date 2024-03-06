package models

import (
	"encoding/json"
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"strings"
)

var Orm *OrmManager

type PreloadCondition struct {
	Rel       string
	Condition string
	Value     interface{}
}

type ModelOrmBuilder struct {
	Model      interface{}
	ResourceId interface{}
	TableName  string
	Preload    []PreloadCondition
	Order      []string
}

type ModelOrmEngine interface {
	Builder() *ModelOrmBuilder
}

type OrmManager struct{}

func (*OrmManager) Add(engine ModelOrmEngine, m interface{}, username string) error {
	b, err := json.Marshal(m)
	if err != nil {
		return err
	}
	if err = json.Unmarshal(b, engine.Builder().Model); err != nil {
		return err
	}

	err = db.Model(engine.Builder().Model).Create(engine.Builder().Model).Error
	om := OperateLog{
		Username:     username,
		Type:         1,
		ResourceName: engine.Builder().TableName,
	}
	OperateLogModel.Add(om, m, m, engine.Builder().ResourceId)
	return err
}

func (*OrmManager) Updates(engine ModelOrmEngine, payload map[string]interface{}, username string) error {
	srcModel := engine.Builder().Model

	om := OperateLog{
		Username:     username,
		Type:         2,
		ResourceName: engine.Builder().TableName,
	}
	OperateLogModel.Add(om, srcModel, payload, engine.Builder().ResourceId)
	return db.Model(engine.Builder().Model).Updates(payload).Error
}

func (c *OrmManager) DeleteById(engine ModelOrmEngine, id int64, username string) error {
	cond := map[string]interface{}{
		"id": id,
	}
	return c.Delete(engine, cond, id, username)
}

func (c *OrmManager) Delete(engine ModelOrmEngine, condition map[string]interface{}, pk interface{}, username string) error {
	sqlKey, sqlValues := c.GetOrmQueryKeyCondition(condition)
	om := OperateLog{
		Username:     username,
		Type:         3,
		ResourceName: engine.Builder().TableName,
	}
	v := map[string]interface{}{}
	OperateLogModel.Add(om, v, v, pk)
	return db.Where(sqlKey, sqlValues...).Delete(engine.Builder().Model).Error
}

func (c *OrmManager) SoftDeleteById(engine ModelOrmEngine, id int64, username string) error {
	om := OperateLog{
		Username:     username,
		Type:         3,
		ResourceName: engine.Builder().TableName,
	}
	OperateLogModel.Add(om, map[string]interface{}{}, map[string]interface{}{}, id)
	return db.Model(engine.Builder().Model).Where("id = ?", id).Update("is_deleted", 1).Error
}

func (*OrmManager) GetOrmQueryKeyCondition(m map[string]interface{}) (string, []interface{}) {
	if m == nil {
		return "", nil
	}
	var values []interface{}
	sql := ""
	for field, value := range m {
		sql += fmt.Sprintf(" %s = ? AND", field)
		values = append(values, value)
	}
	return strings.TrimRight(sql, "AND"), values
}

func (*OrmManager) GetById(model interface{}, id int64) error {
	return db.First(model, id).Error
}

func (*OrmManager) AddOderBy(tx *gorm.DB, orders []string) *gorm.DB {
	for _, order := range orders {
		tx = tx.Order(order)
	}
	return tx
}

func (c *OrmManager) Scalars(model ModelOrmEngine, result interface{}, condition map[string]interface{}) error {
	tx := db.Table(model.Builder().TableName).Where(condition)
	tx = c.AddPreload(tx, model.Builder().Preload)
	tx = c.AddOderBy(tx, model.Builder().Order)
	return tx.Find(result).Error
}

func (c *OrmManager) GetRelPreloadById(model ModelOrmEngine, id int64) error {
	tx := db.Table(model.Builder().TableName).Where("id = ?", id)
	tx = c.AddPreload(tx, model.Builder().Preload)
	return tx.First(model.Builder().Model).Error
}

func (c *OrmManager) Find(model interface{}, condition map[string]interface{}) error {
	sqlKey, sqlValues := c.GetOrmQueryKeyCondition(condition)
	return db.Where(sqlKey, sqlValues...).Find(model).Error
}

func (c *OrmManager) Get(model ModelOrmEngine, condition map[string]interface{}) error {
	sqlKey, sqlValues := c.GetOrmQueryKeyCondition(condition)
	tx := db.Where(sqlKey, sqlValues...)
	tx = c.AddPreload(tx, model.Builder().Preload)
	tx = c.AddOderBy(tx, model.Builder().Order)
	return tx.First(model.Builder().Model).Error
}

func (*OrmManager) ListByIds(tableName string, ids []int64, result interface{}) error {
	return db.Table(tableName).Where("id IN ?", ids).Find(result).Error
}

func (*OrmManager) FindAll(model interface{}) error {
	return db.Preload(clause.Associations).Find(model).Error
}

func (c *OrmManager) InByIds(tableName string, ids []int64, condition map[string]interface{}, result interface{}) error {
	tx := db.Table(tableName).Where("id IN ?", ids)
	if condition != nil {
		sqlKey, sqlValues := c.GetOrmQueryKeyCondition(condition)
		tx = tx.Where(sqlKey, sqlValues...)
	}
	return tx.Find(result).Error
}

func (c *OrmManager) AddPreload(tx *gorm.DB, preload []PreloadCondition) *gorm.DB {
	for _, p := range preload {
		if p.Rel != "" && p.Condition != "" && p.Value != nil {
			tx = tx.Preload(p.Rel, p.Condition, p.Value)
		} else {
			tx = tx.Preload(p.Rel)
		}
	}
	return tx
}

func (c *OrmManager) IsValidIdsByStr(model ModelOrmEngine, ids string) bool {
	if len(ids) == 0 {
		return true
	}

	idl, err := c.ParseIdsByStr(ids)
	if err != nil {
		return false
	}
	for _, id := range idl {
		if err = db.Where("id = ?", id).First(&model.Builder().Model).Error; err != nil {
			return false
		}
	}
	return true
}

func (c *OrmManager) ParseIdsByStr(ids string) ([]int64, error) {
	idList := strings.Split(ids, ",")
	int64s, err := parsers.ParseInt64ByStr(idList)
	return int64s, err
}

func (c *OrmManager) FilterIdsByStr(ids string, result interface{}) (interface{}, error) {
	idList := strings.Split(ids, ",")
	int64s, err := parsers.ParseInt64ByStr(idList)
	if err != nil {
		return err, nil
	}
	var list []interface{}
	for _, id := range int64s {
		err = db.Where("id = ?", id).First(result).Error
		if err == nil {
			list = append(list, result)
		}
	}
	return list, nil
}

func init() {
	Orm = &OrmManager{}
}
