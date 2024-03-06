import {request} from 'umi';

export async function getIpRange(id: number) {
  return request<API.Response<AssetsIpRangeResponse.Info>>(`/api/v1/assets/ipRange/${id}`, {
    method: "GET"
  })
}

export async function queryIpRangeList(params: AssetsIpRangeRequest.Filter) {
  return request<API.Response<AssetsIpRangeResponse.Info[]>>(`/api/v1/assets/ipRange`, {
    method: "GET",
    params
  })
}


export async function deleteIpRange(id: number) {
  return request<API.Response<null>>(`/api/v1/assets/ipRange/${id}`, {
    method: "DELETE"
  });
}

export async function updateIpRange(id: number, data: AssetsIpRangeRequest.Update) {
  return request<API.Response<AssetsIpRangeResponse.Info>>(`/api/v1/assets/ipRange/${id}`, {
    method: "PUT",
    data
  });
}


export async function createIpRange(data: AssetsIpRangeRequest.Create) {
  return request<API.Response<AssetsIpRangeResponse.Info>>("/api/v1/assets/ipRange", {
    method: "POST",
    data
  })
}
