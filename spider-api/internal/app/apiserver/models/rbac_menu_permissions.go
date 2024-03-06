package models

type menuPermissionModel struct{}

func (c *menuPermissionModel) ListUserPermission(user *User) (map[string]PermissionsAction, error) {
	menus, err := MenuModel.ListMenu()
	if err != nil {
		return nil, err
	}
	permissions := map[string]PermissionsAction{}
	for _, menu := range menus {
		if _, ok := permissions[menu.Key]; !ok {
			permissions[menu.Key] = PermissionsAction{}
			if user.IsAdmin {
				permissions[menu.Key] = AllPermissionsAction()
			} else {
				userPermission, _ := RBACMenuPermissionsUserModel.GetByMenuIdAndUserId(menu.Id, user.Id)
				groupPermission, _ := RBACMenuPermissionsGroupModel.GetByMenuIdAndGroupId(menu.Id, user.Group.Id)
				permissions[menu.Key] = c.MergeMenuPermissionByUserAndGroup(userPermission, groupPermission)
			}
		}
	}
	return permissions, nil
}

func (c *menuPermissionModel) MergeMenuPermissionByUserAndGroup(userPermission MenuPermissionsUser, groupPermission MenuPermissionsGroup) PermissionsAction {
	if groupPermission.Read {
		userPermission.Read = true
	}

	if groupPermission.Create {
		userPermission.Create = true
	}

	if groupPermission.Update {
		userPermission.Update = true
	}

	if groupPermission.Delete {
		userPermission.Delete = true
	}

	permission := PermissionsAction{
		Read:   userPermission.Read,
		Create: userPermission.Create,
		Update: userPermission.Update,
		Delete: userPermission.Delete,
	}
	return permission
}
