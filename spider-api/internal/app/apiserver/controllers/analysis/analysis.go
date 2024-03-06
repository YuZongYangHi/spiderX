package analysis

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
)

type MachineResponse struct {
	All      int64 `json:"all"`
	Init     int64 `json:"init"`
	Maintain int64 `json:"maintain"`
	Online   int64 `json:"online"`
}

type NetDeviceResponse struct {
	Cidr   int64 `json:"cidr"`
	Ip     int64 `json:"ip"`
	Switch int64 `json:"switch"`
	Router int64 `json:"router"`
}

type IdcResponse struct {
	Az   int64 `json:"az"`
	Idc  int64 `json:"idc"`
	Room int64 `json:"room"`
	Rack int64 `json:"rack"`
}

type TicketTrendResponse struct {
	Datetime string `json:"datetime"`
	Count    int64  `json:"count"`
}

func MachineSummary(c *base.Context) error {
	var allCount int64
	var init int64
	var maintaim int64
	var online int64
	statusList := []int64{1, 3, 2}
	err := models.OrmDB().Table(models.TableNameServer).Where("status IN ?", statusList).Count(&allCount).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	err = models.OrmDB().Table(models.TableNameServer).Where("status = ?", 1).Count(&init).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	err = models.OrmDB().Table(models.TableNameServer).Where("status = ?", 3).Count(&maintaim).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	err = models.OrmDB().Table(models.TableNameServer).Where("status = ?", 2).Count(&online).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	result := MachineResponse{
		All:      allCount,
		Init:     init,
		Maintain: maintaim,
		Online:   online,
	}
	return base.SuccessResponse(c, result)
}

func NetDeviceSummary(c *base.Context) error {
	var cidr int64
	var ip int64
	var switchCount int64
	var router int64

	err := models.OrmDB().Table(models.TableNameServerIpRange).Count(&cidr).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	err = models.OrmDB().Table(models.TableNameServerIp).Count(&ip).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	err = models.OrmDB().Table(models.TableNameNetSwitch).Count(&switchCount).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	err = models.OrmDB().Table(models.TableNameNetRouter).Count(&router).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	result := NetDeviceResponse{
		Cidr:   cidr,
		Ip:     ip,
		Switch: switchCount,
		Router: router,
	}
	return base.SuccessResponse(c, result)

}

func IdcSummary(c *base.Context) error {
	var az int64
	var idc int64
	var room int64
	var rack int64

	err := models.OrmDB().Table(models.TableNameAz).Count(&az).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	err = models.OrmDB().Table(models.TableNameIdc).Count(&idc).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	err = models.OrmDB().Table(models.TableNameIdcRoom).Count(&room).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	err = models.OrmDB().Table(models.TableNameIdcRack).Count(&rack).Error
	if err != nil {
		return base.ErrorResponse(c, 200, err.Error())
	}

	result := IdcResponse{
		Az:   az,
		Idc:  idc,
		Room: room,
		Rack: rack,
	}
	return base.SuccessResponse(c, result)
}

func TicketTrendSummary(c *base.Context) error {
	var result []TicketTrendResponse
	dayList := parsers.GetRecentDayList()

	for _, day := range dayList {
		var count int64
		start := fmt.Sprintf("%s 00:00:00", day)
		end := fmt.Sprintf("%s 23:59:59", day)
		err := models.OrmDB().Table(models.TableNameTicketWorkflowRecord).Where("create_time >= ? AND create_time <= ?", start, end).Count(&count).Error
		if err == nil {
			result = append(result, TicketTrendResponse{
				Datetime: start,
				Count:    count,
			})
		}
	}
	return base.SuccessResponse(c, result)
}
