package config

const (
	LanguageEnUs = "en_us"
	LanguageZhCn = "zh_cn"
)

var apiServerConfig *APIServerConfig

type APIServerConfig struct {
	AppName  string                  `yaml:"appname"`
	Logger   APIServerLoggerConfig   `yaml:"logger"`
	Listen   APIServerListenConfig   `yaml:"listen"`
	DB       DBConfig                `yaml:"db"`
	Cache    CacheConfig             `yaml:"cache"`
	Security APIServerSecurityConfig `yaml:"security"`
	Cookie   APIServerCookieConfig   `yaml:"cookie"`
	Sentry   APIServerSentryConfig   `yaml:"sentry"`
	Common   APIServerCommonConfig   `yaml:"common"`
	Mail     APIServerMailConfig     `yaml:"mail"`
	Language string                  `yaml:"language"`
}

type APIServerMailConfig struct {
	StationName string `yaml:"station_name"`
	Host        string `yaml:"host"`
	User        string `yaml:"user"`
	Password    string `yaml:"password"`
	Port        string `yaml:"port"`
}

type APIServerCommonConfig struct {
	UserPhotoPath string `yaml:"user_photo_path"`
	UploadPath    string `yaml:"upload_path"`
}

type APIServerSecurityConfig struct {
	AccountSalt string `yaml:"account_salt"`
	JWTSalt     string `yaml:"jwt_salt"`
}

type APIServerSentryConfig struct {
	DSN string `yaml:"dsn"`
}

type APIServerCookieConfig struct {
	Expires string `yaml:"expires"`
}

type APIServerLoggerConfig struct {
	Level string `yaml:"level"`
}

type DBConfig struct {
	Name     string `yaml:"name"`
	User     string `yaml:"user"`
	Host     string `yaml:"host"`
	Port     int64  `yaml:"port"`
	Password string `yaml:"password"`
}

type APIServerListenConfig struct {
	Host                    string `yaml:"host"`
	Port                    int64  `yaml:"port"`
	Debug                   bool   `yaml:"debug"`
	GracefulShutdownTimeout string `yaml:"graceful_shutdown_timeout"`
}
