import {request} from 'umi'

export async function queryAuditOperateLog(id: number, params: any) {
  return request<API.Response<AuditResponse.OperateLog[]>>(`/api/v1/audit/${id}/operateLog`, {
    method: "GET",
    params
  })
}

export async function queryAuditOperateList(params: any) {
  return request<API.Response<AuditResponse.OperateLog[]>>(`/api/v1/audit/operate`, {
    method: "GET",
    params
  })
}

export async function queryAuditUserLoginList(params: any) {
  return request<API.Response<AuditResponse.AuditUserLoginInfo[]>>(`/api/v1/audit/login`, {
    method: "GET",
    params
  })
}
