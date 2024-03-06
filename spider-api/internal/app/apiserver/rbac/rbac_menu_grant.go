package rbac

import (
	"errors"
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
)

type MenuModelParams struct {
	RoleTableName            string
	RoleFilter               map[string]interface{}
	RoleModel                interface{}
	RolePermissionsTableName string
	RolePermissionsModel     interface{}
	RolePermissionsFilter    map[string]interface{}
}

type MenuGrantPermissionsParams struct {
	PermissionsId int64
	MenuId        int64
}

type MenuGrantPermissionsAbstract interface {
	Payload() interface{}
	Create(menuId int64) (interface{}, error)
	Delete(menuId, permissionsId int64) error
	Model() MenuModelParams
}

type MenuGrantPermissionsManager struct {
	ctx  echo.Context
	ctrl MenuGrantPermissionsAbstract
}

func (c *MenuGrantPermissionsManager) getMenuId() (int64, error) {
	return c.ctx.(*base.Context).GetParamInt("menuId")
}

func (c *MenuGrantPermissionsManager) getPermissionsId() (int64, error) {
	return c.ctx.(*base.Context).GetParamInt("permissionId")
}

func (c *MenuGrantPermissionsManager) GetParams() (*MenuGrantPermissionsParams, error) {
	menuId, err := c.getMenuId()
	if err != nil {
		return nil, err
	}
	permissionsId, err := c.getPermissionsId()
	if err != nil {
		return nil, err
	}

	return &MenuGrantPermissionsParams{
		MenuId:        menuId,
		PermissionsId: permissionsId,
	}, nil
}

func (c *MenuGrantPermissionsManager) Create() (interface{}, error) {
	menuId, err := c.getMenuId()
	if menuId == 0 || err != nil {
		return nil, err
	}

	valid := base.NewValidator(c.ctx)
	if err = valid.IsValid(c.ctrl.Payload()); err != nil {
		return nil, err
	}

	_, err = models.MenuModel.GetById(menuId)
	if err != nil {
		return nil, err
	}

	roleQs := models.OrmDB().Table(c.ctrl.Model().RoleTableName)

	for filed, value := range c.ctrl.Model().RoleFilter {
		s := fmt.Sprintf("%s = ?", filed)
		roleQs = roleQs.Where(s, value)
	}

	if err = roleQs.First(c.ctrl.Model().RoleModel).Error; err != nil {
		return nil, err
	}

	permissionsQs := models.OrmDB().Table(c.ctrl.Model().RolePermissionsTableName)

	for filed, value := range c.ctrl.Model().RolePermissionsFilter {
		s := fmt.Sprintf("%s = ?", filed)
		permissionsQs = permissionsQs.Where(s, value)
	}

	permissionsQs = permissionsQs.Where("menu_id = ?", menuId)

	if count := permissionsQs.First(c.ctrl.Model().RolePermissionsModel).RowsAffected; count > 0 {
		return nil, errors.New(fmt.Sprintf("%s permissions object existed", c.ctrl.Model().RolePermissionsTableName))
	}

	return c.ctrl.Create(menuId)
}

func (c *MenuGrantPermissionsManager) Delete() error {
	params, err := c.GetParams()
	if err != nil {
		return err
	}
	return c.ctrl.Delete(params.MenuId, params.PermissionsId)
}

func NewMenuGrantPermissionsManager(ctx echo.Context, ctrl MenuGrantPermissionsAbstract) *MenuGrantPermissionsManager {
	return &MenuGrantPermissionsManager{
		ctx:  ctx,
		ctrl: ctrl,
	}
}
