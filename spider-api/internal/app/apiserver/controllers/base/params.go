package base

import (
	"github.com/labstack/echo/v4"
	"strings"
)

type CommonRequestParams struct {
	PageSize int    `json:"pageSize" query:"pageSize"`
	PageNum  int    `json:"current"  query:"pageNum"`
	Filter   string `json:"filter"   query:"filter"`
}

func BuildCommonRequestParams(c echo.Context) (*CommonRequestParams, error) {
	var payload CommonRequestParams
	err := c.Bind(&payload)
	return &payload, err
}

func BuildCommonRequestFilterParams(filter string) map[string]interface{} {
	qs := map[string]interface{}{}
	if len(filter) == 0 {
		return qs
	}

	filters := strings.Split(filter, "&")
	for _, param := range filters {
		kv := strings.Split(param, "=")
		if len(kv) != 2 {
			continue
		}

		key, value := kv[0], kv[1]
		qs[key] = value
	}
	return qs
}
