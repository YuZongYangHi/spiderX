package cache

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"github.com/go-redis/redis/v7"
	"strconv"
)

type TicketCache struct {
	cursor redis.Cmdable
}

func (c *TicketCache) GenerateTicketRecordKey(sn string) string {
	datetime := parsers.GetCurrentYearMonthDay()
	return fmt.Sprintf("%s_%s_%s", TicketRecordSNKey, sn, datetime)
}

func (c *TicketCache) GetBySnRule(snRule string) (int64, error) {
	key := c.GenerateTicketRecordKey(snRule)
	b, err := Get(key)
	if err != nil {
		return 0, err
	}

	i, err := strconv.Atoi(string(b))
	if err != nil {
		return 0, err
	}

	return int64(i), nil
}

func (c *TicketCache) SetTicketRecordSnIncr(snRule string) (int64, error) {
	key := c.GenerateTicketRecordKey(snRule)
	return Incr(key)
}

func (c *TicketCache) GetTicketRecordSnBySnRule(snRule string) (string, error) {
	count, err := c.SetTicketRecordSnIncr(snRule)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s%s%06d", snRule, parsers.GetCurrentYearMonthDay(), count), nil
}

func NewTicketCache() *TicketCache {
	return &TicketCache{cacheClient}
}
