package forms

type AzForm struct {
	Name     string `validate:"required" json:"name"`
	CnName   string `json:"cnName"`
	Region   string `validate:"required" json:"region"`
	Province string `validate:"required" json:"province"`
	Type     int64  `validate:"required" json:"type"`
	Status   int64  `validate:"required" json:"status"`
}

type IdcAzMultiDeleteForm struct {
	Ids []int64 `validate:"required,gt=0,dive,required" json:"ids"`
}
