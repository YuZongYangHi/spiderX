import {request} from "@@/exports";
import {
  MenuRequest,
  MenuResponse,
  MenuRoleAllocationResponse,
  MenuRoleResourceResponse
} from "@/services/permissions/menu/typings";

export async function MenuList(){
  return request<API.Response<MenuResponse.MenuInfo[]>>("/api/v1/permissions/menu");
}

export async function AddMenu(data: MenuRequest.AddMenu){
  return request<API.Response<MenuRequest.AddMenu[]>>("/api/v1/permissions/menu", {
    method: "POST",
    data
  });
}

export async function DelMenu(id: number){
  return request<API.Response<null>>(`/api/v1/permissions/menu/${id}`, {
    method: "DELETE"
  });
}

export async function UpdateMenu(id: number, data: MenuResponse.MenuInfo){
  return request<API.Response<null>>(`/api/v1/permissions/menu/${id}`, {
    method: "PUT",
    data
  });
}


// 菜单授权用户组相关
export async function MenuGrantGroupPermissionsList(menuId: number, params: any){
  return request<API.Response<MenuResponse.MenuGrantUserInfo[]>>(`/api/v1/permissions/menu/${menuId}/grant/group`, {params});
}

export async function MenuGrantGroupPermissionsDelete(menuId: number, permissionsId: number){
  return request<API.Response<null>>(`/api/v1/permissions/menu/${menuId}/grant/group/${permissionsId}`, {
    method: "DELETE"
  });
}

export async function MenuGrantGroupPermissionsUpdate(menuId: number, permissionsId: number, data: Permissions.Action){
  return request<API.Response<null> | undefined>(`/api/v1/permissions/menu/${menuId}/grant/group/${permissionsId}`, {
    method: "PUT",
    data
  });
}

export async function MenuGrantGroupPermissionsCreate(menuId: number, data: any) {
  return request<API.Response<null> | undefined>(`/api/v1/permissions/menu/${menuId}/grant/group`, {
    method: "POST",
    data
  });
}

// 菜单授权用户相关
export async function MenuGrantUserPermissionsList(menuId: number, params: any){
  return request<API.Response<MenuResponse.MenuGrantUserInfo[]>>(`/api/v1/permissions/menu/${menuId}/grant/user`, {params});
}

export async function MenuGrantUserPermissionsUpdate(menuId: number, permissionsId: number, data: Permissions.Action){
  return request<API.Response<null> | undefined>(`/api/v1/permissions/menu/${menuId}/grant/user/${permissionsId}`, {
    method: "PUT",
    data
  });
}

export async function MenuGrantUserPermissionsDelete(menuId: number, permissionsId: number){
  return request<API.Response<null>>(`/api/v1/permissions/menu/${menuId}/grant/user/${permissionsId}`, {
    method: "DELETE"
  });
}

export async function MenuGrantUserPermissionsCreate(menuId: number, data: any) {
  return request<API.Response<null> | undefined>(`/api/v1/permissions/menu/${menuId}/grant/user`, {
    method: "POST",
    data
  });
}


// 根据菜单ID获取还可以创建的用户组
export async function MenuGrantGroupList(menuId: string){
  return request<API.Response<GroupResponse.GroupInfo[]>>(`/api/v1/permissions/menu/${menuId}/groups`);
}

// 根据菜单ID获取还可以创建的用户
export async function MenuGrantUserList(menuId: number){
  return request<API.Response<UserResponse.UserInfo[]>>(`/api/v1/permissions/menu/${menuId}/users`);
}

// 菜单角色相关
export async function MenuRoleList(params: any){
  return request<API.Response<MenuResponse.MenuRoleInfo[]>>(`/api/v1/permissions/menu/role`, {params});
}

export async function MenuRoleUpdate(roleId: number, data: Permissions.Action){
  return request<API.Response<null> | undefined>(`/api/v1/permissions/menu/role/${roleId}`, {
    method: "PUT",
    data
  });
}

export async function MenuRoleDelete(roleId: number){
  return request<API.Response<null>>(`/api/v1/permissions/menu/role/${roleId}`, {
    method: "DELETE"
  });
}

export async function MenuRoleCreate(data: any) {
  return request<API.Response<null> | undefined>(`/api/v1/permissions/menu/role`, {
    method: "POST",
    data
  });
}

// 菜单角色资源
export async function MenuRoleResourceList(roleId: number, params: any){
  return request<API.Response<MenuRoleResourceResponse.ResourceInfo[]>>(`/api/v1/permissions/menu/role/${roleId}/resource`, {
    method: "GET",
    params
  });
}

export async function MenuRoleResourceDelete(roleId: number, resourceId: number){
  return request<API.Response<null>>(`/api/v1/permissions/menu/role/${roleId}/resource/${resourceId}`, {
    method: "DELETE"
  });
}

export async function MenuRoleResourceCreate(roleId: number, data: any) {
  return request<API.Response<null> | undefined>(`/api/v1/permissions/menu/role/${roleId}/resource`, {
    method: "POST",
    data
  });
}

export async function MenuRoleResourceMenusList(roleId: number){
  return request<API.Response<MenuResponse.MenuInfo[]>>(`/api/v1/permissions/menu/role/${roleId}/resource/menus`);
}

// 菜单角色授权
export async function MenuRoleAllocationGroupList(roleId: number, params: any){
  return request<API.Response<MenuRoleAllocationResponse.GroupInfo[]>>(`/api/v1/permissions/menu/role/${roleId}/allocation/group`, {
    method: "GET",
    params
  });
}

export async function MenuRoleAllocationGroupDelete(roleId: number, id: number){
  return request<API.Response<null>>(`/api/v1/permissions/menu/role/${roleId}/allocation/group/${id}`, {
    method: "DELETE"
  });
}

export async function MenuRoleAllocationGroupCreate(roleId: number, data: any) {
  return request<API.Response<null> | undefined>(`/api/v1/permissions/menu/role/${roleId}/allocation/group`, {
    method: "POST",
    data
  });
}

export async function MenuRoleAllocationAvailableGroupList(roleId: number){
  return request<API.Response<GroupResponse.GroupInfo[]>>(`/api/v1/permissions/menu/role/${roleId}/allocation/group/available`, {
    method: "GET",
  });
}

// 菜单角色授权用户组
export async function MenuRoleAllocationUserList(roleId: number, params: any){
  return request<API.Response<MenuRoleAllocationResponse.UserInfo[]>>(`/api/v1/permissions/menu/role/${roleId}/allocation/user`, {
    method: "GET",
    params
  });
}

export async function MenuRoleAllocationUserDelete(roleId: number, id: number){
  return request<API.Response<null>>(`/api/v1/permissions/menu/role/${roleId}/allocation/user/${id}`, {
    method: "DELETE"
  });
}

export async function MenuRoleAllocationUserCreate(roleId: number, data: any) {
  return request<API.Response<null> | undefined>(`/api/v1/permissions/menu/role/${roleId}/allocation/user`, {
    method: "POST",
    data
  });
}

export async function MenuRoleAllocationAvailableUserList(roleId: number){
  return request<API.Response<UserResponse.UserInfo[]>>(`/api/v1/permissions/menu/role/${roleId}/allocation/user/available`, {
    method: "GET",
  });
}

