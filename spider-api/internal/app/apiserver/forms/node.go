package forms

type NodeCreateForm struct {
	Name         string  `validate:"required" json:"name"`
	CnName       string  `validate:"required" json:"cnName"`
	Operator     int64   `validate:"required,gte=0,lte=4" json:"operator"`
	Bandwidth    string  `validate:"required" json:"bandwidth"`
	Region       string  `validate:"required" json:"region"`
	Province     string  `validate:"required" json:"province"`
	Status       int64   `validate:"required,gte=0,lte=8" json:"status"`
	Attribute    int64   `validate:"required,gte=0,lte=4" json:"attribute"`
	Grade        int64   `validate:"required,gte=0,lte=3" json:"grade"`
	Comment      string  `json:"comment"`
	Contract     int64   `validate:"required,gte=0,lte=2" json:"contract"`
	ProductLines []int64 `extra:"read_only=true" json:"productLines"`
}

type NodeUpdateForm struct {
	Operator     int64   `validate:"required,gte=0,lte=4" json:"operator"`
	Bandwidth    string  `validate:"required" json:"bandwidth"`
	Region       string  `validate:"required" json:"region"`
	Province     string  `validate:"required" json:"province"`
	Status       int64   `validate:"required,gte=0,lte=9" json:"status"`
	Attribute    int64   `validate:"required,gte=0,lte=4" json:"attribute"`
	Grade        int64   `validate:"required,gte=0,lte=3" json:"grade"`
	Comment      string  `json:"comment"`
	Contract     int64   `validate:"required,gte=0,lte=2" json:"contract"`
	ProductLines []int64 `extra:"read_only=true" json:"productLines"`
}

type NodeStatusForm struct {
	Status int64 `validate:"required,gte=0,lte=9" json:"status"`
}

type NodeMultiDeleteForm struct {
	Ids []int64 `validate:"required,gt=0,dive,required" json:"ids"`
}
