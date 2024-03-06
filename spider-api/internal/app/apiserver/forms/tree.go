package forms

type TreeDelete struct {
	FullIdPath string `validate:"required" json:"fullIdPath"`
	Id         int64  `validate:"required" json:"id"`
}

type TreeCreate struct {
	FullIdPath   string `validate:"required" json:"fullIdPath"`
	FullNamePath string `validate:"required" json:"fullNamePath"`
	Name         string `validate:"required" json:"name"`
	ParentId     int64  `validate:"required" json:"parentId"`
	Level        int64  `validate:"required" json:"level"`
}

type TreeUpdate struct {
	FullNamePath string `validate:"required" json:"fullNamePath"`
	Name         string `validate:"required" json:"name"`
}

type TreeMigrate struct {
	SrcId  int64 `json:"srcId"`
	DestId int64 `json:"destId"`
}
