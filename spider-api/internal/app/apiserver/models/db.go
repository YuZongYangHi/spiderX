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
	for _, err = range JoinTableByM2M() {
		if err != nil {
			return err
		}
	}
	return nil
}

func JoinTableByM2M() []error {
	var joinTables []error
	joinTables = append(joinTables, db.SetupJoinTable(&MenuRoleBinding{}, "Users", &MenuRoleBindingUser{}))
	joinTables = append(joinTables, db.SetupJoinTable(&MenuRoleBinding{}, "Groups", &MenuRoleBindingGroup{}))
	joinTables = append(joinTables, db.SetupJoinTable(&MenuRole{}, "Menus", &MenuRoleBindingMenu{}))
	joinTables = append(joinTables, db.SetupJoinTable(&Menu{}, "Roles", &MenuRoleBindingMenu{}))
	joinTables = append(joinTables, db.SetupJoinTable(&User{}, "MenuRoleBindings", &MenuRoleBindingUser{}))
	joinTables = append(joinTables, db.SetupJoinTable(&Group{}, "MenuRoleBindings", &MenuRoleBindingGroup{}))
	joinTables = append(joinTables, db.SetupJoinTable(&APIRole{}, "Actions", &APIRoleRelAction{}))
	joinTables = append(joinTables, db.SetupJoinTable(&APIRoleBinding{}, "Users", &APIRoleBindingRelUser{}))
	joinTables = append(joinTables, db.SetupJoinTable(&APIRoleBinding{}, "Groups", &APIRoleBindingRelGroup{}))
	joinTables = append(joinTables, db.SetupJoinTable(&APIKey{}, "Roles", &APIKeyRelRole{}))
	joinTables = append(joinTables, db.SetupJoinTable(&Node{}, "ProductLines", &TreeResourceMapping{}))
	joinTables = append(joinTables, db.SetupJoinTable(&Server{}, "ProductLines", &TreeResourceMapping{}))
	joinTables = append(joinTables, db.SetupJoinTable(&Server{}, "Tags", &ServerRelTag{}))
	return joinTables
}

func OrmDB() *gorm.DB {
	return db
}
