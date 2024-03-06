import {request} from "@@/exports";

export async function queryAPIKeyList(params: any) {
  return request<API.Response<rbacAPIResponse.APIKeyInfo>>("/api/v1/permissions/apiKeys", {
    method: "GET",
    params
  });
}


export async function deleteAPIKey(id: number) {
  return request<API.Response<rbacAPIResponse.APIKeyInfo>>(`/api/v1/permissions/apiKeys/${id}`, {
    method: "DELETE"
  });
}

export async function createAPIKey(data: any) {
  return request<API.Response<rbacAPIResponse.APIKeyInfo>>("/api/v1/permissions/apiKeys", {
    method: "POST",
    data
  });
}
