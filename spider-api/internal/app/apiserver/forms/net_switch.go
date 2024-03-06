package forms

type NetSwitchCreate struct {
	IpNetId     int64  `validate:"required"  json:"ipNetId"`
	Sn          string `validate:"required" json:"sn"`
	Status      int64  `validate:"required" json:"status"`
	NodeId      int64  `validate:"required" json:"nodeId"`
	FactoryId   int64  `validate:"required" json:"factoryId"`
	RackSlotId  int64  `validate:"required" json:"rackSlotId"`
	MutualRelIp string `validate:"required" json:"mutualRelIp"`
	UpRelPort   string `validate:"required" json:"upRelPort"`
	UpIpRelPort string `validate:"required" json:"upIpRelPort"`
	Type        int64  `validate:"required" json:"type"`
	Username    string `validate:"required" json:"username"`
	Password    string `validate:"required" json:"password"`
	Name        string `validate:"required" json:"name"`
	Description string `json:"description"`
}

type NetSwitchUpdate struct {
	Name        string `validate:"required" json:"name"`
	IpNetId     int64  `validate:"required"  json:"ipNetId"`
	Sn          string `validate:"required" json:"sn"`
	Status      int64  `validate:"required" json:"status"`
	NodeId      int64  `validate:"required" json:"nodeId"`
	FactoryId   int64  `validate:"required" json:"factoryId"`
	RackSlotId  int64  `validate:"required" json:"rackSlotId"`
	MutualRelIp string `validate:"required" json:"mutualRelIp"`
	UpRelPort   string `validate:"required" json:"upRelPort"`
	UpIpRelPort string `validate:"required" json:"upIpRelPort"`
	Type        int64  `validate:"required" json:"type"`
	Username    string `validate:"required" json:"username"`
	Password    string `validate:"required" json:"password"`
	Description string `json:"description"`
}
