package forms

type IdcRoomCreateForm struct {
	RoomName    string `validate:"required" json:"roomName"`
	IdcId       int64  `validate:"required" json:"idcId"`
	Status      int64  `validate:"required" json:"status"`
	PduStandard string `validate:"required" json:"pduStandard"`
	PowerMode   string `validate:"required" json:"powerMode"`
	RackSize    string `validate:"required" json:"rackSize"`
	BearerType  string `validate:"required" json:"bearerType"`
	BearWeight  string `validate:"required" json:"bearWeight"`
}

type IdcRoomUpdateForm struct {
	IdcId       int64  `validate:"required" json:"idcId"`
	Status      int64  `validate:"required" json:"status"`
	PduStandard string `validate:"required" json:"pduStandard"`
	PowerMode   string `validate:"required" json:"powerMode"`
	RackSize    string `validate:"required" json:"rackSize"`
	BearerType  string `validate:"required" json:"bearerType"`
	BearWeight  string `validate:"required" json:"bearWeight"`
}
