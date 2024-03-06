package forms

type IdcFactoryCreateForm struct {
	Name        string `validate:"required" json:"name"`
	ModeName    string `validate:"required" json:"modeName"`
	EnName      string `validate:"required" json:"enName"`
	CnName      string `validate:"required" json:"cnName"`
	Description string `json:"description"`
}
