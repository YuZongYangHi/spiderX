package base

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/cache"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"io"
	"strconv"
)

type Context struct {
	echo.Context
}

func (c *Context) GetCurrentUserId() (string, error) {
	userLoginCacheKey, err := c.GetUserLoginKey()
	if err != nil {
		return "", err
	}

	value, err := cache.Get(userLoginCacheKey)
	if err != nil {
		return "", err
	}
	return string(value), nil
}

func (c *Context) GetUserLoginKey() (string, error) {
	userLoginSession, err := c.Cookie("spider_user_login_session")
	if err != nil {
		return "", err
	}
	return cache.GenerateUserLoginKey(userLoginSession.Value), nil
}

func (c *Context) CurrentUser() (*models.User, error) {
	userId, err := c.GetCurrentUserId()
	if err != nil {
		return nil, err
	}
	return models.UserModel.GetByUserId(userId)
}

func (c *Context) ParseInt(key string) int64 {
	s := c.Param(key)
	if s == "" {
		return 0
	}

	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return 0
	}
	return i
}

func (c *Context) GetParamInt(key string) (int64, error) {
	v := c.ParseInt(key)
	if v == 0 {
		return 0, errors.New("invalid id")
	}
	return v, nil
}

func (c *Context) GetUserMap() map[string]interface{} {
	user, _ := c.CurrentUser()
	m := map[string]interface{}{"creator": user.Username}
	return m
}

func (c *Context) GetRequestBody() (map[string]interface{}, error) {
	body, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return nil, err
	}

	c.Request().Body = io.NopCloser(bytes.NewBuffer(body))

	var data map[string]interface{}
	if err = json.Unmarshal(body, &data); err != nil {
		return nil, err
	}
	return data, nil
}

func (c *Context) BindValidBody(payload interface{}) error {
	valid := NewValidator(c.Context)
	return valid.IsValid(payload)
}

func (c *Context) CurrentUsername() string {
	user, _ := c.CurrentUser()
	return user.Username
}

func (c *Context) GetRequestDomain() string {
	req := c.Request()
	scheme := req.URL.Scheme
	if scheme == "" {
		if req.TLS == nil {
			scheme = "http"
		} else {
			scheme = "https"
		}
	}
	host := req.Host
	return fmt.Sprintf("%s://%s", host, scheme)
}

func HandleFunc(handler func(ctx *Context) error) func(ctx echo.Context) error {
	return func(ctx echo.Context) error {
		cc := Context{ctx}
		return handler(&cc)
	}
}
