package services

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/labstack/echo/v4"
)

type NetDevice struct {
	ctx     echo.Context
	valid   *base.Validator
	creator string
}

func NewNetDevice(c echo.Context) *NetDevice {
	cc := c.(*base.Context)
	user, _ := cc.CurrentUser()
	return &NetDevice{
		ctx:     c,
		valid:   base.NewValidator(c),
		creator: user.Username,
	}
}
