package forms

type IdcCreateForm struct {
	Name        string `validate:"required" json:"name"`
	CnName      string `validate:"required" json:"cnName"`
	Status      int64  `validate:"required" json:"status"`
	PhysicsAzId int64  `validate:"required" json:"physicsAzId"`
	VirtualAzId int64  `validate:"required" json:"virtualAzId"`
	Address     string `validate:"required" json:"address"`
	Region      string `validate:"required" json:"region"`
	City        string `validate:"required" json:"city"`
	CabinetNum  int64  `validate:"required" json:"cabinetNum"`
	IdcPhone    string `json:"idcPhone"`
	IdcMail     string `json:"idcMail"`
	Comment     string `json:"comment"`
}

type IdcUpdateForm struct {
	CnName      string `validate:"required" json:"cnName"`
	Status      int64  `validate:"required" json:"status"`
	PhysicsAzId int64  `validate:"required" json:"physicsAzId"`
	VirtualAzId int64  `validate:"required" json:"virtualAzId"`
	Address     string `validate:"required" json:"address"`
	Region      string `validate:"required" json:"region"`
	City        string `validate:"required" json:"city"`
	CabinetNum  int64  `validate:"required" json:"cabinetNum"`
	IdcPhone    string `json:"idcPhone"`
	IdcMail     string `json:"idcMail"`
	Comment     string `json:"comment"`
}
