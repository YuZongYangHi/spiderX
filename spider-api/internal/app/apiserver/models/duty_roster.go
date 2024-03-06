package models

import (
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"strings"
	"time"
)

const (
	LtCurrentMonthNum = -1
	EqCurrentMonthNum = 0
	GtCurrentMonthNum = 1
	WeekTransition    = "weekly"
	DayTransition     = "daily"
)

type UpSetResponse struct {
	Id            int64    `json:"id"`
	Users         []string `json:"users"`
	UserIds       string   `json:"userIds"`
	DutyType      string   `json:"dutyType"`
	EffectiveTime string   `json:"effectiveTime"`
	CreateTime    string   `json:"createTime"`
	UpdateTime    string   `json:"updateTime"`
}

type onCallModel struct{}

type DutyLottery struct {
	Id            int64     `json:"id"`
	UserIds       string    `gorm:"column:user_ids" json:"userIds"`
	DutyType      string    `gorm:"column:duty_type" json:"dutyType"`
	EffectiveTime time.Time `gorm:"column:effective_time" json:"effectiveTime"`
	Description   string    `json:"description"`
	CreateTime    time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime    time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (c *DutyLottery) UserIdsFormat() []string {
	var users []string
	ids, err := parsers.ParseInt64ByStr(strings.Split(c.UserIds, ","))
	if err != nil {
		return users
	}

	for _, id := range ids {
		user, err := UserModel.GetById(id)
		if err == nil {
			users = append(users, user.Username)
		}
	}
	return users
}

func (*DutyLottery) TableName() string {
	return TableNameDutyLottery
}

func (c *DutyLottery) Builder() *ModelOrmBuilder {
	return &ModelOrmBuilder{
		Model:      c,
		ResourceId: c.Id,
		TableName:  c.TableName(),
	}
}

type DutyExchange struct {
	Id          int64     `json:"id"`
	CurrentUser string    `gorm:"current_user" json:"currentUser"`
	HistoryUser string    `gorm:"history_user" json:"historyUser"`
	Datetime    time.Time `json:"datetime"`
	CreateTime  time.Time `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime  time.Time `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*DutyExchange) TableName() string {
	return TableNameDutyExchange
}

type DutyRoster struct {
	Id            int64       `json:"id"`
	CurrentUser   string      `gorm:"current_user" json:"currentUser"`
	HistoryUser   string      `gorm:"history_user" json:"historyUser"`
	Datetime      time.Time   `json:"datetime"`
	DutyLotteryId int64       `gorm:"column:duty_lottery_id" json:"dutyLotteryId"`
	DutyLottery   DutyLottery `gorm:"foreignKey:duty_lottery_id" json:"dutyLottery"`
	CreateTime    time.Time   `gorm:"column:create_time;type:datetime(0)" json:"createTime"`
	UpdateTime    time.Time   `gorm:"column:update_time;type:datetime(0)" json:"updateTime"`
}

func (*DutyRoster) TableName() string {
	return TableNameDutyRoster
}

func (*onCallModel) FindByLikeDatetime(datetime string) ([]DutyRoster, error) {
	var result []DutyRoster
	err := db.Where("datetime like ?", datetime+"%").
		Order("datetime").
		Find(&result).
		Error
	return result, err
}

func (*onCallModel) FindExchangeByLikeDatetime(datetime string) ([]DutyExchange, error) {
	var result []DutyExchange
	err := db.Where("datetime like ?", datetime+"%").
		Order("datetime").
		Find(&result).
		Error
	return result, err
}

func (*onCallModel) GetExchangeByLikeDatetime(datetime string) (DutyExchange, error) {
	var result DutyExchange
	err := db.Where("datetime like ?", datetime+"%").
		Order("datetime").
		First(&result).
		Error
	return result, err
}

func (*onCallModel) GetOnCallByLikeDatetime(datetime string) (DutyRoster, error) {
	var result DutyRoster
	err := db.Where("datetime like ?", datetime+"%").
		Preload("DutyLottery").
		Order("datetime desc").
		First(&result).
		Error
	return result, err
}

func (*onCallModel) GetOnCallByDatetime(datetime string) (DutyRoster, error) {
	var result DutyRoster
	err := db.Where("datetime = ?", datetime+"%").
		Preload("DutyLottery").
		Order("datetime desc").
		First(&result).
		Error
	return result, err
}

func (*onCallModel) GetExchange(day string) (DutyExchange, error) {
	day += " 00:00:00"
	var result DutyExchange
	err := db.Where("datetime like ?", day+"%").
		Order("datetime desc").
		First(&result).
		Error
	return result, err
}

func (*onCallModel) FindHistoryOnCallByDayList(dayList []string) ([]DutyRoster, error) {
	var datetimeList []string
	for _, day := range dayList {
		datetimeList = append(datetimeList, day+" 00:00:00")
	}
	var result []DutyRoster
	err := db.Where("datetime IN ?", datetimeList).
		Preload("DutyLottery").
		Order("datetime").
		Find(&result).
		Error
	return result, err
}

func (*onCallModel) GetDrawLotsById(id int64) (DutyLottery, error) {
	var record DutyLottery
	err := db.Where("id = ?", id).First(&record).Error
	return record, err
}

func (*onCallModel) GetDrawLotsByTime(effectiveTime string) (DutyLottery, error) {
	var record DutyLottery
	err := db.Where("effective_time = ?", effectiveTime).First(&record).Error
	return record, err
}
