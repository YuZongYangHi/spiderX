package services

import (
	"errors"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/labstack/echo/v4"
)

type PostOrPutFormatBodyFunc func()
type GenericPostOrPutParams struct {
	ValidatorHandFuncHooks []base.ValidatorHandFunc
	ModelEngine            models.ModelOrmEngine
	Payload                interface{}
	Extra                  map[string]interface{}
	FormatBodyFunc         func(source map[string]interface{}) map[string]interface{}
}

type Generic struct {
	ctx echo.Context
}

func (c *Generic) CustomValid(form interface{}, validFuncHooks []base.ValidatorHandFunc) bool {
	if validFuncHooks == nil {
		return true
	}
	for _, validFunc := range validFuncHooks {
		if !validFunc(form) {
			return false
		}
	}
	return true
}

func (c *Generic) List(serializer base.Serializers) error {
	s := base.NewSerializersManager(c.ctx, serializer)
	response, err := s.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c.ctx, err.Error())
	}
	return base.Response(c.ctx, 200, response)
}

func (c *Generic) Retrieve(m models.ModelOrmEngine) error {
	cc := c.ctx.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c.ctx, base.InvalidInstanceId)
	}
	if err := models.Orm.GetRelPreloadById(m, id); err != nil {
		return base.NotFoundResponse(c.ctx)
	}

	return base.SuccessResponse(c.ctx, m)
}

func (c *Generic) Create(params GenericPostOrPutParams) error {
	cc := c.ctx.(*base.Context)
	user, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(c.ctx)
	}

	valid := base.NewValidator(c.ctx)
	if err = valid.IsValid(params.Payload); err != nil {
		return base.BadRequestResponse(c.ctx, err.Error())
	}

	m := valid.ParseMapByStruct(params.Payload)
	if len(params.Extra) > 0 {
		for k, v := range params.Extra {
			m[k] = v
		}
	}

	if !c.CustomValid(params.Payload, params.ValidatorHandFuncHooks) {
		return base.BadRequestResponse(c.ctx, base.CustomValidatorValidError)
	}

	if params.FormatBodyFunc != nil {
		m = params.FormatBodyFunc(m)
	}

	if err = models.Orm.Add(params.ModelEngine, m, user.Username); err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessResponse(c.ctx, params.ModelEngine)
}

func (c *Generic) Delete(model models.ModelOrmEngine) error {
	cc := c.ctx.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c.ctx, base.InvalidInstanceId)
	}
	user, _ := cc.CurrentUser()
	if err := models.Orm.DeleteById(model, id, user.Username); err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessNoContentResponse(c.ctx)
}

func (c *Generic) Update(params GenericPostOrPutParams) error {
	cc := c.ctx.(*base.Context)
	user, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(c.ctx)
	}
	valid := base.NewValidator(c.ctx)
	if err = valid.IsValid(params.Payload); err != nil {
		return base.ErrorResponse(c.ctx, 400, err.Error())
	}
	if !c.CustomValid(params.Payload, params.ValidatorHandFuncHooks) {
		return base.BadRequestResponse(c.ctx, base.CustomValidatorValidError)
	}

	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c.ctx, base.InvalidInstanceId)
	}
	if err = models.Orm.GetById(params.ModelEngine, id); err != nil {
		return base.NotFoundResponse(c.ctx)
	}

	m := valid.ParseMapByStruct(params.Payload)
	if params.FormatBodyFunc != nil {
		m = params.FormatBodyFunc(m)
	}

	if err = models.Orm.Updates(params.ModelEngine, m, user.Username); err != nil {
		return base.ServerInternalErrorResponse(c.ctx, err.Error())
	}
	return base.SuccessResponse(c.ctx, params.ModelEngine)
}

func (c *Generic) CreateToResponseError(params GenericPostOrPutParams) error {
	cc := c.ctx.(*base.Context)
	user, err := cc.CurrentUser()
	if err != nil {
		return err
	}

	valid := base.NewValidator(c.ctx)
	if err = valid.IsValid(params.Payload); err != nil {
		return err
	}

	m := valid.ParseMapByStruct(params.Payload)
	if len(params.Extra) > 0 {
		for k, v := range params.Extra {
			m[k] = v
		}
	}

	if err = models.Orm.Add(params.ModelEngine, m, user.Username); err != nil {
		return err
	}
	return nil
}

func (c *Generic) UpdateToResponseError(params GenericPostOrPutParams) error {
	cc := c.ctx.(*base.Context)
	user, err := cc.CurrentUser()
	if err != nil {
		return err
	}
	valid := base.NewValidator(c.ctx)
	if err = valid.IsValid(params.Payload); err != nil {
		return err
	}
	id := cc.ParseInt("id")
	if id == 0 {
		return errors.New(base.InvalidInstanceId)
	}
	if err = models.Orm.GetById(params.ModelEngine, id); err != nil {
		return err
	}
	if err = models.Orm.Updates(params.ModelEngine, valid.ParseMapByStruct(params.Payload), user.Username); err != nil {
		return err
	}
	return nil
}

func (c *Generic) DeleteToResponseError(model models.ModelOrmEngine) error {
	cc := c.ctx.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return errors.New(base.InvalidInstanceId)
	}
	user, _ := cc.CurrentUser()
	if err := models.Orm.DeleteById(model, id, user.Username); err != nil {
		return err
	}
	return nil
}

func NewGeneric(c echo.Context) *Generic {
	return &Generic{ctx: c}
}
