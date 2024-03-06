package forms

type APIRoleResourceForm struct {
	ResourceId int64 `validate:"required" json:"resourceId"`
}
