/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */

interface Permissions {
  [key: string]: boolean
}

export const PermissionsAction = {
  Read: "read",
  Update: "update",
  Delete: "delete",
  Create: "create"
}

// 资产节点
export const assetsNodePermissionsMenuKeys: string[] = [
  "assets",
  "assets.nodes"
];

// 资产主机
export const assetsHostPermissionsMenuKeys: string[] = [
  "assets",
  "assets.hosts"
];

// IP段
export const assetsIpRangePermissionsMenuKeys: string[] = [
  "assets",
  "assets.ip.range"
];

// IP
export const assetsIpPermissionsMenuKeys: string[] = [
  "assets",
  "assets.ip"
];

// 网络设备
export const assetsNetDevicePermissionsMenuKeys: string[] = [
  "assets",
  "assets.net.device",
];

// 交换机
export const assetsNetDeviceSwitchPermissionsMenuKeys: string[] = [
  "assets",
  "assets.net.device",
  "assets.net.device.switch"
];

// 路由器
export const assetsNetDeviceRouterPermissionsMenuKeys: string[] = [
  "assets",
  "assets.net.device",
  "assets.net.device.router"
];

// 权限菜单
export const permissionsMenuListPermissionsMenuKeys: string[] = [
  "permissions",
  "permissions.menu",
  "permissions.menu.list"
]

// 权限菜单角色
export const permissionsMenuRolePermissionsMenuKeys: string[] = [
  "permissions",
  "permissions.menu",
  "permissions.menu.role",
]

// 权限菜单授权用户组
export const permissionsMenuGrantGroupPermissionsMenuKeys: string[] = [
  "permissions",
  "permissions.menu",
  "permissions.menu.grant",
  "permissions.menu.grant.group",
]

// 权限菜单授权用户
export const permissionsMenuGrantUserPermissionsMenuKeys: string[] = [
  "permissions",
  "permissions.menu",
  "permissions.menu.grant",
  "permissions.menu.grant.user",
]

// 权限菜单角色资源授权
export const permissionsMenuRoleResourceMenuKeys: string[] = [
  "permissions",
  "permissions.menu",
  "permissions.menu.role.grant.resource",
]

// 权限菜单角色权限授权用户组
export const permissionsMenuRoleAllocationGroupMenuKeys: string[] = [
  "permissions",
  "permissions.menu",
  "permissions.menu.role.allocation.group",
]

// 权限菜单角色权限授权用户
export const permissionsMenuRoleAllocationUserMenuKeys: string[] = [
  "permissions",
  "permissions.menu",
  "permissions.menu.role.allocation.user",
]

// 权限用户列表
export const permissionsUserMenuKeys: string[] = [
  "permissions",
  "permissions.user.list"
]

// 权限用户组列表
export const permissionsGroupMenuKeys: string[] = [
  "permissions",
  "permissions.group.list"
]

// 权限API资源列表
export const permissionsResourceMenuKeys: string[] = [
  "permissions",
  "permissions.resource.list"
]

// 权限API角色列表
export const permissionsRoleMenuKeys: string[] = [
  "permissions",
  "permissions.role.list"
]

// 权限API角色关联资源列表
export const permissionsRoleRelResourceMenuKeys: string[] = [
  "permissions",
  "permissions.role.rel.resource.list"
]

// 权限API角色授权用户组列表
export const permissionsRoleRelGroupMenuKeys: string[] = [
  "permissions",
  "permissions.role.rel.group.list"
]

// 权限API角色授权用户列表
export const permissionsRoleRelUserMenuKeys: string[] = [
  "permissions",
  "permissions.role.rel.user.list"
]

// 权限APIKey
export const permissionsAPIKeyMenuKeys: string[] = [
  "permissions",
  "permissions.apiKey.list"
]

// IDC AZ
export const permissionsIdcAzMenuKeys: string[] = [
  "idc",
  "idc.az"
]

export const permissionsIdcIdcMenuKeys: string[] = [
  "idc",
  "idc.idc"
]

export const permissionsIdcRoomMenuKeys: string[] = [
  "idc",
  "idc.room"
]

export const permissionsIdcRackMenuKeys: string[] = [
  "idc",
  "idc.rack"
]

export const permissionsIdcRackSlotMenuKeys: string[] = [
  "idc",
  "idc.rack.slot"
]

export const permissionsIdcFactoryMenuKeys: string[] = [
  "idc",
  "idc.factory"
]

export const permissionsIdcProviderMenuKeys: string[] = [
  "idc",
  "idc.provider"
]

export const permissionsIdcSuitMenuKeys: string[] = [
  "idc",
  "idc.suit"
]

export const permissionsIdcSuitSeasonMenuKeys: string[] = [
  "admin",
  "admin.suit.season"
]

export const permissionsIdcSuitTypeMenuKeys: string[] = [
  "admin",
  "admin.suit.type"
]

export const permissionAuditOperateMenuKeys: string[] = [
  "audit",
  "audit.operate"
]

export const permissionAuditLoginMenuKeys: string[] = [
  "audit",
  "audit.login"
]

export const adminTicketProductMenuKeys: string[] = [
  "admin",
  "admin.ticket.product"
]

export const adminTicketCategoryMenuKeys: string[] = [
  "admin",
  "admin.ticket.category"
]

export const adminTicketWorkflowStateMenuKeys: string[] = [
  "admin",
  "admin.TicketWorkflowState"
]

export const adminTicketWorkflowTransitionMenuKeys: string[] = [
  "admin",
  "admin.TicketWorkflowTransition"
]

export const adminTicketWorkflowFormMenuKeys: string[] = [
  "admin",
  "admin.TicketWorkflowForm"
]

export const adminTicketWorkflowWikiMenuKeys: string[] = [
  "admin",
  "admin.TicketWorkflowWiki"
]

export const ticketTodoList: string[] = [
  "ticket",
  "ticket.list.todo"
]

export const ticketApplyList: string[] = [
  "ticket",
  "ticket.list.apply"
]

export const ticketAllList: string[] = [
  "ticket",
  "ticket.list"
]

export const ticketDoneList: string[] = [
  "ticket",
  "ticket.list.done"
]

export const adminOnCallDrawLots: string[] = [
  "admin",
  "admin.oncall.drawLots"
]

const listUserMenuPermissions = (keys: RbacMenuResponse.Keys | undefined, allMenuKeys: RbacMenuResponse.Keys | undefined,):Permissions  => {
  if (!allMenuKeys) {
    return {};
  }
  const permissions: Permissions  = {};
  allMenuKeys.forEach((value: string)=> {
    permissions[value] = keys?.indexOf(value) !== -1 || false
  })
  return permissions
}

export const checkUserPagePermissions = (menuKeys: string[], useAccess: any): boolean => {
  let p = false;
  menuKeys.forEach(function (value:string) {
    if (useAccess[value] === true) {
      p = true
      return;
    }
  })
  return p;
}

export const checkUserMenuPermissions = (menuKeys: string[], action: string, menuPermissions?: RbacMenuResponse.UserPermissions | null): boolean => {
  if (!menuPermissions) {
    return false;
  }
  let p = false;
  // eslint-disable-next-line array-callback-return
  menuKeys.some((value: string) =>{
    let key = menuPermissions[value]
    if (!key) {
      return true
    }
    switch (action) {
      case PermissionsAction.Read:
        p = key.read
        break;
      case  PermissionsAction.Update:
        p = key.update;
        break
      case PermissionsAction.Delete:
        p = key.delete;
        break;
      case PermissionsAction.Create:
        p = key.create;
        break;
    }
    if (p) {
      return true;
    }
  })
  return p;
}

export const checkUserCreatePermissions = (menuKeys: string[], menuManager?: RbacMenuResponse.UserPermissions): boolean => {
  return checkUserMenuPermissions(menuKeys, PermissionsAction.Create, menuManager);
}

export const checkUserUpdatePermissions = (menuKeys: string[], menuManager?: RbacMenuResponse.UserPermissions): boolean => {
  return checkUserMenuPermissions(menuKeys, PermissionsAction.Update, menuManager);
}

export const checkUserDeletePermissions = (menuKeys: string[], menuManager?: RbacMenuResponse.UserPermissions): boolean => {
  return checkUserMenuPermissions(menuKeys, PermissionsAction.Delete, menuManager);
}

export const checkUserHavePageReadPermissions = (menuKeys: string[], pageManager: any, menuManager?: RbacMenuResponse.UserPermissions): boolean => {
  const pagePermissions = checkUserPagePermissions(menuKeys, pageManager);
  const menuPermissions = checkUserMenuPermissions(menuKeys, PermissionsAction.Read, menuManager);
  return (pagePermissions && menuPermissions) || false;
}

export default function access(initialState: { userMenuKeys?: RbacMenuResponse.Keys | undefined, allMenuKeys?: RbacMenuResponse.Keys | undefined } | undefined) {
  const { userMenuKeys, allMenuKeys } = initialState ?? {};
  return listUserMenuPermissions(userMenuKeys, allMenuKeys)
}
