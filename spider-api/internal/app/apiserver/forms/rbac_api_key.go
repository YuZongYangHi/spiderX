package forms

type APIKey struct {
	Name        string  `validate:"required" json:"name"`
	ExpireIn    int64   `validate:"required" json:"expireIn"`
	RoleIds     []int64 `validate:"required" json:"roleIds"`
	Description string  `json:"description"`
}
