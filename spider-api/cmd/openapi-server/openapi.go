package main

import (
	"flag"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/openapi"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/openapi/models"
	"k8s.io/klog/v2"
	"os"
)

func main() {
	klog.SetOutput(os.Stderr)
	klog.InitFlags(nil)

	configFile := flag.String("config", "openapi.yaml", "config file path")
	flag.Parse()

	cfg, err := config.NewOpenAPIServerConfig(*configFile)
	if err != nil {
		klog.Errorf("failed to parse config, error: %s", err.Error())
	}

	if err = models.InitialDB(&cfg.Database); err != nil {
		klog.Errorf("failed to connect mysql. error: %s", err.Error())
	}

	server := openapi.NewServer(cfg)
	server.Start()
}
