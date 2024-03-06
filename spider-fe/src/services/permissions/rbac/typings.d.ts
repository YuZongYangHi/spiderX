declare namespace rbacAPIRequest {
  type ResourceAdd = {
    resource: string;
    verb: string;
    description: string;
  };

  type RoleAdd = {
    name: string;
    description: string;
  };
}

declare namespace rbacAPIResponse {
  type ResourceInfo = {
    id: number;
    resource: string;
    verb: string;
    description: string;
    owner: string;
    createTime: string;
    updateTime: string;
  }

  type RoleInfo = {
    id: number;
    name: string;
    owner: string;
    description: string;
    createTime: string;
    updateTime: string;
  }

  type RoleRelResourceInfo = {
    id: number;
    roleId: number;
    actionId: number;
    role: RoleInfo;
    action: ResourceInfo;
  }

  type RoleRelUserInfo = {
    id: number;
    roleBindingId: number;
    userId: number;
    createTime: string;
    updateTime: string;
    user: UserResponse.UserInfo
  }

  type RoleRelGroupInfo = {
    id: number;
    roleBindingId: number;
    userId: number;
    createTime: string;
    updateTime: string;
    group: GroupResponse.GroupInfo
  }

  type APIKeyInfo = {
    id: number;
    name: string;
    token: string;
    expireIn: number;
    description: string;
    roles: RoleInfo[];
    owner: string;
    createTime: string;
    updateTime: string;
  }
}
