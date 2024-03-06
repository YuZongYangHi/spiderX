package base

import "github.com/gin-gonic/gin"

type APIResponse struct {
	*gin.Context
}

func (c *APIResponse) Success() {
	c.JSON(200, "Success")
}

func (c *APIResponse) Unauthorized(msg string) {
	c.JsonResponse(401, msg, nil)
}

func (c *APIResponse) Forbidden(msg string) {
	c.JsonResponse(403, msg, nil)
}

func (c *APIResponse) JsonResponse(code int, msg string, data interface{}) {
	if msg == "" {
		msg = GetCodeRelMsg[code]
	}
	resp := make(map[string]interface{})
	resp["code"] = code
	resp["message"] = msg
	resp["data"] = data
	c.JSON(code, resp)
	c.Abort()
}
