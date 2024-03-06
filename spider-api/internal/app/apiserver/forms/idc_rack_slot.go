package forms

type IdcRackSlotCreateForm struct {
	Slot      int64 `validate:"required" json:"slot"`
	Status    int64 `validate:"required" json:"status"`
	IdcRackId int64 `validate:"required" json:"idcRackId"`
	Type      int64 `validate:"required" json:"type"`
	UNum      int64 `validate:"required" json:"uNum"`
	Port      int64 `validate:"required" json:"port"`
}

type IdcRackSlotUpdateForm struct {
	IdcRackId int64 `validate:"required" json:"idcRackId"`
	Type      int64 `validate:"required" json:"type"`
	UNum      int64 `validate:"required" json:"uNum"`
	Port      int64 `validate:"required" json:"port"`
	Status    int64 `validate:"required" json:"status"`
	Slot      int64 `validate:"required" json:"slot"`
}
