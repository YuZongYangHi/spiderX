package duty_roster

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type DrawLotsSerializer struct {
	model  *[]models.DutyLottery
	filter map[string]interface{}
}

func (c *DrawLotsSerializer) Preload() []string {
	return []string{}
}

func (c *DrawLotsSerializer) Order() []string {
	return []string{"update_time desc"}
}

func (c *DrawLotsSerializer) ExtraFilter(query map[string]interface{}) map[string]interface{} {
	return nil
}

func (c *DrawLotsSerializer) QueryBeforeHook(ctx echo.Context, tx *gorm.DB, query map[string]interface{}) (*gorm.DB, error) {
	return tx, nil
}

func (c *DrawLotsSerializer) Response(data base.ResponseContent, query map[string]interface{}) base.ResponseContent {
	var result []models.UpSetResponse
	for _, d := range *c.model {
		m := models.UpSetResponse{
			Id:            d.Id,
			DutyType:      d.DutyType,
			Users:         d.UserIdsFormat(),
			UserIds:       d.UserIds,
			EffectiveTime: d.EffectiveTime.Format(parsers.YearMonthDayHourMinuteSecond),
			CreateTime:    d.CreateTime.Format(parsers.YearMonthDayHourMinuteSecond),
			UpdateTime:    d.UpdateTime.Format(parsers.YearMonthDayHourMinuteSecond),
		}
		result = append(result, m)
	}
	data.List = result
	return data
}

func (c *DrawLotsSerializer) GetParams() base.SerializersParams {
	return base.SerializersParams{
		TableName:           models.TableNameDutyLottery,
		FilterCondition:     c.filter,
		FilterConditionType: nil,
		Model:               c.model,
	}
}

func NewDrawLotsSerializer() *DrawLotsSerializer {
	return &DrawLotsSerializer{
		model:  &[]models.DutyLottery{},
		filter: map[string]interface{}{},
	}
}
