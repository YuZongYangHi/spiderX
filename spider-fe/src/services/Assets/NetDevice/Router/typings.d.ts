declare namespace AssetsNetDeviceRouterRequest {

  type Filter = {
    status: number;
    sn: string;
    rackSlotId: number;
    factoryId: number;
    ipNetId: number;
    nodeId: number;
    type: number;
    name: string;
  }

  type Create = {
    ipNetId: number;
    sn: string;
    rackSlotId: number;
    factoryId: number;
    nodeId: number;
    name: string;
    username: string;
    password: string;
    description: string;
    status: number;
  }

  type Update = {
    ipNetId: number;
    sn: string;
    rackSlotId: number;
    factoryId: number;
    nodeId: number;
    type: number;
    name: string;
    username: string;
    password: string;
    description: string;
    status: number;
  }
}

declare namespace AssetsNetDeviceRouterResponse {
  type Info = {
    ip: AssetsIpResponse.Info;
    node: NodeResponse.NodeInfo;
    factory: IdcResponse.IdcFactoryInfo;
    rackSlot: IdcResponse.IdcRackSlotInfo;
    ipNetId: number;
    sn: string;
    rackSlotId: number;
    factoryId: number;
    nodeId: number;
    type: number;
    name: string;
    username: string;
    password: string;
    status: number;
    description: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }
}
