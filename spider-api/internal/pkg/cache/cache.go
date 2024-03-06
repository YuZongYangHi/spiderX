package cache

import (
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/go-redis/redis/v7"
)

const (
	StandAloneMode = "stand-alone"
	SentinelMode   = "sentinel"
	ClusterMode    = "cluster"
)

// / newStandAloneConnection redis standalone instance
func newStandAloneConnection(conf *config.CacheConfig) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     conf.Hosts[0],
		Password: conf.Password,
		DB:       conf.DB,
	})
}

// newClusterConnection redis cluster instance
func newClusterConnection(conf *config.CacheConfig) *redis.ClusterClient {
	return redis.NewClusterClient(&redis.ClusterOptions{
		Addrs:    conf.Hosts,
		Password: conf.Password,
	})
}

// newSentinelConnection redis sentinel instance
func newSentinelConnection(conf *config.CacheConfig) *redis.Client {
	return redis.NewFailoverClient(&redis.FailoverOptions{
		MasterName:    conf.Master,
		SentinelAddrs: conf.Hosts,
		Password:      conf.Password,
		DB:            conf.DB,
	})
}

func NewCacheClient(conf *config.CacheConfig) (redis.Cmdable, error) {
	var cacheClient redis.Cmdable
	switch conf.Type {
	case StandAloneMode:
		cacheClient = newStandAloneConnection(conf)
	case SentinelMode:
		cacheClient = newSentinelConnection(conf)
	case ClusterMode:
		cacheClient = newClusterConnection(conf)
	}
	return cacheClient, cacheClient.Ping().Err()
}
