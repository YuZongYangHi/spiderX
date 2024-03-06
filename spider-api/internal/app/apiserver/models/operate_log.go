package models

import (
	"encoding/json"
	"k8s.io/klog/v2"
	"strconv"
	"strings"
	"time"
)

type OperateLog struct {
	Id           int64     `json:"id"`
	Username     string    `gorm:"column:username" json:"username"`
	Type         int64     `json:"type"`
	ResourceName string    `gorm:"column:resource_name" json:"resourceName"`
	ResourcePk   string    `gorm:"column:resource_pk" json:"resourcePk"`
	SrcData      string    `gorm:"column:src_data" json:"srcData"`
	TargetData   string    `gorm:"column:target_data" json:"targetData"`
	DiffData     string    `gorm:"column:diff_data" json:"diffData"`
	Datetime     time.Time `json:"datetime"`
	CreateTime   time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime   time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

type operateLogModel struct{}

func (*OperateLog) TableName() string {
	return TableNameOperateLog
}

func (*operateLogModel) MapKeyStandardFormatting(src map[string]interface{}) map[string]interface{} {
	dest := map[string]interface{}{}
	for k, v := range src {
		dest[strings.ToLower(k)] = v
	}
	return dest
}

func (c *operateLogModel) Add(md OperateLog, src, dest interface{}, resourcePK interface{}) {
	srcData, _ := json.Marshal(src)
	destData, _ := json.Marshal(dest)

	diffInterface := map[string]interface{}{}
	srcInterface := map[string]interface{}{}
	destInterface := map[string]interface{}{}

	srcErr := json.Unmarshal(srcData, &srcInterface)
	destErr := json.Unmarshal(destData, &destInterface)

	srcInterface1 := c.MapKeyStandardFormatting(srcInterface)
	destInterface2 := c.MapKeyStandardFormatting(destInterface)

	if srcErr == nil && destErr == nil {
		if len(destInterface) > 0 {
			for destFiled, destValue := range destInterface2 {
				if srcValue, ok := srcInterface1[destFiled]; ok {
					switch srcValue.(type) {
					case map[string]interface{}:
					case interface{}:
						if srcValue != destValue {
							diffInterface[destFiled] = destValue
						}
					}
				}
			}
		}
	}

	diffData, _ := json.Marshal(diffInterface)

	var rid string
	switch resourcePK.(type) {
	case int64:
		it := resourcePK.(int64)
		rid = strconv.FormatInt(it, 10)
	case string:
		rid = resourcePK.(string)
	}

	m := &OperateLog{
		Username:     md.Username,
		Type:         md.Type,
		SrcData:      string(srcData),
		TargetData:   string(destData),
		DiffData:     string(diffData),
		ResourcePk:   rid,
		Datetime:     time.Now(),
		ResourceName: md.ResourceName,
		CreateTime:   time.Now(),
		UpdateTime:   time.Now(),
	}
	err := db.Create(m).Error
	if err != nil {
		klog.Errorf("add operate log fail: %s", err.Error())
	}
}
