package idc

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/labstack/echo/v4"
	"k8s.io/klog/v2"
)

func AzList(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.List(NewAzSerializer())
}

func AzRetrieve(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Retrieve(&models.Az{})
}

func AzCreate(c *base.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Az{},
		Payload:     &forms.AzForm{},
		Extra:       c.GetUserMap(),
	}
	return genericSet.Create(params)
}

func AzUpdate(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	params := services.GenericPostOrPutParams{
		ModelEngine: &models.Az{},
		Payload:     &forms.AzForm{},
	}
	return genericSet.Update(params)
}

func AzDestroy(c echo.Context) error {
	genericSet := services.NewGeneric(c)
	return genericSet.Delete(&models.Az{})
}

func AzMultiDelete(c echo.Context) error {
	cc := c.(*base.Context)
	var payload forms.IdcAzMultiDeleteForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	user, _ := cc.CurrentUser()
	for _, azId := range payload.Ids {
		if err := models.Orm.DeleteById(&models.Az{}, azId, user.Username); err != nil {
			klog.Errorf("multi delete az fail, azId: %d, err: %s", azId, err.Error())
		}
	}
	return base.SuccessNoContentResponse(c)

}

func AzMultiImport(c echo.Context) error {
	return base.SuccessResponse(c, nil)
}
