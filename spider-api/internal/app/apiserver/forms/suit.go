package forms

type IdcSuitCreateForm struct {
	Name    string `validate:"required" json:"name"`
	Season  string `validate:"required" json:"season"`
	Type    string `validate:"required" json:"type"`
	Cpu     string `validate:"required" json:"cpu"`
	Memory  string `validate:"required" json:"memory"`
	Storage string `validate:"required" json:"storage"`
	Gpu     string `json:"gpu"`
	Raid    string `json:"raid"`
	Psu     string `json:"psu"`
	Nic     string `json:"nic"`
}

type IdcSuitNameCreateForm struct {
	Name string `validate:"required" json:"name"`
}
