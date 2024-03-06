package forms

type IdcRackCreateForm struct {
	Name       string `validate:"required" json:"name"`
	Row        string `validate:"required" json:"row"`
	Col        string `validate:"required" json:"col"`
	Group      string `validate:"required" json:"group"`
	UNum       int64  `validate:"required" json:"uNum"`
	RatedPower int64  `validate:"required" json:"ratedPower"`
	NetUNum    int64  `validate:"required" json:"netUNum"`
	Current    int64  `validate:"required" json:"current"`
	IdcRoomId  int64  `validate:"required"  json:"idcRoomId"`
	Status     int64  `validate:"required" json:"status"`
}
