import {request} from "@@/exports";

export async function queryAPIRoleRelUserList(roleId: number, params: any) {
  return request<API.Response<rbacAPIResponse.RoleRelUserInfo>>(`/api/v1/permissions/roles/${roleId}/users`, {
    method: "GET",
    params
  });
}


export async function deleteAPIRoleRelUser(roleId: number, id: number) {
  return request<API.Response<rbacAPIResponse.RoleRelUserInfo>>(`/api/v1/permissions/roles/${roleId}/users/${id}`, {
    method: "DELETE"
  });
}

export async function createAPIRoleRelUser(roleId: number, data: any) {
  return request<API.Response<rbacAPIResponse.RoleRelUserInfo>>(`/api/v1/permissions/roles/${roleId}/users`, {
    method: "POST",
    data
  });
}

export async function queryAPIRoleRelUserAvailableList(roleId: number) {
  return request<API.Response<UserResponse.UserInfo>>(`/api/v1/permissions/roles/${roleId}/available/users`, {
    method: "GET"
  });
}
