package base

import (
	"errors"
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"k8s.io/klog/v2"
	"strings"
)

const (
	LikeExpressionEnum     = "LIKE"
	EqualExpressionEnum    = "EQUAL"
	ContainsExpressionEnum = "IN"
)

var ExpressionValueMapping = map[string]func(field string, value string) (string, interface{}){
	LikeExpressionEnum:     LikeValueFunc,
	EqualExpressionEnum:    EqualValueFunc,
	ContainsExpressionEnum: ContainsValueFunc,
}

type SerializersField struct {
	Field  string
	Type   string
	Column string
}

type SerializersParams struct {
	TableName           string
	FilterCondition     map[string]interface{}
	FilterConditionType []SerializersField
	Model               interface{}
}

type Serializers interface {
	GetParams() SerializersParams
	Preload() []string
	Order() []string
	Response(data ResponseContent, query map[string]interface{}) ResponseContent
	ExtraFilter(query map[string]interface{}) map[string]interface{}
	QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error)
}

type SerializersManager struct {
	ctx        echo.Context
	serializer Serializers
}

func QuerySetAfterAddPreload(tx *gorm.DB, preload ...string) *gorm.DB {
	for _, p := range preload {
		tx = tx.Preload(p)
	}
	return tx
}

func QuerySetAfterAddOrder(tx *gorm.DB, order ...string) *gorm.DB {
	for _, o := range order {
		tx = tx.Order(o)
	}
	return tx
}

func BuildCommonResponseParams(tx *gorm.DB, pageSize, pageNum int, model interface{}, preload, order []string) ResponseContent {
	var total int64
	tx.Count(&total)

	if pageNum > 0 && pageSize > 0 {
		tx = tx.Limit(pageSize).Offset(pageSize * (pageNum - 1))
	}

	tx = QuerySetAfterAddPreload(tx, preload...)
	tx = QuerySetAfterAddOrder(tx, order...)
	if err := tx.Find(model).Error; err != nil {
		klog.Errorf("base serializer find model error: %s", err.Error())
	}
	return ResponseContent{
		List:     model,
		Current:  pageNum,
		PageSize: pageSize,
		Total:    total,
	}
}

func LikeValueFunc(field, value string) (string, interface{}) {
	sql := "%s %s ?"
	value = "%" + value + "%"
	sql = fmt.Sprintf(sql, field, "like")
	return sql, value
}

func EqualValueFunc(field, value string) (string, interface{}) {
	sql := "%s %s ?"
	sql = fmt.Sprintf(sql, field, "=")
	return sql, value
}

func ContainsValueFunc(field, value string) (string, interface{}) {
	v := strings.Split(value, ",")
	sql := "%s %s ?"
	sql = fmt.Sprintf(sql, field, "IN")
	return sql, v
}

func GetQueryIsDeleted(query map[string]interface{}) bool {
	if _, ok := query["isDeleted"]; !ok {
		return false
	}
	return true
}

func (c *SerializersManager) getFieldFilterType(field string, queryFields []SerializersField) (*SerializersField, error) {
	for _, m := range queryFields {
		if m.Field == field {
			return &m, nil
		}
	}
	return nil, errors.New("not found")
}

func (c *SerializersManager) QuerySet() (CommonResponse, error) {
	params, err := BuildCommonRequestParams(c.ctx)
	if err != nil {
		return CommonResponse{}, err
	}
	qs := c.BuilderQuery()
	commonFilter := BuildCommonRequestFilterParams(params.Filter)

	if len(c.serializer.GetParams().FilterCondition) > 0 {
		qs = qs.Where(c.serializer.GetParams().FilterCondition)
	}
	if queryFields := c.serializer.GetParams().FilterConditionType; len(queryFields) > 0 {
		for field, value := range commonFilter {
			fieldSet, _ := c.getFieldFilterType(field, queryFields)
			if fieldSet != nil {
				expression := strings.ToUpper(fieldSet.Type)
				column := fieldSet.Column
				if column == "" {
					column = fieldSet.Field
				}
				sql, v := ExpressionValueMapping[expression](column, value.(string))
				qs = qs.Where(sql, v)
			}
		}
	}

	extraFilter := c.serializer.ExtraFilter(commonFilter)
	if len(extraFilter) > 0 {
		for f, v := range extraFilter {
			cond, val := EqualValueFunc(f, v.(string))
			qs = qs.Where(cond, val)
		}
	}

	tx, err := c.serializer.QueryBeforeHook(c.ctx, qs, commonFilter)
	if err != nil {
		return CommonResponse{
			Success:      true,
			Data:         c.serializer.Response(ResponseContent{}, commonFilter),
			ErrorMessage: "",
		}, nil
	}
	data := BuildCommonResponseParams(
		tx,
		params.PageSize,
		params.PageNum,
		c.serializer.GetParams().Model,
		c.serializer.Preload(),
		c.serializer.Order(),
	)
	return CommonResponse{
		Success:      true,
		Data:         c.serializer.Response(data, commonFilter),
		ErrorMessage: "",
	}, nil
}

func (c *SerializersManager) BuilderQuery() *gorm.DB {
	return models.OrmDB().Table(c.serializer.GetParams().TableName).Session(&gorm.Session{})
}

func NewSerializersManager(ctx echo.Context, serializer Serializers) *SerializersManager {
	return &SerializersManager{
		ctx:        ctx,
		serializer: serializer,
	}
}
