package duty_roster

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"time"
)

func ListOnCall(c *base.Context) error {
	s := services.NewDutyRoster(c)
	return s.ListOnCall()
}

func ListDrawLots(c *base.Context) error {
	serializer := base.NewSerializersManager(c, NewDrawLotsSerializer())
	querySet, _ := serializer.QuerySet()
	return base.Response(c, 200, querySet)
}

func CreateDrawLots(c *base.Context) error {
	valid := func(m interface{}) bool {
		p := m.(*forms.CreateDrawLots)
		record, _ := models.OnCallModel.GetDrawLotsByTime(p.EffectiveTime)
		if record.Id > 0 {
			return false
		}
		return true
	}

	formatFunc := func(m map[string]interface{}) map[string]interface{} {
		effectiveTimeStr := m["EffectiveTime"].(string)
		effectiveTime, _ := time.ParseInLocation(parsers.YearMonthDayHourMinuteSecond, effectiveTimeStr, parsers.DefaultTimeLoc)
		m["EffectiveTime"] = effectiveTime.Format(time.RFC3339)
		userIdsStr := m["UserIds"].(string)
		shuffled := util.ConvertAndShuffle(userIdsStr)
		fmt.Println(userIdsStr, shuffled, "@@@@@@@")
		m["UserIds"] = shuffled
		return m
	}

	generic := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine:            &models.DutyLottery{},
		Payload:                &forms.CreateDrawLots{},
		ValidatorHandFuncHooks: []base.ValidatorHandFunc{valid},
		FormatBodyFunc:         formatFunc,
	}
	return generic.Create(params)
}

func DestroyDrawLots(c *base.Context) error {
	generic := services.NewGeneric(c)
	return generic.Delete(&models.DutyLottery{})
}

func UpdateDrawLots(c *base.Context) error {

	formatFunc := func(m map[string]interface{}) map[string]interface{} {
		effectiveTimeStr := m["EffectiveTime"].(string)
		userIdsStr := m["UserIds"].(string)
		record, _ := models.OnCallModel.GetDrawLotsByTime(effectiveTimeStr)
		if record.UserIds != userIdsStr {
			shuffled := util.ConvertAndShuffle(userIdsStr)
			m["UserIds"] = shuffled
		}
		return m
	}

	generic := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine:    &models.DutyLottery{},
		Payload:        &forms.UpdateDrawLots{},
		FormatBodyFunc: formatFunc,
	}
	return generic.Update(params)
}

func Exchange(c *base.Context) error {
	var payload forms.OnCallExchange
	var record models.DutyExchange
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}
	err := models.OrmDB().
		Where("datetime = ?", payload.Datetime+" 00:00:00").
		First(&record).
		Error
	if err != nil || record.Id == 0 {
		datetime, _ := time.ParseInLocation(parsers.YearMonthDayFormat, payload.Datetime, parsers.DefaultTimeLoc)
		record = models.DutyExchange{
			CurrentUser: payload.CurrentUser,
			HistoryUser: payload.HistoryUser,
			Datetime:    datetime,
		}
		err = models.OrmDB().Create(&record).Error
	} else {
		record.CurrentUser = payload.CurrentUser
		record.HistoryUser = payload.HistoryUser
		err = models.OrmDB().Save(&record).Error
	}
	if err != nil {
		return base.ErrorResponse(c, 500, err.Error())
	}
	return base.SuccessResponse(c, record)
}
