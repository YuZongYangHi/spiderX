import {request} from "umi";

export async function queryMachineSummary() {
  return request<API.Response<AnalysisResponse.MachineInfo>>("/api/v1/summary/machine")
}


export async function queryIdcSummary() {
  return request<API.Response<AnalysisResponse.IdcInfo>>("/api/v1/summary/idc")
}

export async function queryNetSwitchSummary() {
  return request<API.Response<AnalysisResponse.NetDeviceInfo>>("/api/v1/summary/netDevice")
}


export async function queryTicketSummary() {
  return request<API.Response<AnalysisResponse.TicketInfo[]>>("/api/v1/summary/ticket")
}
