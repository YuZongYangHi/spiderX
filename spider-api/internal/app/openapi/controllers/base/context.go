package base

import (
	"errors"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/jwt"
	"github.com/gin-gonic/gin"
)

func HandleFunc(handler func(extender *ContextExtender)) func(*gin.Context) {
	return func(c *gin.Context) {
		customContext := ContextExtender{
			Response: &APIResponse{Context: c},
			Context:  c,
		}
		handler(&customContext)
	}
}

type ContextExtender struct {
	Context  *gin.Context
	Response *APIResponse
}

func (c *ContextExtender) VerifyJsonWebToken() (*jwt.Claims, error) {
	token := c.Context.GetHeader("Authorization")
	if token == "" {
		return nil, errors.New("token not found")
	}
	return jwt.Authentication(token, config.OpenAPIServerConfig().Auth.JwtSalt)
}
