import {request} from 'umi'

export async function queryServerByTreeId(treeId: number, params: ServerRequest.FilterParams) {
  return request<API.Response<ServerResponse.ServerInfo[]>>(`/api/v1/assets/tree/${treeId}/server`, {
    method: "GET",
    params
  })
}


export async function deleteServer(serverId: number) {
  return request<API.Response<null>>(`/api/v1/assets/server/${serverId}`, {
    method: "DELETE"
  });
}

export async function updateServer(serverId: string, data: ServerRequest.UpdateServer) {
  return request<API.Response<ServerResponse.ServerInfo>>(`/api/v1/assets/server/${serverId}`, {
    method: "PUT",
    data
  });
}


export async function createServer(data: ServerRequest.CreateServer) {
  return request<API.Response<ServerResponse.ServerInfo>>("/api/v1/assets/server", {
    method: "POST",
    data
  });
}

export async function multiDeleteServer(data: any) {
  return request<API.Response<null>>("/api/v1/assets/server/multiDelete", {
    method: "POST",
    data
  });
}

export async function multiUploadServer(treeId: number, data: any) {
  return request<API.Response<null>>(`/api/v1/assets/server/${treeId}/multiUpload`, {
    method: "POST",
    data
  });
}

export async function queryServerById(serverId: number) {
  return request<API.Response<ServerResponse.ServerInfo>>(`/api/v1/assets/server/${serverId}`, {
    method: "GET",
  })
}

export async function ServerTreeMigrate(data: ServerRequest.TreeMigrate) {
  return request<API.Response<null>>(`/api/v1/assets/server/tree/migrate`, {
    method: "POST",
    data
  });
}

export async function queryTags(params: any) {
  return request<API.Response<ServerResponse.ServerTagInfo>>(`/api/v1/assets/server/tag`, {
    method: "GET",
    params
  })
}
