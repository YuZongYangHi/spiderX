package forms

type ServerCreateForm struct {
	Sn            string   `validate:"required" json:"sn"`
	Hostname      string   `validate:"required" json:"hostname"`
	Type          int      `validate:"required,gte=1,lte=3" json:"type"`
	SuitId        int64    `validate:"required" json:"suitId"`
	PowerInfo     string   `validate:"required" json:"powerInfo"`
	PowerCost     string   `validate:"required" json:"powerCost"`
	Role          int      `validate:"required,gte=1,lte=4" json:"role"`
	Operator      int      `validate:"required,gte=1,lte=4" json:"operator"`
	ProviderId    int64    `validate:"required" json:"providerId"`
	FactoryId     int64    `validate:"required" json:"factoryId"`
	NodeId        int64    `validate:"required" json:"nodeId"`
	IdcRackSlotId int64    `validate:"required" json:"idcRackSlotId"`
	Status        int64    `validate:"required" json:"status"`
	AppEnv        string   `validate:"required" json:"appEnv"`
	AppEnvDesc    string   `validate:"required" json:"appEnvDesc"`
	SystemType    string   `validate:"required" json:"systemType"`
	SystemVersion string   `validate:"required" json:"systemVersion"`
	SystemArch    string   `validate:"required" json:"systemArch"`
	BelongTo      string   `validate:"required" json:"belongTo"`
	BelongToDesc  string   `json:"belongToDesc"`
	ArrivalTime   string   `validate:"required" json:"arrivalTime"`
	OverdueTime   string   `validate:"required" json:"overdueTime"`
	PrivNetIp     string   `validate:"required" json:"privNetIp"`
	PrivNetMask   string   `validate:"required" json:"privNetMask"`
	PrivNetGw     string   `validate:"required" json:"privNetGw"`
	PubNetIp      string   `validate:"required" json:"pubNetIp"`
	PubNetMask    string   `validate:"required" json:"pubNetMask"`
	PubNetGw      string   `validate:"required" json:"pubNetGw"`
	MgmtPortIp    string   `validate:"required" json:"mgmtPortIp"`
	MgmtPortMask  string   `validate:"required" json:"mgmtPortMask"`
	MgmtPortGw    string   `validate:"required" json:"mgmtPortGw"`
	Comment       string   `validate:"required" json:"comment"`
	ProductLines  []int64  `extra:"read_only=true" json:"productLines"`
	Tags          []string `extra:"read_only=true" json:"tags"`
}

type ServerUpdateForm struct {
	Hostname      string   `validate:"required" json:"hostname"`
	Type          int      `validate:"required,gte=1,lte=3" json:"type"`
	SuitId        int64    `validate:"required" json:"suitId"`
	PowerInfo     string   `validate:"required" json:"powerInfo"`
	PowerCost     string   `validate:"required" json:"powerCost"`
	Role          int      `validate:"required,gte=1,lte=4" json:"role"`
	Operator      int      `validate:"required,gte=1,lte=4" json:"operator"`
	ProviderId    int64    `validate:"required" json:"providerId"`
	FactoryId     int64    `validate:"required" json:"factoryId"`
	NodeId        int64    `validate:"required" json:"nodeId"`
	IdcRackSlotId int64    `validate:"required" json:"idcRackSlotId"`
	Status        int64    `validate:"required" json:"status"`
	AppEnv        string   `validate:"required" json:"appEnv"`
	AppEnvDesc    string   `validate:"required" json:"appEnvDesc"`
	SystemType    string   `validate:"required" json:"systemType"`
	SystemVersion string   `validate:"required" json:"systemVersion"`
	SystemArch    string   `validate:"required" json:"systemArch"`
	BelongTo      string   `validate:"required" json:"belongTo"`
	BelongToDesc  string   `json:"belongToDesc"`
	OverdueTime   string   `validate:"required" json:"overdueTime"`
	PrivNetIp     string   `validate:"required" json:"privNetIp"`
	PrivNetMask   string   `validate:"required" json:"privNetMask"`
	PrivNetGw     string   `validate:"required" json:"privNetGw"`
	PubNetIp      string   `validate:"required" json:"pubNetIp"`
	PubNetMask    string   `validate:"required" json:"pubNetMask"`
	PubNetGw      string   `validate:"required" json:"pubNetGw"`
	MgmtPortIp    string   `validate:"required" json:"mgmtPortIp"`
	MgmtPortMask  string   `validate:"required" json:"mgmtPortMask"`
	MgmtPortGw    string   `validate:"required" json:"mgmtPortGw"`
	Comment       string   `validate:"required" json:"comment"`
	ProductLines  []int64  `extra:"read_only=true" json:"productLines"`
	Tags          []string `extra:"read_only=true" json:"tags"`
}

type ServerTreeMigrate struct {
	SrcTreeId int64   `validate:"required" json:"srcTreeId"`
	TargetIds []int64 `validate:"required" json:"targetIds"`
	ServerIds []int64 `validate:"required" json:"serverIds"`
}
