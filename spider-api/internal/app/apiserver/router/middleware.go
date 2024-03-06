package router

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/rs/zerolog/log"
	"io"
	"strings"
)

func checkRequestURIIsWhitelist(requestURI, method string) bool {
	result, err := models.RequestWhitelistModel.GetByURI(strings.Split(requestURI, "?")[0])
	if result.Id > 0 && err == nil && strings.ToUpper(result.Method) == strings.ToUpper(method) {
		return true
	}
	return false
}

func ContextExtenderMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := &base.Context{Context: c}
		return next(cc)
	}
}

func RequestLoggerMiddleware() middleware.RequestLoggerConfig {
	return middleware.RequestLoggerConfig{
		LogURI:      true,
		LogStatus:   true,
		LogMethod:   true,
		LogRemoteIP: true,
		LogError:    true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			b, _ := io.ReadAll(c.Request().Body)
			err := ""
			if v.Error != nil {
				err = v.Error.Error()
			}
			log.Info().
				Str("uri", v.URI).
				Int("status", v.Status).
				Str("method", v.Method).
				Str("remoteAddr", v.RemoteIP).
				Str("query", c.QueryString()).
				Str("body", string(b)).
				Str("error", err).
				Msg("request")
			return nil
		},
	}
}

func BlacklistMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		clientIp := echo.ExtractIPDirect()(c.Request())
		ipBlacklist, err := models.RequestBlacklistModel.GetIpByCollection(clientIp)
		if err != nil || ipBlacklist.Id == 0 {
			return next(c)
		}
		return base.ForbiddenResponse(c)
	}
}

func AuthenticationMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if checkRequestURIIsWhitelist(c.Request().RequestURI, c.Request().Method) {
			return next(c)
		}
		cc := c.(*base.Context)
		_, err := cc.CurrentUser()
		if err != nil {
			return base.UnauthorizedResponse(c)
		}
		return next(c)
	}
}

func PermissionsMiddleWare(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if checkRequestURIIsWhitelist(c.Request().RequestURI, c.Request().Method) {
			return next(c)
		}

		action, err := models.RBACAPIActionModel.FetchSingleResourceActionData(c.Path(), strings.ToUpper(c.Request().Method))
		if err != nil || action.Id == 0 {
			return next(c)
		}

		cc := c.(*base.Context)
		user, err := cc.CurrentUser()
		if err != nil {
			return base.UnauthorizedResponse(c)
		}

		if user.IsAdmin {
			return next(c)
		}

		if ok := models.RBACAPIRoleBindingModel.HasPermissions(user, action.Id); !ok {
			return base.ForbiddenResponse(c)
		}

		return next(c)
	}
}
