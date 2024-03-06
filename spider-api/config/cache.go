package config

type CacheConfig struct {
	Prefix   string   `yaml:"prefix"`
	Master   string   `yaml:"master"`
	Hosts    []string `yaml:"hosts"`
	DB       int      `yaml:"db"`
	Password string   `yaml:"password"`
	Type     string   `yaml:"type"`
}
