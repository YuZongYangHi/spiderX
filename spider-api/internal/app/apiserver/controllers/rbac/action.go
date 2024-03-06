package rbac

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
	"strings"
)

func ActionList(c echo.Context) error {
	actionSerializer := NewAPIActionSerializer()
	baseSerializer := base.NewSerializersManager(c, actionSerializer)
	response, err := baseSerializer.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, response)
}

func ActionCreate(c echo.Context) error {
	cc := c.(*base.Context)
	var payload forms.APIActionForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	payload.Verb = strings.ToUpper(payload.Verb)
	if _, ok := models.ActionVerbs[payload.Verb]; !ok {
		return base.ErrorResponse(c, 400, "invalid verb")
	}

	action, _ := models.RBACAPIActionModel.FetchSingleResourceActionData(payload.Resource, payload.Verb)
	if action.Id > 0 {
		return base.ErrorResponse(c, 400, "resource already exists")
	}

	user, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(c)
	}

	m := &models.APIAction{
		Resource:    payload.Resource,
		Verb:        payload.Verb,
		Owner:       user.Username,
		Description: payload.Description,
	}

	if err = models.RBACAPIActionModel.Add(m); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, m)
}

func ActionDelete(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}
	models.RBACAPIRoleRelResourceModel.DeleteByActionId(id)
	if err := models.RBACAPIActionModel.DeleteById(id); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessNoContentResponse(c)
}

func ActionUpdate(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}

	action, err := models.RBACAPIActionModel.GetById(id)
	if err != nil || action.Id == 0 {
		return base.NotFoundResponse(c)
	}

	var payload forms.APIActionForm
	valid := base.NewValidator(c)
	if err = valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	payload.Verb = strings.ToUpper(payload.Verb)
	if _, ok := models.ActionVerbs[payload.Verb]; !ok {
		return base.ErrorResponse(c, 400, "invalid verb")
	}

	action.Resource = payload.Resource
	action.Description = payload.Description
	action.Verb = payload.Verb

	if err = models.RBACAPIActionModel.Update(&action); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, action)
}
