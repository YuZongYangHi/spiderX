package openapi

import (
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/openapi/routers"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util"
	"github.com/fvbock/endless"
	"github.com/gin-gonic/gin"
)

type Server struct {
	Cfg *config.OpenAPIConfig
}

func (c *Server) Start() {
	gin.SetMode(util.OpenAPILoggerMapping(c.Cfg.Logger.Info))
	endless.ListenAndServe(util.GenerateCriteriaHTTPServer(c.Cfg.HTTP.Addr, c.Cfg.HTTP.Port), routers.NewRouter())
}

func NewServer(cfg *config.OpenAPIConfig) *Server {
	return &Server{cfg}
}
