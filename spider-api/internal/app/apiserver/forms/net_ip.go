package forms

type RelResource struct {
	ResourceId   int64 `json:"resourceId"`
	ResourceType int64 `json:"resourceType"`
}

type NetIpCreate struct {
	IpRangeId   int64         `validate:"required" json:"ipRangeId"`
	Ip          string        `validate:"required" json:"ip"`
	Netmask     string        `validate:"required" json:"netmask"`
	Gateway     string        `validate:"required" json:"gateway"`
	Type        int64         `validate:"required" json:"type"`
	Version     int64         `validate:"required" json:"version"`
	Env         int64         `validate:"required" json:"env"`
	Status      int64         `validate:"required" json:"status"`
	Operator    int64         `validate:"required" json:"operator"`
	Description string        `json:"description"`
	RelResource []RelResource `extra:"read_only=true" json:"relResource"`
}

type NetIpUpdate struct {
	Gateway     string        `validate:"required" json:"gateway"`
	Type        int64         `validate:"required" json:"type"`
	Env         int64         `validate:"required" json:"env"`
	Status      int64         `validate:"required" json:"status"`
	Description string        `json:"description"`
	Operator    int64         `validate:"required" json:"operator"`
	RelResource []RelResource `extra:"read_only=true" json:"relResource"`
}
