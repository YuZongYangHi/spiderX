package forms

type GroupForm struct {
	Name        string `validate:"required" json:"name"`
	Email       string `validate:"required" json:"email"`
	CnName      string `validate:"required" json:"cnName"`
	Description string `json:"description"`
}
