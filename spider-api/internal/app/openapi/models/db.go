package models

import (
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/initial"
	"gorm.io/gorm"
)

var db *gorm.DB

func InitialDB(cfg *config.DBConfig) error {
	var err error
	db, err = initial.RegisterDB(cfg.User, cfg.Host, cfg.Password, cfg.Name, cfg.Port)
	if err != nil {
		return err
	}
	return nil
}

func OrmDB() *gorm.DB {
	return db
}
