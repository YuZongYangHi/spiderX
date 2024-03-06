import {request} from 'umi';

export async function GetRouter(id: number) {
  return request<API.Response<AssetsNetDeviceRouterResponse.Info>>(`/api/v1/assets/router/${id}`, {
    method: "GET"
  })
}

export async function queryRouterList(params: AssetsNetDeviceRouterRequest.Filter) {
  return request<API.Response<AssetsNetDeviceRouterResponse.Info[]>>(`/api/v1/assets/router`, {
    method: "GET",
    params
  })
}

export async function deleteRouter(id: number) {
  return request<API.Response<null>>(`/api/v1/assets/router/${id}`, {
    method: "DELETE"
  });
}

export async function updateRouter(id: number, data: AssetsNetDeviceRouterRequest.Update) {
  return request<API.Response<AssetsNetDeviceRouterResponse.Info>>(`/api/v1/assets/router/${id}`, {
    method: "PUT",
    data
  });
}


export async function createRouter(data: AssetsNetDeviceRouterRequest.Create) {
  return request<API.Response<AssetsNetDeviceRouterResponse.Info>>("/api/v1/assets/router", {
    method: "POST",
    data
  })
}
