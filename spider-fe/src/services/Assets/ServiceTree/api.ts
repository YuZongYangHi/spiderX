import {request} from 'umi'

export async function queryServiceTreeList() {
  return request<API.Response<ServiceTreeResponse.TreeInfo[]>>("/api/v1/assets/tree")
}

export async function deleteTreeResource(data: any) {
  return request<API.Response<null>>("/api/v1/assets/tree/delete", {
    method: "POST",
    data
  });
}

export async function createTreeResource(data: any) {
  return request<API.Response<null>>("/api/v1/assets/tree/create", {
    method: "POST",
    data
  });
}

export async function updateTreeResource(id: number, data: any) {
  return request<API.Response<null>>(`/api/v1/assets/tree/${id}`, {
    method: "PUT",
    data
  });
}

export async function migrateTree(data: any) {
  return request<API.Response<null>>("/api/v1/assets/tree/migrate", {
    method: "POST",
    data
  });
}
