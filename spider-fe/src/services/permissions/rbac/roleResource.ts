import {request} from '@umijs/max';

export async function queryAPIRoleRelResourceList(roleId: number, params: any) {
  return request<API.Response<rbacAPIResponse.RoleRelResourceInfo>>(`/api/v1/permissions/roles/${roleId}/resources`, {
    method: "GET",
    params
  });
}


export async function deleteAPIRoleRelResource(roleId: number, resourceId: number) {
  return request<API.Response<rbacAPIResponse.RoleRelResourceInfo>>(`/api/v1/permissions/roles/${roleId}/resources/${resourceId}`, {
    method: "DELETE"
  });
}

export async function createAPIRoleRelResource(roleId: number, data: rbacAPIRequest.ResourceAdd) {
  return request<API.Response<rbacAPIResponse.RoleRelResourceInfo>>(`/api/v1/permissions/roles/${roleId}/resources`, {
    method: "POST",
    data
  });
}

export async function queryAPIRoleRelAvailableResourceList(roleId: number) {
  return request<API.Response<rbacAPIResponse.ResourceInfo>>(`/api/v1/permissions/roles/${roleId}/available/resources`, {
    method: "GET"
  });
}
