package forms

type APIActionForm struct {
	Resource    string `validate:"required,uri" json:"resource"`
	Verb        string `validate:"required" json:"verb"`
	Description string `json:"description"`
}
