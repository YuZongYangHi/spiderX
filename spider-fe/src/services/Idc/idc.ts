import {request} from 'umi'

export async function queryAzList(params: any) {
  return request<API.Response<IdcResponse.AzInfo[]>>("/api/v1/idc/az", {
    method: "GET",
    params
  })
}

export async function multiDeleteAz(data: number[]) {
  return request<API.Response<null>>("/api/v1/idc/az/multiDelete", {
    method: "POST",
    data
  })
}

export async function multiImportAz(data: number[]) {
  return request<API.Response<null>>("/api/v1/idc/az/multiImport", {
    method: "POST",
    data
  })
}

export async function deleteAz(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/az/${id}`, {
    method: "DELETE",
  })
}

export async function updateAz(id: number, data: IdcRequest.AzUpdate) {
  return request<API.Response<null>>(`/api/v1/idc/az/${id}`, {
    method: "PUT",
    data
  })
}

export async function createAz(data: IdcRequest.AzCreate) {
  return request<API.Response<null>>("/api/v1/idc/az", {
    method: "POST",
    data
  })
}

export async function queryIdcList(params: any) {
  return request<API.Response<IdcResponse.IdcInfo[]>>("/api/v1/idc/idc", {
    method: "GET",
    params
  })
}


export async function deleteIdc(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/idc/${id}`, {
    method: "DELETE",
  })
}

export async function updateIdc(id: number, data: IdcRequest.IdcUpdate) {
  return request<API.Response<null>>(`/api/v1/idc/idc/${id}`, {
    method: "PUT",
    data
  })
}

export async function createIdc(data: IdcRequest.IdcCreate) {
  return request<API.Response<null>>("/api/v1/idc/idc", {
    method: "POST",
    data
  })
}

export async function queryIdcRoomList(params: any) {
  return request<API.Response<IdcResponse.IdcRoomInfo[]>>("/api/v1/idc/room", {
    method: "GET",
    params
  })
}


export async function deleteIdcRoom(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/room/${id}`, {
    method: "DELETE",
  })
}

export async function updateIdcRoom(id: number, data: IdcRequest.IdcRoomUpdate) {
  return request<API.Response<null>>(`/api/v1/idc/room/${id}`, {
    method: "PUT",
    data
  })
}

export async function createIdcRoom(data: IdcRequest.IdcRoomCreate) {
  return request<API.Response<null>>("/api/v1/idc/room", {
    method: "POST",
    data
  })
}

export async function queryIdcRackList(params: any) {
  return request<API.Response<IdcResponse.IdcRackInfo[]>>("/api/v1/idc/rack", {
    method: "GET",
    params
  })
}

export async function deleteIdcRack(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/rack/${id}`, {
    method: "DELETE",
  })
}

export async function updateIdcRack(id: number, data: IdcRequest.IdcRackUpdate) {
  return request<API.Response<null>>(`/api/v1/idc/rack/${id}`, {
    method: "PUT",
    data
  })
}

export async function createIdcRack(data: IdcRequest.IdcRackCreate) {
  return request<API.Response<null>>("/api/v1/idc/rack", {
    method: "POST",
    data
  })
}

export async function queryIdcRackSlotList(params: any) {
  return request<API.Response<IdcResponse.IdcRackSlotInfo[]>>("/api/v1/idc/rack/slot", {
    method: "GET",
    params
  })
}

export async function deleteIdcRackSlot(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/rack/slot/${id}`, {
    method: "DELETE",
  })
}

export async function updateIdcRackSlot(id: number, data: IdcRequest.IdcRackSlotUpdate) {
  return request<API.Response<null>>(`/api/v1/idc/rack/slot/${id}`, {
    method: "PUT",
    data
  })
}

export async function createIdcRackSlot(data: IdcRequest.IdcRackSlotCreate) {
  return request<API.Response<null>>("/api/v1/idc/rack/slot", {
    method: "POST",
    data
  })
}

export async function queryIdcFactoryList(params: any) {
  return request<API.Response<IdcResponse.IdcFactoryInfo[]>>("/api/v1/idc/factory", {
    method: "GET",
    params
  })
}

export async function deleteIdcFactory(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/factory/${id}`, {
    method: "DELETE",
  })
}

export async function updateIdcFactory(id: number, data: IdcRequest.IdcRackSlotUpdate) {
  return request<API.Response<null>>(`/api/v1/idc/factory/${id}`, {
    method: "PUT",
    data
  })
}

export async function createIdcFactory(data: IdcRequest.IdcRackSlotCreate) {
  return request<API.Response<null>>("/api/v1/idc/factory", {
    method: "POST",
    data
  })
}

export async function queryIdcProviderList(params: any) {
  return request<API.Response<IdcResponse.IdcProviderInfo[]>>("/api/v1/idc/provider", {
    method: "GET",
    params
  })
}

export async function deleteIdcProvider(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/provider/${id}`, {
    method: "DELETE",
  })
}

export async function updateIdcProvider(id: number, data: IdcRequest.IdcRackSlotUpdate) {
  return request<API.Response<null>>(`/api/v1/idc/provider/${id}`, {
    method: "PUT",
    data
  })
}

export async function createIdcProvider(data: IdcRequest.IdcRackSlotCreate) {
  return request<API.Response<null>>("/api/v1/idc/provider", {
    method: "POST",
    data
  })
}

export async function queryIdcSuitList(params: any) {
  return request<API.Response<IdcResponse.IdcSuitInfo[]>>("/api/v1/idc/suit", {
    method: "GET",
    params
  })
}

export async function deleteIdcSuit(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/suit/${id}`, {
    method: "DELETE",
  })
}

export async function updateIdcSuit(id: number, data: IdcRequest.IdcSuitUpdate) {
  return request<API.Response<null>>(`/api/v1/idc/suit/${id}`, {
    method: "PUT",
    data
  })
}

export async function createIdcSuit(data: IdcRequest.IdcSuitCreate) {
  return request<API.Response<null>>("/api/v1/idc/suit", {
    method: "POST",
    data
  })
}

export async function queryIdcSuitSeasonList(params: any) {
  return request<API.Response<IdcResponse.IdcSuitSeasonInfo[]>>("/api/v1/idc/suit/season", {
    method: "GET",
    params
  })
}

export async function deleteIdcSuitSeason(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/suit/season/${id}`, {
    method: "DELETE",
  })
}

export async function updateIdcSuitSeason(id: number, data: IdcRequest.IdcSuitCommonCreate) {
  return request<API.Response<null>>(`/api/v1/idc/suit/season/${id}`, {
    method: "PUT",
    data
  })
}

export async function createIdcSuitSeason(data: IdcRequest.IdcSuitCommonCreate) {
  return request<API.Response<null>>("/api/v1/idc/suit/season", {
    method: "POST",
    data
  })
}

export async function queryIdcSuitTypeList(params: any) {
  return request<API.Response<IdcResponse.IdcSuitTypeInfo[]>>("/api/v1/idc/suit/type", {
    method: "GET",
    params
  })
}

export async function deleteIdcSuitType(id: number) {
  return request<API.Response<null>>(`/api/v1/idc/suit/type/${id}`, {
    method: "DELETE",
  })
}

export async function updateIdcSuitType(id: number, data: IdcRequest.IdcSuitUpdate) {
  return request<API.Response<null>>(`/api/v1/idc/suit/type/${id}`, {
    method: "PUT",
    data
  })
}

export async function createIdcSuitType(data: IdcRequest.IdcSuitCreate) {
  return request<API.Response<null>>("/api/v1/idc/suit/type", {
    method: "POST",
    data
  })
}

export async function queryFullNameIdcRackSlot(name: string) {
  const params = {
    filter: `name=${name}`
  }
  return request<API.Response<any[]>>("/api/v1/idc/rack/slot/queryFullName", {
    method: "GET",
    params
  })
}
