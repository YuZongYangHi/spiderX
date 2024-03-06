import {request} from 'umi';

export async function getSwitch(id: number) {
  return request<API.Response<AssetsNetDeviceSwitchResponse.Info>>(`/api/v1/assets/switch/${id}`, {
    method: "GET"
  })
}

export async function querySwitchList(params: AssetsNetDeviceSwitchRequest.Filter) {
  return request<API.Response<AssetsNetDeviceSwitchResponse.Info[]>>(`/api/v1/assets/switch`, {
    method: "GET",
    params
  })
}

export async function deleteSwitch(id: number) {
  return request<API.Response<null>>(`/api/v1/assets/switch/${id}`, {
    method: "DELETE"
  });
}

export async function updateSwitch(id: number, data: AssetsNetDeviceSwitchRequest.Update) {
  return request<API.Response<AssetsNetDeviceSwitchResponse.Info>>(`/api/v1/assets/switch/${id}`, {
    method: "PUT",
    data
  });
}


export async function createSwitch(data: AssetsNetDeviceSwitchRequest.Create) {
  return request<API.Response<AssetsNetDeviceSwitchResponse.Info>>("/api/v1/assets/switch", {
    method: "POST",
    data
  })
}
