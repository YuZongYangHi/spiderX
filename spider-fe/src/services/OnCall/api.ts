import {request} from 'umi';

export async function queryOnCallList(month: string) {
  const params = {
    month
  }
  return request<API.Response<OnCallResponse.OnCallInfo[]>>("/api/v1/oncall/list", {
    method: "GET",
    params
  })
}

export async function exchangeOnCall(data: OnCallRequest.Exchange) {
  return request<API.Response<OnCallResponse.ExchangeInfo>>("/api/v1/oncall/exchange", {
    method: "POST",
    data
  })
}


export async function queryOnCallDrawLotsList(params: any) {
  return request<API.Response<OnCallResponse.DrawLotsInfo[]>>("/api/v1/oncall/drawLots", {
    method: "GET",
    params
  })
}


export async function DestroyOnCallDrawLots(id: number) {
  return request<API.Response<null>>(`/api/v1/oncall/drawLots/${id}`, {
    method: "DELETE",
  })
}

export async function UpdateOnCallDrawLots(id: number, data: OnCallRequest.UpdateDrawLots) {
  return request<API.Response<OnCallResponse.DrawLotsInfo>>(`/api/v1/oncall/drawLots/${id}`, {
    method: "PUT",
    data
  })
}

export async function CreateOnCallDrawLots(data: OnCallRequest.UpdateDrawLots) {
  return request<API.Response<OnCallResponse.DrawLotsInfo>>("/api/v1/oncall/drawLots", {
    method: "POST",
    data
  })
}
