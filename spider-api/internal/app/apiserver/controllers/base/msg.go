package base

const (
	HTTP200Message                    = "Success"
	HTTP201Message                    = "Created"
	HTTP204Message                    = "No Content"
	HTTP301Message                    = "Permanent Redirect"
	HTTP302Message                    = "Temporary Redirect"
	HTTP400Message                    = "Bad Request"
	HTTP401Message                    = "Unauthorized"
	HTTP403Message                    = "Do not have permission to access this resource"
	HTTP404Message                    = "Not Found"
	HTTP405Message                    = "Request Method Not Allowed"
	HTTP500Message                    = "Internal Server Error"
	HTTP502Message                    = "Bad Gateway"
	HTTP503Message                    = "Service Is Not Available"
	HTTP504Message                    = "Gateway Timeout"
	UserAccountError                  = "Incorrect username or password"
	DataAlreadyExists                 = "Data already exists"
	InvalidInstanceId                 = "Invalid instance id"
	DataNotFound                      = "Data not retrieved in database"
	ProductLineListInvalid            = "ProductLines id list invalid"
	InstanceAlreadyDelete             = "The instance has been deleted and cannot be modified"
	CustomValidatorValidError         = "Custom validator validation error"
	TicketStateFlowIsZero             = "Ticket state flow count is zero"
	TicketStateFlowIncomplete         = "Ticket state flow incomplete"
	TicketRecordIsDiscard             = "Ticket record is discard"
	TicketInvalidApprovalType         = "Invalid ticket node approval type"
	TicketWorkflowNodeStateNoComplete = "Not a complete workflow node"
	TicketRecordAlreadyUrge           = "The current process node has been urged"
	TicketRecordNotAllowDiscard       = "The current work order status does not allow abandonment"
	TicketRecordNoProcess             = "The current work order is not in the process"
	DutyRosterMonthRangeError         = "The month range exceeds the system-defined date"
	DutyRosterMonthCompareError       = "Anomalies occur when comparing months"
	NoHistoryDrawLottery              = "There is no historical lottery record"
)

var (
	codeMessageMapping = map[int]string{
		HTTP200Code: HTTP200Message,
		HTTP201Code: HTTP201Message,
		HTTP204Code: HTTP204Message,
		HTTP301Code: HTTP301Message,
		HTTP302Code: HTTP302Message,
		HTTP400Code: HTTP400Message,
		HTTP401Code: HTTP401Message,
		HTTP403Code: HTTP403Message,
		HTTP404Code: HTTP404Message,
		HTTP405Code: HTTP405Message,
		HTTP500Code: HTTP500Message,
		HTTP502Code: HTTP502Message,
		HTTP503Code: HTTP503Message,
		HTTP504Code: HTTP504Message,
	}
)

func GetHTTPCustomMessage(code int) string {
	return codeMessageMapping[code]
}
