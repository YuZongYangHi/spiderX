package models

import (
	"errors"
	"k8s.io/klog/v2"
)

var (
	OperateConvertDB = map[string]int64{
		"移动": 1,
		"联通": 2,
		"电信": 3,
		"多线": 4,
	}
	StatusConvertDB = map[string]int64{
		"初始化":  1,
		"已上线":  2,
		"维护中":  3,
		"冷备":   4,
		"规划中":  5,
		"裁撤":   6,
		"建设中":  7,
		"裁撤新建": 8,
	}
	AttributeConvertDB = map[string]int64{
		"容器节点":  1,
		"虚拟机节点": 2,
		"物理机节点": 3,
		"混合节点":  4,
	}
	GradeConvertDB = map[string]int64{
		"标准": 1,
		"骨干": 2,
		"核心": 3,
	}
	ContractConvertDB = map[string]int64{
		"直签": 1,
		"代理": 2,
	}

	AssetsServerDeviceConvertDB = map[string]int64{
		"物理机": 1,
		"云主机": 3,
		"虚拟机": 2,
	}
	AssetsServerRoleConvertDB = map[string]int64{
		"lvs":    1,
		"master": 2,
		"node":   3,
		"other":  4,
	}
)

func GetNodeChoicesFieldByExcelRow(row []string) (map[string]int64, error) {
	operate, _ := OperateConvertDB[row[2]]
	status, _ := StatusConvertDB[row[3]]
	attribute, _ := AttributeConvertDB[row[4]]
	grade, _ := GradeConvertDB[row[5]]
	contract, _ := ContractConvertDB[row[8]]
	if operate == 0 || status == 0 || attribute == 0 || grade == 0 || contract == 0 {
		klog.Errorf("operate: %d, status: %d, attribute: %d, grade: %d, contract: %d", operate, status, attribute, grade, contract)
		return nil, errors.New("parser error")
	}
	result := map[string]int64{
		"operate":   operate,
		"status":    status,
		"attribute": attribute,
		"grade":     grade,
		"contract":  contract,
	}
	return result, nil
}

func GetServerChoicesFieldByExcelRow(row []string) (map[string]int64, error) {
	device, _ := AssetsServerDeviceConvertDB[row[2]]
	status, _ := StatusConvertDB[row[3]]
	role, _ := AssetsServerRoleConvertDB[row[9]]
	operator, _ := OperateConvertDB[row[10]]
	if device == 0 || status == 0 || role == 0 || operator == 0 {
		return nil, errors.New("server choices parser error")
	}
	result := map[string]int64{
		"device":   device,
		"status":   status,
		"role":     role,
		"operator": operator,
	}
	return result, nil
}
