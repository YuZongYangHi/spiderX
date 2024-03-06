import { request } from '@umijs/max';

export async function UserLogin(data: UserRequest.UserLogin) {
  return request<API.Response<UserResponse.UserLogin>>("/api/v1/users/login", {
    method: "POST",
    data
  });
}

export async function UserLogout(){
  return request<API.Response<null>>("/api/v1/users/logout");
}

export async function queryUserInfo(){
  return request<API.Response<UserResponse.UserInfo>>("/api/v1/users/currentUser");
}

export async function queryUserList(params: any) {
  return request<API.Response<UserResponse.UserInfo>>("/api/v1/permissions/users", {
    method: "GET",
    params
  });
}


export async function deleteUser(userId: string) {
  return request<API.Response<UserResponse.UserInfo>>(`/api/v1/permissions/users/${userId}`, {
    method: "DELETE"
  });
}

export async function updateUser(userId: string, data: any) {
  return request<API.Response<UserResponse.UserInfo>>(`/api/v1/permissions/users/${userId}`, {
    method: "PUT",
    data
  });
}


export async function createUser(data: any) {
  return request<API.Response<UserResponse.UserInfo>>("/api/v1/permissions/users", {
    method: "POST",
    data
  });
}
