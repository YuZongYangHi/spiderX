package apiserver

import (
	"errors"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"net"
)

func ValidServerRunParams(conf *config.APIServerConfig) error {
	if conf.Listen.Host == "" || conf.Listen.Port == 0 {
		return errors.New("http start config is empty")
	}

	if ipv4 := net.ParseIP(conf.Listen.Host); ipv4 == nil {
		return errors.New("invalid ipv4 ip")
	}
	return nil
}
