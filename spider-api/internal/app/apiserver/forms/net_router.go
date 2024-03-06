package forms

type NetRouterCreate struct {
	Name        string `validate:"required" json:"name"`
	IpNetId     int64  `validate:"required"  json:"ipNetId"`
	Sn          string `validate:"required" json:"sn"`
	Status      int64  `validate:"required" json:"status"`
	NodeId      int64  `validate:"required" json:"nodeId"`
	FactoryId   int64  `validate:"required" json:"factoryId"`
	RackSlotId  int64  `validate:"required" json:"rackSlotId"`
	Username    string `validate:"required" json:"username"`
	Password    string `validate:"required" json:"password"`
	Description string `json:"description"`
}

type NetRouterUpdate struct {
	Name        string `validate:"required" json:"name"`
	IpNetId     int64  `validate:"required"  json:"ipNetId"`
	Sn          string `validate:"required" json:"sn"`
	Status      int64  `validate:"required" json:"status"`
	NodeId      int64  `validate:"required" json:"nodeId"`
	FactoryId   int64  `validate:"required" json:"factoryId"`
	RackSlotId  int64  `validate:"required" json:"rackSlotId"`
	Username    string `validate:"required" json:"username"`
	Password    string `validate:"required" json:"password"`
	Description string `json:"description"`
}
