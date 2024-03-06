package config

import "github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"

func ApiServerConfig() *APIServerConfig {
	return apiServerConfig
}

func OpenAPIServerConfig() *OpenAPIConfig {
	return openAPIServerConfig
}

func NewAPIServerConfig(file string) (*APIServerConfig, error) {
	if err := parsers.ParserConfigurationByFile(parsers.YAML, file, &apiServerConfig); err != nil {
		return nil, err
	}
	return apiServerConfig, nil
}

func NewOpenAPIServerConfig(file string) (*OpenAPIConfig, error) {
	if err := parsers.ParserConfigurationByFile(parsers.YAML, file, &openAPIServerConfig); err != nil {
		return nil, err
	}
	return openAPIServerConfig, nil
}
