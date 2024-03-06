package models

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
)

type apiKeyModel struct{}

func (*apiKeyModel) GetByName(name string) (models.APIKey, error) {
	var apikey models.APIKey
	err := db.Where("name = ?", name).Preload("Roles.Actions").First(&apikey).Error
	return apikey, err
}
