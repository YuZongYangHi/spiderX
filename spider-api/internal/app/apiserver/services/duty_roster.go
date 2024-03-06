package services

import (
	"errors"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"sort"
	"strconv"
	"strings"
	"time"
)

type SortOnCallResponse []OnCallResponse

func (p SortOnCallResponse) Len() int {
	return len(p)
}

func (p SortOnCallResponse) Less(i, j int) bool {
	return p[i].Datetime < p[j].Datetime
}

func (p SortOnCallResponse) Swap(i, j int) { p[i], p[j] = p[j], p[i] }

type OnCallMetaData struct {
	Day                string
	Scheduling         []string
	SchedulingType     string
	CurrentUserName    string
	CurrentUserIdIndex int64
	HistoryUsername    string
}

type OnCallResponse struct {
	SchedulingType string `json:"schedulingType"`
	CurrentUser    string `json:"currentUser"`
	HistoryUser    string `json:"historyUser"`
	Datetime       string `json:"datetime"`
}

type CalculateOnCallBParams struct {
	DutyLotteryId int64
	Start         string
	End           string
	DutyType      string
	Index         int
	Values        []string
}

type DutyRoster struct {
	userList map[int64]models.User
	ctx      *base.Context
}

func (c *DutyRoster) GetIndexByUserIds(userId string, userIds []string) int {
	for index, id := range userIds {
		if id == userId {
			return index
		}
	}
	return 0
}

func (c *DutyRoster) CheckIndexOverflow(index int, values []string) bool {
	if index == len(values) {
		return true
	}
	return false
}

func (c *DutyRoster) GetIndex(index int, value []string) int {
	if c.CheckIndexOverflow(index, value) {
		index = 0
	}
	return index
}

func (c *DutyRoster) Get(index int, value []string) string {
	if c.CheckIndexOverflow(index, value) {
		index = 0
	}
	return value[index]
}

func (c *DutyRoster) PersonIndexShouldIncrByDutyType(dutyType string, datetime time.Time) bool {
	return (dutyType == models.WeekTransition && datetime.Weekday() == time.Sunday) ||
		dutyType == models.DayTransition
}

func (c *DutyRoster) CalculateDayBetweenNextIndexList(params CalculateOnCallBParams) ([]OnCallMetaData, error) {
	var result []OnCallMetaData
	startDate, _ := time.ParseInLocation(parsers.YearMonthDayFormat, params.Start, parsers.DefaultTimeLoc)
	endDate, _ := time.ParseInLocation(parsers.YearMonthDayFormat, params.End, parsers.DefaultTimeLoc)
	for currDate := startDate; !currDate.After(endDate); currDate = currDate.AddDate(0, 0, 1) {
		drawLotsRecord, _ := c.GetDrawLotsByDay(currDate.Format(parsers.YearMonthDayFormat) + " 00:00:00")
		if drawLotsRecord.Id > 0 && drawLotsRecord.UserIds != strings.Join(params.Values, ",") {
			params.Values = strings.Split(drawLotsRecord.UserIds, ",")
			params.Index = 0
			params.DutyType = drawLotsRecord.DutyType
			params.DutyLotteryId = drawLotsRecord.Id
		}
		params.Index = c.GetIndex(params.Index, params.Values)
		userId, _ := strconv.ParseInt(c.Get(params.Index, params.Values), 10, 64)
		user, _ := models.UserModel.GetById(userId)
		day := currDate.Format(parsers.YearMonthDayFormat)

		currentUsername := user.Username
		historyUsername := ""
		exchange, _ := models.OnCallModel.GetExchange(day)
		if exchange.Id > 0 {
			currentUsername = exchange.CurrentUser
			historyUsername = exchange.HistoryUser
		}

		if ok, _ := parsers.IsTodayFromString(day); ok {
			todayRecord, err := models.OnCallModel.GetOnCallByDatetime(day + " 00:00:00")
			if todayRecord.Id == 0 {
				m := models.DutyRoster{
					CurrentUser:   currentUsername,
					HistoryUser:   historyUsername,
					Datetime:      currDate,
					DutyLotteryId: params.DutyLotteryId,
				}
				if err = models.OrmDB().Create(&m).Error; err != nil {
					return nil, err
				}
			}
		}
		result = append(result, OnCallMetaData{
			Day:                day,
			Scheduling:         params.Values,
			SchedulingType:     params.DutyType,
			CurrentUserIdIndex: int64(params.Index),
			CurrentUserName:    currentUsername,
			HistoryUsername:    historyUsername,
		})

		if c.PersonIndexShouldIncrByDutyType(params.DutyType, currDate) {
			params.Index += 1
		}

	}
	return result, nil
}

func (c *DutyRoster) getNearDrawLotsByDay(day string) (models.DutyLottery, error) {
	var result models.DutyLottery
	day += "00:00:00"
	err := models.OrmDB().Where("effective_time <= ?", day).
		Order("effective_time desc").
		First(&result).
		Error
	return result, err
}

func (c *DutyRoster) GetDrawLotsByDay(day string) (models.DutyLottery, error) {
	var result models.DutyLottery
	err := models.OrmDB().Where("effective_time = ?", day).
		Order("effective_time desc").
		First(&result).
		Error
	return result, err
}

func (c *DutyRoster) GetNearOnCall(start, end string, nearOnCallRecord models.DutyRoster) (CalculateOnCallBParams, error) {
	nearDrawLotsRecord, _ := c.getNearDrawLotsByDay(start)
	if nearDrawLotsRecord.Id == 0 {
		return CalculateOnCallBParams{}, errors.New(base.NoHistoryDrawLottery)
	}

	currentDay := nearDrawLotsRecord.EffectiveTime.Format("2006-01-02")
	currentUserIdIndex := 0
	dutyType := nearDrawLotsRecord.DutyType
	userList := strings.Split(nearDrawLotsRecord.UserIds, ",")
	dutyLotteryId := nearDrawLotsRecord.Id

	if nearOnCallRecord.Id > 0 {
		user, _ := models.UserModel.GetByUsername(nearOnCallRecord.CurrentUser)
		userList = strings.Split(nearOnCallRecord.DutyLottery.UserIds, ",")
		index := c.GetIndexByUserIds(strconv.FormatInt(user.Id, 10), userList)
		dutyType = nearOnCallRecord.DutyLottery.DutyType
		dutyLotteryId = nearOnCallRecord.DutyLottery.Id

		if c.PersonIndexShouldIncrByDutyType(nearOnCallRecord.DutyLottery.DutyType, nearOnCallRecord.Datetime) {
			index = c.GetIndex(index+1, userList)
		}
		currentUserIdIndex = index
		currentDay = nearOnCallRecord.Datetime.AddDate(0, 0, 1).Format("2006-01-02")
	}
	return CalculateOnCallBParams{
		Start:         currentDay,
		End:           end,
		DutyType:      dutyType,
		Index:         currentUserIdIndex,
		Values:        userList,
		DutyLotteryId: dutyLotteryId,
	}, nil
}

func (c *DutyRoster) GenerateOnCallResponse(dutyRosterList []models.DutyRoster) SortOnCallResponse {
	var result SortOnCallResponse
	for _, obj := range dutyRosterList {
		result = append(result, OnCallResponse{
			SchedulingType: obj.DutyLottery.DutyType,
			CurrentUser:    obj.CurrentUser,
			HistoryUser:    obj.HistoryUser,
			Datetime:       obj.Datetime.Format("2006-01-02"),
		})
	}
	sort.Sort(result)
	return result
}

func (c *DutyRoster) GenerateDayRangeOnCallResponse(dayList []string, metaDataList []OnCallMetaData) SortOnCallResponse {
	var result SortOnCallResponse
	for _, day := range dayList {
		for _, onCall := range metaDataList {
			if day == onCall.Day {
				data := OnCallResponse{
					Datetime:       onCall.Day,
					CurrentUser:    onCall.CurrentUserName,
					HistoryUser:    onCall.HistoryUsername,
					SchedulingType: onCall.SchedulingType,
				}
				result = append(result, data)
			}
		}
	}
	sort.Sort(result)
	return result
}

func (c *DutyRoster) FindHistoryOnCall(datetime string) (SortOnCallResponse, error) {
	list, err := models.OnCallModel.FindByLikeDatetime(datetime)
	if err != nil {
		return nil, err
	}
	return c.GenerateOnCallResponse(list), nil
}

func (c *DutyRoster) FindFutureOnCall(datetime string) (SortOnCallResponse, error) {
	dayList, _ := parsers.GetAllDaysInMonth(datetime)
	var historyLastOnCallRecord models.DutyRoster
	_ = models.OrmDB().
		Where("datetime <= ? ", datetime).
		Preload("DutyLottery").
		Order("datetime desc").
		First(&historyLastOnCallRecord).
		Error

	params, err := c.GetNearOnCall(dayList[0], dayList[len(dayList)-1], historyLastOnCallRecord)
	if err != nil {
		return nil, err
	}
	onCallResult, _ := c.CalculateDayBetweenNextIndexList(params)
	return c.GenerateDayRangeOnCallResponse(dayList, onCallResult), nil
}

func (c *DutyRoster) FindCurrentMonthOnCall(datetime string) (SortOnCallResponse, error) {
	var result SortOnCallResponse
	dayList, _ := parsers.GetAllDaysInMonth(datetime)
	beforeDayList, err := parsers.FilterDates(dayList, parsers.BeforeToday)
	if err != nil {
		return result, err
	}
	afterDayList, err := parsers.FilterDates(dayList, parsers.AfterToday)
	if err != nil {
		return result, err
	}

	beforeOnCallResult, _ := models.OnCallModel.FindHistoryOnCallByDayList(beforeDayList)
	result = append(result, c.GenerateOnCallResponse(beforeOnCallResult)...)

	if len(afterDayList) > 0 {
		var nearRecord models.DutyRoster
		_ = models.OrmDB().
			Where("datetime <= ? ", afterDayList[0]+" 00:00:00").
			Preload("DutyLottery").
			Order("datetime desc").
			First(&nearRecord).
			Error
		params, _ := c.GetNearOnCall(afterDayList[0], afterDayList[len(afterDayList)-1], nearRecord)
		afterOnCallResult, _ := c.CalculateDayBetweenNextIndexList(params)
		result = append(result, c.GenerateDayRangeOnCallResponse(afterDayList, afterOnCallResult)...)

		if ok, _ := parsers.IsTodayFromString(nearRecord.Datetime.Format(parsers.YearMonthDayFormat)); ok {
			result = append(result, OnCallResponse{
				SchedulingType: nearRecord.DutyLottery.DutyType,
				CurrentUser:    nearRecord.CurrentUser,
				HistoryUser:    nearRecord.HistoryUser,
				Datetime:       nearRecord.Datetime.Format(parsers.YearMonthDayFormat),
			})
		}
	}
	sort.Sort(result)
	return result, nil
}

func (c *DutyRoster) ListOnCall() error {
	month := c.ctx.QueryParam("month")
	if month == "" {
		return base.ErrorResponse(c.ctx, 200, base.InvalidInstanceId)
	}
	if !parsers.CheckMonthInRange(month) {
		return base.ErrorResponse(c.ctx, 200, base.DutyRosterMonthRangeError)
	}

	compareMonth, err := parsers.CompareMonthToCurrent(month)
	if err != nil {
		return base.ErrorResponse(c.ctx, 200, base.DutyRosterMonthCompareError)
	}

	var result []OnCallResponse
	switch compareMonth {
	case models.LtCurrentMonthNum:
		result, err = c.FindHistoryOnCall(month)
	case models.EqCurrentMonthNum:
		result, err = c.FindCurrentMonthOnCall(month)
	case models.GtCurrentMonthNum:
		result, err = c.FindFutureOnCall(month)
	}

	if err != nil {
		return base.ErrorResponse(c.ctx, 200, err.Error())
	}
	return base.SuccessResponse(c.ctx, result)
}

func NewDutyRoster(c *base.Context) *DutyRoster {
	users, _ := models.UserModel.List()
	m := map[int64]models.User{}
	for _, user := range users {
		m[user.Id] = user
	}
	return &DutyRoster{
		ctx:      c,
		userList: m,
	}
}
