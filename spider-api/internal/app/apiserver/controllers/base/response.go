package base

import (
	"github.com/labstack/echo/v4"
	"k8s.io/klog/v2"
)

type CommonResponse struct {
	Success      bool            `json:"success"`
	Data         ResponseContent `json:"data"`
	ErrorMessage string          `json:"errorMessage"`
}

type ResponseContent struct {
	List     interface{} `json:"list"`
	Current  int         `json:"current"`
	PageSize int         `json:"pageSize"`
	Total    int64       `json:"total"`
}

func SuccessResponse(ctx echo.Context, result interface{}) error {
	return Response(ctx, 200, CommonResponse{
		Success: true,
		Data: ResponseContent{
			List:     result,
			Current:  0,
			PageSize: 0,
			Total:    0,
		},
	})
}

func ErrorResponse(ctx echo.Context, errorCode int, errorMessage string) error {
	return Response(ctx, errorCode, CommonResponse{
		Success:      false,
		Data:         ResponseContent{},
		ErrorMessage: errorMessage,
	})
}

func Response(ctx echo.Context, code int, data CommonResponse) error {
	return ctx.JSON(code, data)
}

func BadRequestResponse(ctx echo.Context, message string) error {
	if message == "" {
		message = GetHTTPCustomMessage(HTTP400Code)
	}
	return ErrorResponse(ctx, HTTP400Code, message)
}

func UnauthorizedResponse(ctx echo.Context) error {
	return ErrorResponse(ctx, HTTP401Code, GetHTTPCustomMessage(HTTP401Code))
}

func ForbiddenResponse(ctx echo.Context) error {
	return ErrorResponse(ctx, HTTP403Code, GetHTTPCustomMessage(HTTP403Code))
}

func ServerInternalErrorResponse(ctx echo.Context, errMessage string) error {
	klog.Errorf("[ baseResponseContext ] response code: 500, errorMessage: %s", errMessage)
	return ErrorResponse(ctx, HTTP500Code, errMessage)
}

func SuccessNoContentResponse(ctx echo.Context) error {
	return SuccessResponse(ctx, nil)
}

func NotFoundResponse(ctx echo.Context) error {
	return ErrorResponse(ctx, HTTP404Code, "data not found")
}

func HTTPErrorHandler(err error, c echo.Context) {
	var (
		code    = HTTP500Code
		message = HTTP500Message
	)

	if ee, ok := err.(*echo.HTTPError); ok {
		code = ee.Code
		message = ee.Message.(string)
	}

	klog.Errorf("uri: %s, code: %d, errorMessage: %s", c.Request().RequestURI, code, message)
	c.Logger().Error(ErrorResponse(c, code, message))
}
