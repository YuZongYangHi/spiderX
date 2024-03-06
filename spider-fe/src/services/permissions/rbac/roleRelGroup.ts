import {request} from "@@/exports";

export async function queryAPIRoleRelGroupList(roleId: number, params: any) {
  return request<API.Response<rbacAPIResponse.RoleRelGroupInfo>>(`/api/v1/permissions/roles/${roleId}/groups`, {
    method: "GET",
    params
  });
}


export async function deleteAPIRoleRelGroup(roleId: number, id: number) {
  return request<API.Response<rbacAPIResponse.RoleRelGroupInfo>>(`/api/v1/permissions/roles/${roleId}/groups/${id}`, {
    method: "DELETE"
  });
}

export async function createAPIRoleRelGroup(roleId: number, data: any) {
  return request<API.Response<rbacAPIResponse.RoleRelGroupInfo>>(`/api/v1/permissions/roles/${roleId}/groups`, {
    method: "POST",
    data
  });
}

export async function queryAPIRoleRelGroupAvailableList(roleId: number) {
  return request<API.Response<GroupResponse.GroupInfo>>(`/api/v1/permissions/roles/${roleId}/available/groups`, {
    method: "GET"
  });
}
