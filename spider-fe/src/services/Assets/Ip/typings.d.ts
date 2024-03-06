declare namespace AssetsIpRequest {
  type RelResource = {
    resourceId: number;
    resourceType: number;
  }

  type Filter = {
    ipRangeId: number;
    ip: string;
    netmask: string;
    gateway: string;
    type: number;
    version: number;
    env: number;
    status: number;
    operator: number;
  }

  type Create = {
    ipRangeId: number;
    ip: string;
    netmask: string;
    gateway: string;
    type: number;
    version: number;
    env: number;
    status: number;
    operator: number;
    description: string;
    relResource: RelResource[];
  }

  type Update = {
    gateway: string;
    type: number;
    env: number;
    status: number;
    operator: number;
    description: string;
    relResource: RelResource[];
  }
}

declare namespace AssetsIpResponse {
  type Info = {
    id: number;
    ipRangeId: number;
    ip: string;
    netmask: string;
    gateway: string;
    type: number;
    version: number;
    env: number;
    status: number;
    operator: number;
    relServerResources?: ServerResponse.ServerInfo[];
   // relSwitchResources
    description: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }
}
