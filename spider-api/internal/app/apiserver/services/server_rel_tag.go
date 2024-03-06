package services

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"k8s.io/klog/v2"
)

type ServerRelTag struct{}

func (c *ServerRelTag) Set(serverId int64, tags []string) error {
	if err := c.Clear(serverId); err != nil {
		return err
	}
	for _, name := range tags {
		tag, err := c.GetOrAdd(name)
		if err != nil {
			return err
		}
		m := models.ServerRelTag{
			ServerId: serverId,
			TagId:    tag.Id,
		}
		if err = models.OrmDB().Create(&m).Error; err != nil {
			klog.Errorf("server add rel tag fail: %s", err.Error())
			return err
		}
	}
	return nil
}

func (c *ServerRelTag) Clear(serverId int64) error {
	var result models.ServerRelTag
	return models.OrmDB().Where("server_id = ?", serverId).Delete(&result).Error
}

func (c *ServerRelTag) GetOrAdd(name string) (models.ServerTag, error) {
	var result models.ServerTag
	err := models.OrmDB().Where("name = ?", name).First(&result).Error
	if err != nil || result.Id == 0 {
		m := models.ServerTag{
			Name:    name,
			Creator: "system",
		}
		err = models.OrmDB().Create(&m).Error
		return m, err
	}
	return result, nil
}

func NewServerRelTag() *ServerRelTag {
	return &ServerRelTag{}
}
