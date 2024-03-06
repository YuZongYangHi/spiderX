// @ts-ignore
/* eslint-disable */
declare namespace UserRequest {
  type UserLogin = {
    username: string;
    password: string;
  };
}

declare namespace UserResponse {
  type UserLogin = {
    userId: string;
    expireTime: string;
    timestamp: number;
    key: string;
    value: string;
  };

  type UserInfo = {
    id: number;
    userId: string;
    username: string;
    name: string;
    email: string;
    photo: string;
    password: string;
    lastLoginTime?: string;
    lastLoginIp?: string;
    group: GroupResponse.GroupInfo;
    isAdmin: boolean;
    isActive: boolean;
    isDelete: boolean;
    createTime: string;
    updateTime: string;
  }
}

