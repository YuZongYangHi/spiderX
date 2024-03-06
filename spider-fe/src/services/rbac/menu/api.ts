import {request} from '@umijs/max';

export function fetchUserMenuList() {
  return request<API.Response<RbacMenuResponse.Keys>>("/api/v1/rbac/menu/list");
}

export function fetchUserMenuPermissions() {
  return request<API.Response<RbacMenuResponse.UserPermissions>>("/api/v1/rbac/menu/permissions");
}

export function fetchAllMenuKeysList() {
  return request<API.Response<RbacMenuResponse.Keys>>("/api/v1/rbac/menu/listAll");
}
