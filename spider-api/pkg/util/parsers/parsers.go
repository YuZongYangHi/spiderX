package parsers

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/labstack/gommon/log"
	"github.com/xuri/excelize/v2"
	"gopkg.in/yaml.v3"
	"io/fs"
	"os"
	"strconv"
	"strings"
	"time"
)

var (
	DefaultTimeLoc, _ = time.LoadLocation("Asia/Shanghai")
)

const (
	YAML                           = "yaml"
	JSON                           = "json"
	BeforeToday DateComparisonType = iota
	AfterToday

	ParseFixedTimeFormat         = "2006-01-02 15:04:05.000"
	YearMonthFormat              = "2006-01"
	YearMonthDayFormat           = "2006-01-02"
	YearMonthDayHourMinuteSecond = "2006-01-02 15:04:05"
)

type DateComparisonType int

func IsTodayFromString(dateStr string) (bool, error) {
	parsedDate, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return false, err
	}

	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	isToday := parsedDate.Year() == today.Year() && parsedDate.Month() == today.Month() && parsedDate.Day() == today.Day()
	return isToday, nil
}

func compareDateWithToday(dateStr string, comparisonType DateComparisonType) (bool, error) {
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return false, err
	}

	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	switch comparisonType {
	case BeforeToday:
		return date.Before(today), nil
	case AfterToday:
		return date.After(today), nil
	default:
		return false, fmt.Errorf("invalid date type")
	}
}

// FilterDates 根据比较类型过滤出符合条件的日期
func FilterDates(dates []string, comparisonType DateComparisonType) ([]string, error) {
	var filteredDates []string
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	for _, dateStr := range dates {
		date, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			return nil, err
		}

		if (comparisonType == BeforeToday && date.Before(today)) || (comparisonType == AfterToday && date.After(today)) {
			filteredDates = append(filteredDates, dateStr)
		}
	}
	return filteredDates, nil
}

func ParserConfigurationByFile(format, in string, out interface{}) error {
	data, err := fs.ReadFile(os.DirFS("."), in)

	if err != nil {
		return err
	}

	switch format {
	case YAML:
		return yaml.Unmarshal(data, out)
	case JSON:
		return json.Unmarshal(data, out)
	default:
		return errors.New("invalid file format")
	}
}

func ParseDuration(durationStr string) (time.Duration, error) {

	timeAttr := string(durationStr[len(durationStr)-1])
	realTime := strings.Split(durationStr, timeAttr)

	if len(realTime) != 2 {
		return 0, errors.New("invalid time str")
	}

	var (
		n, _ = strconv.Atoi(realTime[0])
		dur  = time.Duration(n) * time.Second
	)

	switch timeAttr {
	case "m":
		dur *= 60
	case "h":
		dur *= 60 * 60
	case "d":
		dur *= 60 * 60 * 24
	case "y":
		dur *= 60 * 60 * 24 * 365
	}
	return dur, nil
}

func TimeParse(times string) (time.Duration, error) {
	if dur, err := ParseDuration(times); err != nil {
		return 0, err
	} else {
		return dur, nil
	}
}

func ParseLogLevel(s string) log.Lvl {
	s = strings.ToUpper(s)
	m := map[string]log.Lvl{
		"DEBUG": log.DEBUG,
		"INFO":  log.INFO,
		"ERROR": log.ERROR,
		"WARN":  log.WARN,
	}

	if _, ok := m[s]; !ok {
		return log.INFO
	}
	return m[s]
}

func NewExcel(filename string) (*excelize.File, error) {
	f, err := excelize.OpenFile(filename)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	return f, nil
}

func InterfaceToString(in interface{}) string {
	b, err := json.Marshal(in)
	if err == nil {
		return string(b)
	}
	return ""
}

func ParseInt64ByStr(strIds []string) ([]int64, error) {
	var int64s []int64
	for _, s := range strIds {
		i, err := strconv.ParseInt(s, 10, 64)
		if err != nil {
			return int64s, err
		}
		int64s = append(int64s, i)
	}
	return int64s, nil
}

func GetCurrentYearMonthDay() string {
	t := time.Now()
	year := t.Year()
	month := t.Month()
	day := t.Day()

	monthStr := fmt.Sprintf("%02d", month)
	dayStr := fmt.Sprintf("%02d", day)
	return fmt.Sprintf("%d%s%s", year, monthStr, dayStr)
}

func GetTimeDifference(previousTime, currentTime string) string {
	layout := "2006-01-02 15:04:05"
	a, _ := time.Parse(layout, previousTime)
	b, _ := time.Parse(layout, currentTime)

	diff := b.Sub(a)

	days := int(diff.Hours() / 24)
	hours := int(diff.Hours()) % 24
	minutes := int(diff.Minutes()) % 60

	result := ""
	if days > 0 {
		result += fmt.Sprintf("%d 天 ", days)
	}
	if hours > 0 {
		result += fmt.Sprintf("%d 小时 ", hours)
	}
	if minutes > 0 {
		result += fmt.Sprintf("%d 分钟", minutes)
	}

	if result == "" {
		if diff.Seconds() == 0 {
			return "0秒"
		}
		result = fmt.Sprintf("%d 秒", int(diff.Seconds()))
	}

	return result
}

func TimeNowFormat() string {
	return time.Now().Format("2006-01-02 15:04:05")
}

func CheckMonthInRange(inputMonth string) bool {
	userMonth, err := time.Parse("2006-01", inputMonth)
	if err != nil {
		fmt.Println("Error parsing month:", err)
		return false
	}

	currentTime := time.Now()
	oneYearBefore := currentTime.AddDate(-1, 0, 0)
	oneYearAfter := currentTime.AddDate(1, 0, 0)

	return userMonth.After(oneYearBefore) && userMonth.Before(oneYearAfter)
}

// CompareMonthToCurrent return -1(lt)，0（eq），1（gt）
func CompareMonthToCurrent(yearMonth string) (int, error) {
	// 将输入字符串解析为时间，注意转换为UTC
	inputDate, err := time.Parse("2006-01", yearMonth)
	if err != nil {
		return 0, err // 解析错误
	}
	inputDate = inputDate.UTC() // 确保输入日期为UTC

	// 获取当前时间，并转换为UTC
	currentTime := time.Now().UTC()

	// 生成表示当前月份和输入月份第一天的时间对象，都使用UTC时区
	firstDayCurrentMonth := time.Date(currentTime.Year(), currentTime.Month(), 1, 0, 0, 0, 0, time.UTC)
	firstDayInputMonth := time.Date(inputDate.Year(), inputDate.Month(), 1, 0, 0, 0, 0, time.UTC)

	// 进行比较
	if firstDayInputMonth.Before(firstDayCurrentMonth) {
		return -1, nil
	} else if firstDayInputMonth.After(firstDayCurrentMonth) {
		return 1, nil
	}

	return 0, nil
}

func GetAllDaysInMonth(yearMonth string) ([]string, error) {
	startDate, err := time.Parse("2006-01", yearMonth)
	if err != nil {
		return nil, err // 解析错误
	}

	endDate := startDate.AddDate(0, 1, 0)

	var days []string
	currentDate := startDate

	for currentDate.Before(endDate) {
		days = append(days, currentDate.Format("2006-01-02"))
		currentDate = currentDate.AddDate(0, 0, 1) // 加一天
	}

	return days, nil
}

func GetRecentDayList() []string {
	var lastSevenDays []string

	now := time.Now()

	for i := 6; i >= 0; i-- {
		day := now.AddDate(0, 0, -i)
		lastSevenDays = append(lastSevenDays, day.Format("2006-01-02"))
	}
	return lastSevenDays
}
