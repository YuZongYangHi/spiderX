// @ts-ignore
/* eslint-disable */

declare namespace MenuRequest {
  type AddMenu = {
    name: string;
    key: string;
    parentId: number;
  }
}

declare namespace MenuResponse {
  type MenuInfo = {
    id: number;
    name: string;
    key: string;
    parentId: number;
    createTime: string;
    updateTime: string;
    children: MenuInfo[]
  };

  type MenuGrantUserInfo = {
    id: number;
    menuId: number;
    userId: number;
    user: UserResponse.UserInfo;
    menu: MenuInfo;
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  }

  type MenuGrantGroupInfo = {
    id: number;
    menuId: number;
    groupId: number;
    group: GroupResponse.GroupInfo;
    user: UserResponse.UserInfo;
    menu: MenuInfo;
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  }

  type MenuRoleInfo = {
    id: number;
    name: string;
    description: string;
    createTime: string;
    updateTime: string;
  }
}

declare namespace MenuPermissionsForm {
  type GrantGroupUpdate = {
    menuName: string;
    groupName: string;
    menuKey: string;
    read: boolean;
    update: boolean;
    create: boolean;
    delete: boolean;
  }
}

declare namespace MenuRoleResourceResponse {
  type MenuRole = {
    id: number;
    name: string;
  }
  type Menu = {
    id: number;
    name: string;
    key: string;

  }
  type ResourceInfo = {
    id: number;
    role: MenuRole;
    menu: Menu;
    createTime: string;
    updateTime: string;
  }
}

declare namespace MenuRoleAllocationResponse {
  type GroupInfo = {
    id: number;
    roleBindingId: number;
    createTime: string;
    updateTime: string;
    group: GroupResponse.GroupInfo;
  }

  type UserInfo = {
    id: number;
    roleBindingId: number;
    createTime: string;
    updateTime: string;
    user: UserResponse.UserInfo;
  }
}
