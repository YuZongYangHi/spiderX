import { request } from '@umijs/max';

export async function queryGroupAll() {
  return request<API.Response<GroupResponse.GroupInfo>>("/api/v1/permissions/groups/all")
}


export async function queryGroupList(params: any) {
  return request<API.Response<GroupResponse.GroupInfo>>("/api/v1/permissions/groups", {
    method: "GET",
    params
  });
}


export async function deleteGroup(groupId: number) {
  return request<API.Response<GroupResponse.GroupInfo>>(`/api/v1/permissions/groups/${groupId}`, {
    method: "DELETE"
  });
}

export async function updateGroup(groupId: string, data: any) {
  return request<API.Response<GroupResponse.GroupInfo>>(`/api/v1/permissions/groups/${groupId}`, {
    method: "PUT",
    data
  });
}


export async function createGroup(data: any) {
  return request<API.Response<GroupResponse.GroupInfo>>("/api/v1/permissions/groups", {
    method: "POST",
    data
  });
}
