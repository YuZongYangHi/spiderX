import {request} from '@umijs/max';

export async function queryAPIRoleList(params: any) {
  return request<API.Response<rbacAPIResponse.RoleInfo>>("/api/v1/permissions/roles", {
    method: "GET",
    params
  });
}


export async function deleteAPIRole(roleId: number) {
  return request<API.Response<rbacAPIResponse.RoleInfo>>(`/api/v1/permissions/roles/${roleId}`, {
    method: "DELETE"
  });
}

export async function updateAPIRole(roleId: string, data: rbacAPIRequest.RoleAdd) {
  return request<API.Response<rbacAPIResponse.RoleInfo>>(`/api/v1/permissions/roles/${roleId}`, {
    method: "PUT",
    data
  });
}


export async function createAPIRole(data: rbacAPIRequest.RoleAdd) {
  return request<API.Response<rbacAPIResponse.RoleInfo>>("/api/v1/permissions/roles", {
    method: "POST",
    data
  });
}
