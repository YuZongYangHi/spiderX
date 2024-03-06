package forms

type IdcProviderCreateForm struct {
	Name  string `validate:"required" json:"name"`
	Alias string `validate:"required" json:"alias"`
}
