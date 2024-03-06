package requests

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"k8s.io/klog/v2"
	"net/http"
)

type GetOrDeleteParams struct {
	URL         string
	Headers     map[string]string
	Params      map[string]string
	Empowerment interface{}
}

type PostOrPutParams struct {
	URL         string
	Headers     map[string]string
	Body        interface{}
	Empowerment interface{}
}

type HTTPClient struct {
	req *http.Client
}

func NewTransPort() *http.Transport {
	transport := &http.Transport{
		MaxIdleConns:       1024,
		IdleConnTimeout:    120,
		DisableCompression: true,
		TLSClientConfig:    &tls.Config{InsecureSkipVerify: true},
	}

	return transport
}

func (r *HTTPClient) SplicingFullURL(protocol, host, uri string, port int) string {
	return fmt.Sprintf("%s://%s:%d%s", protocol, host, port, uri)
}

func (r *HTTPClient) addHeaders(req *http.Request, headers map[string]string) {
	if headers == nil {
		return
	}

	for k, v := range headers {
		req.Header.Add(k, v)
	}

	if host := req.Header.Get("Host"); host != "" {
		req.Host = host
		req.Header.Del("Host")
	}
}

func (r *HTTPClient) addParams(req *http.Request, params map[string]string) {
	if params == nil {
		return
	}

	q := req.URL.Query()
	for k, v := range params {
		q.Add(k, v)
	}

	req.URL.RawQuery = q.Encode()
}

func (r *HTTPClient) jsonConversion(body interface{}) (*bytes.Buffer, error) {
	jsonStdout, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}
	return bytes.NewBuffer(jsonStdout), nil
}

func (r *HTTPClient) deleteOrGetMixin(url, method string, headers, params map[string]string) (*http.Request, error) {
	req, err := http.NewRequest(method, url, nil)
	r.addHeaders(req, headers)
	r.addParams(req, params)
	return req, err
}

func (r *HTTPClient) postOrPutMixin(url, method string, body interface{}, headers map[string]string) (*http.Request, error) {
	b, _ := r.jsonConversion(body)
	req, err := http.NewRequest(method, url, b)
	r.addHeaders(req, headers)
	return req, err
}

func (r *HTTPClient) do(obj *http.Request, dst interface{}) error {
	resp, err := r.req.Do(obj)

	if err != nil {
		klog.Errorf("[ http-request ] http request error: %s", err.Error())
		return err
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		klog.Errorf("[ http-request ] read resp body error: %s", err.Error())
		return err
	}

	return r.parser(body, dst)
}

func (r *HTTPClient) parser(src []byte, dst interface{}) error {
	return json.Unmarshal(src, &dst)
}

func (r *HTTPClient) GET(obj *GetOrDeleteParams) error {
	req, _ := r.deleteOrGetMixin(obj.URL, "GET", obj.Headers, obj.Params)
	return r.do(req, obj.Empowerment)
}

func (r *HTTPClient) POST(obj *PostOrPutParams) error {
	req, _ := r.postOrPutMixin(obj.URL, "POST", obj.Body, obj.Headers)
	return r.do(req, obj.Empowerment)
}

func (r *HTTPClient) DELETE(obj *GetOrDeleteParams) error {
	req, _ := r.deleteOrGetMixin(obj.URL, "DELETE", obj.Headers, obj.Params)
	return r.do(req, obj.Empowerment)
}

func (r *HTTPClient) PUT(obj *PostOrPutParams) error {
	req, _ := r.postOrPutMixin(obj.URL, "PUT", obj.Body, obj.Headers)
	return r.do(req, obj.Empowerment)
}

func NewHTTPClient() *HTTPClient {
	return &HTTPClient{
		req: &http.Client{
			Transport: NewTransPort(),
		},
	}
}
