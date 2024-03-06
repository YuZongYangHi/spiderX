package base

import (
	"encoding/json"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"reflect"
	"strings"
)

type ValidatorHandFunc func(m interface{}) bool

type Validator struct {
	ctx echo.Context
}

func (c *Validator) IsValid(payload interface{}) error {
	err := c.ctx.Bind(payload)
	if err != nil {
		return err
	}
	validate := validator.New()
	return validate.Struct(payload)
}

func (c *Validator) ParseMapByStruct(s interface{}) map[string]interface{} {
	result := map[string]interface{}{}
	typeOf := reflect.TypeOf(s)
	valueOf := reflect.ValueOf(s)

	if typeOf.Kind() == reflect.Ptr {
		typeOf = typeOf.Elem()
	}

	if valueOf.Kind() == reflect.Ptr {
		valueOf = valueOf.Elem()
	}

	for i := 0; i < typeOf.NumField(); i++ {
		if extra := valueOf.Type().Field(i).Tag.Get("extra"); extra != "" {
			fieldIsCommon := false
			payloadSp := strings.Split(extra, ",")
			for _, sp := range payloadSp {
				kv := strings.Split(sp, "=")
				if kv[0] == "read_only" && kv[1] == "true" {
					fieldIsCommon = true
					break
				}
			}
			if fieldIsCommon {
				continue
			}
		}
		field := valueOf.Type().Field(i).Name
		value := valueOf.FieldByName(field).Interface()
		result[field] = value
	}
	return result
}

func (c *Validator) ParseStructByMap(in map[string]interface{}, out interface{}) error {
	b, err := json.Marshal(in)
	if err != nil {
		return err
	}
	return json.Unmarshal(b, out)
}

func NewValidator(c echo.Context) *Validator {
	return &Validator{ctx: c}
}
