package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
	"k8s.io/klog/v2"
)

func RoleRelUserList(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}
	role, err := models.RBACAPIRoleModel.GetById(roleId)
	if err != nil || role.Id == 0 {
		return base.BadRequestResponse(c, "")
	}
	roleBinding, err := models.RBACAPIRoleBindingModel.GetByRoleId(roleId)
	if err != nil || roleBinding.Id == 0 {
		return base.SuccessResponse(c, nil)
	}

	s := NewAPIRoleRelUserSerializer()
	s.Filter["role_binding_id"] = roleBinding.Id
	b := base.NewSerializersManager(c, s)
	response, err := b.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	return base.Response(c, 200, response)
}

func RoleRelUserDelete(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}

	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	role, err := models.RBACAPIRoleModel.GetById(roleId)
	if err != nil || role.Id == 0 {
		return base.BadRequestResponse(c, "")
	}

	if err = models.RBACAPIRoleBindingUserModel.DeleteById(id); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func RoleRelUserCreate(c echo.Context) error {
	RoleResourceManager := services.NewRoleResourcePermissionsAllocation(c, services.NewAPIRoleRelUser())
	result, err := RoleResourceManager.Create()
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, result)
}

func RoleRelAvailableUsers(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	role, err := models.RBACAPIRoleModel.GetById(roleId)
	if role.Id == 0 || err != nil {
		klog.Errorf("rbac api role does not exist")
		return base.BadRequestResponse(c, "")
	}

	rb, err := models.RBACAPIRoleBindingModel.ListByRoleId(roleId)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	var userIds []int64
	for _, r := range rb {
		for _, user := range r.Users {
			userIds = append(userIds, user.Id)
		}
	}

	var users []models.User
	if len(userIds) == 0 {
		users, err = models.UserModel.List()
	} else {
		users, err = models.UserModel.NotIn(userIds)
	}

	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, users)
}
