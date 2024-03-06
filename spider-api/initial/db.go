package initial

import (
	"fmt"
	"gorm.io/driver/mysql"
	_ "gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"k8s.io/klog/v2"
	"time"
)

func RegisterDB(user, host, password, name string, port int64) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	local := "Asia%2fShanghai"
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=%s",
		user,
		password,
		fmt.Sprintf("%s:%d", host, port),
		name,
		local,
	)

	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		klog.Errorf("failed to connect to mysql client: %s", err.Error())
		return nil, err
	}

	db.Logger = logger.Default.LogMode(logger.Info)
	klog.Infof("connection to mysql client successful")

	db.Callback().Create().Before("gorm:create").Register("create_time", updateColumnByCreateTime)
	db.Callback().Update().Before("gorm:update").Register("update_time", updateColumnByUpdateTime)
	return db, nil
}

func updateColumnByCreateTime(db *gorm.DB) {
	if db.Statement.Schema != nil {
		db.Statement.SetColumn("create_time", time.Now())
		db.Statement.SetColumn("update_time", time.Now())
	}
}

func updateColumnByUpdateTime(db *gorm.DB) {
	if db.Statement.Schema != nil {
		field := db.Statement.Schema.LookUpField("UpdateTime")
		if field.Name != "" {
			db.Statement.SetColumn("update_time", time.Now())
		}
	}
}
