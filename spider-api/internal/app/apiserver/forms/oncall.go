package forms

type OnCallExchange struct {
	CurrentUser string `validate:"required" json:"currentUser"`
	HistoryUser string `validate:"required" json:"historyUser"`
	Datetime    string `validate:"required" json:"datetime"`
}

type CreateDrawLots struct {
	UserIds       string `validate:"required" json:"userIds"`
	DutyType      string `validate:"required" json:"dutyType"`
	EffectiveTime string `validate:"required" json:"effectiveTime"`
}

type UpdateDrawLots struct {
	UserIds       string `validate:"required" json:"userIds"`
	DutyType      string `validate:"required" json:"dutyType"`
	EffectiveTime string `validate:"required" json:"effectiveTime"`
}
