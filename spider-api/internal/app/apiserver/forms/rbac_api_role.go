package forms

type APIRoleForm struct {
	Name        string `validate:"required" json:"Name"`
	Description string `json:"description"`
}

type APIRoleRelGrantGroup struct {
	GroupId int64 `json:"groupId"`
}

type APIRoleRelGrantUser struct {
	UserId int64 `json:"userId"`
}
