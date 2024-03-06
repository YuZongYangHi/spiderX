package util

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"math/rand"
	"regexp"
	"strconv"
	"strings"
	"time"
)

func GenUUID() string {
	n := uuid.New()
	key := n.String()
	return key
}

func IsMD5(s string) bool {
	pattern := `^[a-fA-F0-9]{32}$`
	matched, err := regexp.MatchString(pattern, s)
	if err != nil {
		return false
	}
	return matched
}

func GenerateCriteriaHTTPServer(addr string, port int64) string {
	return fmt.Sprintf("%s:%d", addr, port)
}

func OpenAPILoggerMapping(src string) string {
	switch strings.ToUpper(src) {
	case "DEBUG":
		return gin.DebugMode
	case "INFO":
		return gin.ReleaseMode
	}
	return gin.ReleaseMode
}

func Pop(m map[string]interface{}, key string) (interface{}, bool) {
	v, ok := m[key]
	if ok {
		delete(m, key)
	}
	return v, ok
}

func ParseIntArrayByStr(s string) []int64 {
	var list []int64
	sp := strings.Split(s, ",")
	for _, id := range sp {
		value, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			continue
		}
		list = append(list, value)
	}
	return list
}

func ValuesIsNotNull(s1 ...string) bool {
	for _, s := range s1 {
		if s == "" {
			return false
		}
	}
	return true
}

func ValuesReplaceSpace(s1 []string) []string {
	var s2 []string
	for _, s := range s1 {
		s = strings.TrimSpace(s)
		s2 = append(s2, s)
	}
	return s2
}

func ContainsInt64(content, sp string, value int64) bool {
	slice := strings.Split(content, sp)

	for _, str := range slice {
		i64, err := strconv.ParseInt(strings.TrimSpace(str), 10, 64)
		if err != nil {
			return false
		}
		if i64 == value {
			return true
		}
	}
	return false
}

func Shuffle(slice []string) []string {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(slice), func(i, j int) {
		slice[i], slice[j] = slice[j], slice[i]
	})
	return slice
}

func ConvertAndShuffle(input string) string {
	items := strings.Split(input, ",")
	value := Shuffle(items)
	return strings.Join(value, ",")
}
