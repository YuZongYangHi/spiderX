package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"k8s.io/klog/v2"
)

func RoleResourceList(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("roleId")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}
	s := NewAPIRoleResourceSerializer()
	s.Filter["role_id"] = id
	serializer := base.NewSerializersManager(c, s)
	result, err := serializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, result)
}

func RoleResourceCreate(c echo.Context) error {
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

	var payload forms.APIRoleResourceForm
	valid := base.NewValidator(c)
	if err = valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, "")
	}

	resource, err := models.RBACAPIActionModel.GetById(payload.ResourceId)
	if err != nil || resource.Id == 0 {
		klog.Errorf("rbac api action does not exist")
		return base.BadRequestResponse(c, "")
	}

	rb, _ := models.RBACAPIRoleRelResourceModel.GetByRoleIdByResourceId(roleId, payload.ResourceId)
	if rb.Id > 0 {
		klog.Errorf("rbac api action existed")
		return base.BadRequestResponse(c, "")
	}

	m := &models.APIRoleRelAction{
		RoleId:   roleId,
		ActionId: payload.ResourceId,
	}

	if err = models.RBACAPIRoleRelResourceModel.Add(m); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, m)
}

func RoleResourceDelete(c echo.Context) error {
	cc := c.(*base.Context)
	roleId := cc.ParseInt("roleId")
	if roleId == 0 {
		return base.BadRequestResponse(c, "")
	}

	resourceId := cc.ParseInt("resourceId")
	if resourceId == 0 {
		return base.BadRequestResponse(c, "")
	}

	if err := models.RBACAPIRoleRelResourceModel.DeleteByRoleIdByResourceId(roleId, resourceId); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func RoleRelAvailableResourceList(c echo.Context) error {
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

	rb, err := models.RBACAPIRoleRelResourceModel.ListByRoleId(roleId)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	var resourceIds []int64
	for _, r := range rb {
		resourceIds = append(resourceIds, r.ActionId)
	}

	var resources []models.APIAction

	if len(resourceIds) == 0 {
		resources, err = models.RBACAPIActionModel.List()
	} else {
		resources, err = models.RBACAPIActionModel.ListByNotResourceIds(resourceIds)
	}

	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, resources)
}
