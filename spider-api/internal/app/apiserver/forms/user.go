package forms

type UserCreateForm struct {
	Username string `validate:"required,gte=3" json:"username"`
	Name     string `validate:"required,gte=2" json:"name"`
	Password string `validate:"required,gte=6" json:"password"`
	Email    string `validate:"required,email" json:"email"`
	IsActive bool   `json:"isActive"`
	IsAdmin  bool   `json:"isAdmin"`
	GroupId  int64  `json:"groupId"`
}

type UserUpdateForm struct {
	Password string `validate:"required,gte=6" json:"password"`
	IsActive bool   `json:"isActive"`
	IsAdmin  bool   `json:"isAdmin"`
	GroupId  int64  `json:"groupId"`
}
