package config

var openAPIServerConfig *OpenAPIConfig

type OpenAPIConfig struct {
	Logger   OpenAPILoggerConfig `yaml:"logger"`
	HTTP     OpenAPIHTTPConfig   `yaml:"http"`
	Database DBConfig            `yaml:"database"`
	Auth     OpenAPIAuthConfig   `yaml:"auth"`
}

type OpenAPILoggerConfig struct {
	Info string `yaml:"info"`
}

type OpenAPIHTTPConfig struct {
	Addr         string `yaml:"addr"`
	Port         int64  `yaml:"port"`
	ReadTimeout  int64  `yaml:"readTimeout"`
	WriteTimeout int64  `yaml:"writeTimeout"`
}

type OpenAPIAuthConfig struct {
	JwtSalt string `yaml:"jwtSalt"`
}
