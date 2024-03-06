import {request} from 'umi'

export async function queryNodeList(params: any) {
  return request<API.Response<NodeResponse.NodeInfo[]>>("/api/v1/assets/node", {
    method: "GET",
    params
  })
}

export async function queryNode(nodeId: number) {
  return request<API.Response<NodeResponse.NodeInfo>>(`/api/v1/assets/node/${nodeId}`, {
    method: "GET",
  })
}

export async function addNode(data: NodeRequest.CreateForm) {
  return request<API.Response<NodeResponse.NodeInfo>>("/api/v1/assets/node", {
    method: "POST",
    data
  });
}

export async function updateNode(id: number, data: NodeRequest.UpdateForm) {
  return request<API.Response<NodeResponse.NodeInfo>>(`/api/v1/assets/node/${id}`, {
    method: "PUT",
    data
  });
}

export async function deleteNode(id: number) {
  return request<API.Response<null>>(`/api/v1/assets/node/${id}`, {method: 'DELETE'})
}

export async function updateNodeStatus(id: number, data: NodeRequest.UpdateStatus) {
  return request<API.Response<NodeResponse.NodeInfo>>(`/api/v1/assets/node/${id}/status`, {
    method: "PUT",
    data
  });
}

export async function multiDelete(data: number[]) {
  return request<API.Response<NodeResponse.NodeInfo>>("/api/v1/assets/node/multiDelete", {
    method: "POST",
    data
  });
}

export async function multiImport(data: any) {
  return request<API.Response<NodeResponse.ImportInfo>>("/api/v1/assets/node/multiUpload", {
    method: "POST",
    data
  });
}
