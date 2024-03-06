// @ts-ignore
/* eslint-disable */
declare namespace RbacMenuResponse {
  type Keys = string[]

  type PermissionsAction = {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  type UserPermissions = {
    [key: string]: PermissionsAction;
  };
}
