import {request} from '@umijs/max';

export async function queryAPIResourceList(params: any) {
  return request<API.Response<rbacAPIResponse.ResourceInfo>>("/api/v1/permissions/actions", {
    method: "GET",
    params
  });
}


export async function deleteAPIResource(actionId: number) {
  return request<API.Response<rbacAPIResponse.ResourceInfo>>(`/api/v1/permissions/actions/${actionId}`, {
    method: "DELETE"
  });
}

export async function updateAPIResource(actionId: string, data: rbacAPIRequest.ResourceAdd) {
  return request<API.Response<rbacAPIResponse.ResourceInfo>>(`/api/v1/permissions/actions/${actionId}`, {
    method: "PUT",
    data
  });
}


export async function createAPIResource(data: rbacAPIRequest.ResourceAdd) {
  return request<API.Response<rbacAPIResponse.ResourceInfo>>("/api/v1/permissions/actions", {
    method: "POST",
    data
  });
}
