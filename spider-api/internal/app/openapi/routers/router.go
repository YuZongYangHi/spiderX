package routers

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/openapi/controllers/base"
	"github.com/gin-gonic/gin"
)

func Role(c *base.ContextExtender) {
	c.Response.JsonResponse(200, "success", "OK")
}

func NewRouter() *gin.Engine {
	router := gin.Default()

	v1 := router.Group("/openapi/v1")
	v1.Use()
	v1.Use(AuthenticationMiddleware())
	{
		v1.GET("/rbac/role/:abc", base.HandleFunc(Role))
	}

	return router
}
