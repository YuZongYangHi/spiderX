declare namespace AssetsIpRangeRequest {
  type Create = {
    cidr: string;
    env: number;
    version: number;
    status: number;
    operator: number;
    nodeId: number;
    netDomain: number;
    description: string;
    type: number;
    gateway: string;
  }

  type Update = {
    cidr: string;
    env: number;
    status: number;
    operator: number;
    nodeId: number;
    netDomain: number;
    description: string;
    type: number;
    gateway: string;
  }

  type Filter = {
    cidr: string;
    env: number;
    version: number;
    status: number;
    operator: number;
    nodeId: number;
  }
}

declare namespace AssetsIpRangeResponse {
  type Info = {
    id: number;
    cidr: string;
    version: number;
    status: number;
    operator: number;
    nodeId: number;
    node: NodeResponse.NodeInfo;
    Ip: AssetsIpResponse.Info[];
    netDomain: number;
    description: string;
    type: number;
    creator: string;
    createTime: string;
    updateTime: string;
    gateway: string;
  }
}
