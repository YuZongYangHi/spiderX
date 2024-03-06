package base

// HTTP common response status code.
const (
	HTTP_200_OK                    = 200
	HTTP_201_CREATED               = 201
	HTTP_202_ACCEPTED              = 202
	HTTP_204_NO_CONTENT            = 204
	HTTP_400_BAD_REQUEST           = 400
	HTTP_401_UNAUTHORIZED          = 401
	HTTP_403_FORBIDDEN             = 403
	HTTP_404_NOT_FOUND             = 404
	HTTP_405_METHOD_NOT_ALLOWED    = 405
	HTTP_406_NOT_ACCEPTABLE        = 406
	HTTP_410_GONE                  = 410
	HTTP_422_UNPROCESSABLE_ENTITY  = 422
	HTTP_500_INTERNAL_SERVER_ERROR = 500
	HTTP_502_BAD_GATEWAY           = 502
	HTTP_503_SERVICE_UNAVAILABLE   = 503
	HTTP_504_GATEWAY_TIMEOUT       = 504
)

// HTTP common response status code description
const (
	HTTP_200 = "success"
	HTTP_201 = "New or modified data successfully"
	HTTP_202 = "A request has entered the background queue (asynchronous task)"
	HTTP_204 = "Data deleted successfully"
	HTTP_400 = "There was an error in the request sent, and the server did not create or modify data"
	HTTP_401 = "The user does not have permission (the token, username, password is wrong)."
	HTTP_403 = "You do not have permission to access this resource"
	HTTP_404 = "Data not found"
	HTTP_405 = "It is not allowed to request this resource using the current method"
	HTTP_406 = "The requested format is not available"
	HTTP_410 = "The requested resource is permanently deleted and will no longer be available"
	HTTP_422 = "When creating an object, a validation error occurred."
	HTTP_500 = "Server error"
	HTTP_502 = "Gateway error"
	HTTP_503 = "Internal error of service program"
	HTTP_504 = "Gateway timeout"
)

var GetCodeRelMsg = map[int]string{
	HTTP_200_OK:                    HTTP_200,
	HTTP_201_CREATED:               HTTP_201,
	HTTP_202_ACCEPTED:              HTTP_202,
	HTTP_204_NO_CONTENT:            HTTP_204,
	HTTP_400_BAD_REQUEST:           HTTP_400,
	HTTP_401_UNAUTHORIZED:          HTTP_401,
	HTTP_403_FORBIDDEN:             HTTP_403,
	HTTP_404_NOT_FOUND:             HTTP_404,
	HTTP_405_METHOD_NOT_ALLOWED:    HTTP_405,
	HTTP_406_NOT_ACCEPTABLE:        HTTP_406,
	HTTP_410_GONE:                  HTTP_410,
	HTTP_422_UNPROCESSABLE_ENTITY:  HTTP_422,
	HTTP_500_INTERNAL_SERVER_ERROR: HTTP_500,
	HTTP_502_BAD_GATEWAY:           HTTP_502,
	HTTP_503_SERVICE_UNAVAILABLE:   HTTP_503,
	HTTP_504_GATEWAY_TIMEOUT:       HTTP_504,
}
