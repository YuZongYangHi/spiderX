package routers

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/openapi/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/openapi/models"
	"github.com/gin-gonic/gin"
	"strings"
)

func AuthenticationMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		baseContext := base.ContextExtender{Context: ctx, Response: &base.APIResponse{Context: ctx}}
		claims, err := baseContext.VerifyJsonWebToken()
		if err != nil {
			baseContext.Response.Unauthorized(err.Error())
			baseContext.Context.Abort()
		}
		apiKey, err := models.APIKeyModel.GetByName(claims.Audience)
		if err != nil || apiKey.Id == 0 {
			baseContext.Response.Unauthorized(base.APIKeyNotFound)
			baseContext.Context.Abort()
		}

		for _, role := range apiKey.Roles {
			for _, resource := range role.Actions {
				if (resource.Resource == baseContext.Context.FullPath()) && (strings.ToUpper(resource.Verb) == strings.ToUpper(baseContext.Context.Request.Method)) {
					ctx.Next()
					return
				}
			}
		}
		baseContext.Response.Forbidden(base.ResourceAccessDeny)
		ctx.Abort()
	}
}
