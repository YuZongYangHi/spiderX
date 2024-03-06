package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
	"k8s.io/klog/v2"
)

func RoleRelGroupList(c echo.Context) error {
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

	s := NewAPIRoleRelGroupSerializer()
	s.Filter["role_binding_id"] = roleBinding.Id
	b := base.NewSerializersManager(c, s)
	response, err := b.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}

	return base.Response(c, 200, response)
}

func RoleRelGroupDelete(c echo.Context) error {
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

	if err = models.RBACAPIRoleBindingGroupModel.DeleteById(id); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func RoleRelGroupCreate(c echo.Context) error {
	RoleResourceManager := services.NewRoleResourcePermissionsAllocation(c, services.NewAPIRoleRelGroup())
	result, err := RoleResourceManager.Create()
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, result)
}

func RoleRelAvailableGroups(c echo.Context) error {
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

	var groupIds []int64
	for _, r := range rb {
		for _, group := range r.Groups {
			groupIds = append(groupIds, group.Id)
		}
	}

	var groups []models.Group
	if len(groupIds) == 0 {
		groups, err = models.GroupModel.List()
	} else {
		groups, err = models.GroupModel.NotIn(groupIds)
	}

	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, groups)
}
