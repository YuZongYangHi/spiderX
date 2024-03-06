import {request} from 'umi';

export async function getIp(id: number) {
  return request<API.Response<AssetsIpResponse.Info>>(`/api/v1/assets/ip/${id}`, {
    method: "GET"
  })
}

export async function queryIpList(params: AssetsIpRequest.Filter) {
  return request<API.Response<AssetsIpResponse.Info[]>>(`/api/v1/assets/ip`, {
    method: "GET",
    params
  })
}

export async function deleteIp(id: number) {
  return request<API.Response<null>>(`/api/v1/assets/ip/${id}`, {
    method: "DELETE"
  });
}

export async function updateIp(id: number, data: AssetsIpRequest.Update) {
  return request<API.Response<AssetsIpResponse.Info>>(`/api/v1/assets/ip/${id}`, {
    method: "PUT",
    data
  });
}


export async function createIp(data: AssetsIpRequest.Create) {
  return request<API.Response<AssetsIpResponse.Info>>("/api/v1/assets/ip", {
    method: "POST",
    data
  })
}
