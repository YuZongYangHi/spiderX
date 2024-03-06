package forms

type NetIpRangeCreate struct {
	Cidr        string `validate:"required" json:"cidr"`
	Env         int64  `validate:"required" json:"env"`
	Version     int64  `validate:"required" json:"version"`
	Status      int64  `validate:"required" json:"status"`
	Operator    int64  `validate:"required" json:"operator"`
	NodeId      int64  `validate:"required" json:"nodeId"`
	Description string `json:"description"`
	Gateway     string `validate:"required" json:"gateway"`
	Type        int64  `validate:"required" json:"type"`
}

type IpRangeUpdate struct {
	Cidr        string `validate:"required" json:"cidr"`
	Env         int64  `validate:"required" json:"env"`
	Status      int64  `validate:"required" json:"status"`
	Operator    int64  `validate:"required" json:"operator"`
	NodeId      int64  `validate:"required" json:"nodeId"`
	Description string `json:"description"`
	Type        int64  `validate:"required" json:"type"`
	Gateway     string `validate:"required" json:"gateway"`
}
