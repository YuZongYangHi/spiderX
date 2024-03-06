package cache

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	cachepkg "github.com/YuZongYangHi/spiderX/spider-api/internal/pkg/cache"
	"github.com/go-redis/redis/v7"
	"time"
)

var (
	cacheClient redis.Cmdable
)

func GeneratePrefixKey(key string) string {
	return fmt.Sprintf("%s_%s", config.ApiServerConfig().Cache.Prefix, key)
}

func Set(key string, value interface{}, expiration time.Duration) error {
	return cacheClient.Set(GeneratePrefixKey(key), value, expiration).Err()
}

func Get(key string) ([]byte, error) {
	return cacheClient.Get(GeneratePrefixKey(key)).Bytes()
}

func Delete(key string) error {
	return cacheClient.Del(GeneratePrefixKey(key)).Err()
}

func GenerateUserLoginKey(value string) string {
	return fmt.Sprintf("%s_%s", UserLoginSessionKey, value)
}

func Incr(key string) (int64, error) {
	return cacheClient.Incr(GeneratePrefixKey(key)).Result()
}

func Client() redis.Cmdable {
	return cacheClient
}

func NewCacheClient(conf *config.CacheConfig) error {
	var err error
	cacheClient, err = cachepkg.NewCacheClient(conf)
	if err != nil {
		return err
	}
	return nil
}
