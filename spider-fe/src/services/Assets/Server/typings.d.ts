declare namespace ServerRequest {
  type CreateServer = {
    id: number;
    sn: number;
    hostname: string;
    type: number;
    suit: IdcResponse.IdcSuitInfo;
    powerInfo: string;
    powerCost: string;
    role: number;
    operator: number;
    provider: IdcResponse.IdcProviderInfo;
    factory: IdcResponse.IdcFactoryInfo;
    node: NodeResponse.NodeInfo;
    idcRackSlot: IdcResponse.IdcRackSlotInfo;
    status: number;
    appEnv: string;
    appEnvDesc: string;
    systemType: string;
    systemVersion: string;
    systemArch: string;
    belongTo: string;
    belongToDesc: string;
    arrivalTime: string;
    overdueTime: string;
    privNetIp: string;
    privNetMask: string;
    privNetGw: string;
    pubNetIp: string;
    pubNetMask: string;
    pubNetGw: string;
    mgmtPortIp: string;
    mgmtPortMask: string;
    mgmtPortGw: string;
    comment: string;
    creator: string;
    isDeleted: number;
    createTime: string;
    updateTime: string;
  }

  type UpdateServer = {
    id: number;
    hostname: string;
    type: number;
    suit: IdcResponse.IdcSuitInfo;
    powerInfo: string;
    powerCost: string;
    role: number;
    operator: number;
    provider: IdcResponse.IdcProviderInfo;
    factory: IdcResponse.IdcFactoryInfo;
    node: NodeResponse.NodeInfo;
    idcRackSlot: IdcResponse.IdcRackSlotInfo;
    status: number;
    appEnv: string;
    appEnvDesc: string;
    systemType: string;
    systemVersion: string;
    systemArch: string;
    belongTo: string;
    belongToDesc: string;
    arrivalTime: string;
    overdueTime: string;
    privNetIp: string;
    privNetMask: string;
    privNetGw: string;
    pubNetIp: string;
    pubNetMask: string;
    pubNetGw: string;
    mgmtPortIp: string;
    mgmtPortMask: string;
    mgmtPortGw: string;
    comment: string;
    creator: string;
    isDeleted: number;
    createTime: string;
    updateTime: string;
  }
  type FilterParams = {
    sn: string;
    hostname: string,
    type: number;
    suitId: number;
    role: number;
    operator: number;
    providerId: number;
    factoryId: number;
    nodeId: number;
    idcRackSlotId: number;
    status: number;
    appEnv: string;
    privNetIp: string;
    pubNetIp: string;
    mgmtPortIp: string;
    creator: string;
    isDeleted: number;
  }

  type TreeMigrate = {
    srcTreeId: number;
    targetIds: number[];
    serverIds: number[];
  }
}

declare namespace ServerResponse {
  type ServerInfo = {
    id: number;
    sn: number;
    hostname: string;
    type: number;
    suit: IdcResponse.IdcSuitInfo;
    powerInfo: string;
    powerCost: string;
    role: number;
    operator: number;
    provider: IdcResponse.IdcProviderInfo;
    factory: IdcResponse.IdcFactoryInfo;
    node: NodeResponse.NodeInfo;
    idcRackSlot: IdcResponse.IdcRackSlotInfo;
    productLines: any[],
    status: number;
    appEnv: string;
    appEnvDesc: string;
    systemType: string;
    systemVersion: string;
    systemArch: string;
    belongTo: string;
    belongToDesc: string;
    arrivalTime: string;
    overdueTime: string;
    privNetIp: string;
    privNetMask: string;
    privNetGw: string;
    pubNetIp: string;
    pubNetMask: string;
    pubNetGw: string;
    mgmtPortIp: string;
    mgmtPortMask: string;
    mgmtPortGw: string;
    comment: string;
    creator: string;
    isDeleted: number;
    createTime: string;
    updateTime: string;
  }

  type ServerTagInfo = {
    id: number;
    name: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }
}
