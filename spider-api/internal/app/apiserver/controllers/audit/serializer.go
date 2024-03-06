package audit

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OperateLogSerializer struct {
	model  *[]models.OperateLog
	filter map[string]interface{}
}

func (c *OperateLogSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *OperateLogSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *OperateLogSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *OperateLogSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *OperateLogSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *OperateLogSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameOperateLog,
		FilterCondition:     c.filter,
		FilterConditionType: base.AuditOperateFilterCondition,
		Model:               c.model,
	}
}

func NewOperateLogSerializer() *OperateLogSerializer {
	return &OperateLogSerializer{
		model:  &[]models.OperateLog{},
		filter: map[string]interface{}{},
	}
}

type UserLoginSerializer struct {
	model  *[]models.AuditLogin
	filter map[string]interface{}
}

func (c *UserLoginSerializer) Preload() []string {
	return []string{clause.Associations}
}

func (c *UserLoginSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *UserLoginSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *UserLoginSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *UserLoginSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	return data
}

func (c *UserLoginSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameAuditLogin,
		FilterCondition:     c.filter,
		FilterConditionType: base.AuditUserLoginFilterCondition,
		Model:               c.model,
	}
}

func NewUserLoginSerializer() *UserLoginSerializer {
	return &UserLoginSerializer{
		model:  &[]models.AuditLogin{},
		filter: map[string]interface{}{},
	}
}
