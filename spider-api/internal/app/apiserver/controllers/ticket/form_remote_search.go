package ticket

import "github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"

func FormRemoteSearchUserList(c *base.Context) error {
	values := map[string]string{}
	values["key"] = "key"
	values["value"] = "value"
	l := []map[string]string{}
	l = append(l, values)
	return base.SuccessResponse(c, l)
}
