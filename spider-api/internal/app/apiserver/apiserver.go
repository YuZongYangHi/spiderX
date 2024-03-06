package apiserver

import (
	"context"
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	router2 "github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/router"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"github.com/labstack/echo-contrib/jaegertracing"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog"
	"k8s.io/klog/v2"
	"net/http"
	"os"
	"os/signal"
)

type APIServer struct {
	config *config.APIServerConfig
	ctx    *echo.Echo
	router *router2.Router
}

func (c *APIServer) Start() {
	jaeger := jaegertracing.New(c.ctx, nil)
	defer jaeger.Close()

	gracefulShutdownTimeout, err := parsers.ParseDuration(c.config.Listen.GracefulShutdownTimeout)
	if err != nil {
		c.ctx.Logger.Fatal(err)
	}

	c.router.Register(c.ctx)
	c.ctx.IPExtractor = echo.ExtractIPDirect()
	c.ctx.HTTPErrorHandler = base.HTTPErrorHandler

	go func() {
		if err = c.ctx.Start(fmt.Sprintf("%s:%d", c.config.Listen.Host, c.config.Listen.Port)); err != nil && err != http.ErrServerClosed {
			klog.Errorf("start apiserver error: %s", err.Error())
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), gracefulShutdownTimeout)
	defer cancel()
	if err = c.ctx.Shutdown(ctx); err != nil {
		c.ctx.Logger.Fatal(err)
	}
}

func NewAPIServer(cfg *config.APIServerConfig) (*APIServer, error) {
	if err := ValidServerRunParams(cfg); err != nil {
		return nil, err
	}

	e := echo.New()
	server := &APIServer{
		config: cfg,
		ctx:    e,
		router: router2.NewRouter(e),
	}

	server.ctx.Debug = cfg.Listen.Debug
	server.ctx.Logger.SetLevel(parsers.ParseLogLevel(cfg.Logger.Level))
	zerolog.SetGlobalLevel(zerolog.Level(parsers.ParseLogLevel(cfg.Logger.Level)))

	return server, nil
}
