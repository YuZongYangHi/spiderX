package node

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/config"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/services"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util/parsers"
	"github.com/labstack/echo/v4"
	"io"
	"k8s.io/klog/v2"
	"os"
	"path"
	"strings"
)

func List(c echo.Context) error {
	s := base.NewSerializersManager(c, NewSerializer())
	response, err := s.QuerySet()
	if err != nil {
		return base.BadRequestResponse(c, "")
	}
	return base.Response(c, 200, response)
}

func Create(c echo.Context) error {
	cc := c.(*base.Context)
	user, err := cc.CurrentUser()
	if err != nil {
		return base.UnauthorizedResponse(c)
	}

	var payload forms.NodeCreateForm
	valid := base.NewValidator(c)
	if err = valid.IsValid(&payload); err != nil {
		return base.ErrorResponse(c, 400, err.Error())
	}

	node, err := models.NodeModel.GetByName(payload.Name)
	if node.Id > 0 || err == nil {
		return base.ErrorResponse(c, 400, base.DataAlreadyExists)
	}

	m := valid.ParseMapByStruct(payload)
	m["Creator"] = user.Username

	err = models.Orm.Add(&models.Node{}, m, user.Username)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	if len(payload.ProductLines) > 0 {
		treeResourceService := services.NewTreeResourceMapping()
		node, _ = models.NodeModel.GetByName(payload.Name)
		err = treeResourceService.AddByNode(node.Id, models.TreeResourceMappingNodeType, payload.ProductLines)
		if err != nil {
			return base.ServerInternalErrorResponse(c, err.Error())
		}
	}
	return base.SuccessResponse(c, m)
}

func Update(c echo.Context) error {
	cc := c.(*base.Context)

	var payload forms.NodeUpdateForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}
	user, _ := cc.CurrentUser()

	var node *models.Node
	err := models.Orm.GetById(&node, id)
	if node.Id == 0 || err != nil {
		return base.BadRequestResponse(c, base.DataNotFound)
	}

	if node.IsDeleted == 1 {
		return base.ServerInternalErrorResponse(c, base.InstanceAlreadyDelete)
	}

	if err = models.Orm.Updates(node, valid.ParseMapByStruct(payload), user.Username); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	if len(payload.ProductLines) > 0 {
		treeResourceService := services.NewTreeResourceMapping()
		err = treeResourceService.AddByNode(id, models.TreeResourceMappingNodeType, payload.ProductLines)
		if err != nil {
			return base.ServerInternalErrorResponse(c, err.Error())
		}
	}

	return base.SuccessResponse(c, node)
}

func Detail(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}
	result, err := models.NodeModel.GetById(id)
	if err != nil {
		return base.Response(c, 404, base.CommonResponse{
			Success:      false,
			Data:         base.ResponseContent{},
			ErrorMessage: err.Error(),
		})
	}
	return base.SuccessResponse(c, result)
}

func Delete(c echo.Context) error {
	cc := c.(*base.Context)
	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}
	user, _ := cc.CurrentUser()
	err := models.Orm.SoftDeleteById(&models.Node{}, id, user.Username)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	filter := map[string]interface{}{"resource_id": id}
	err = models.Orm.Delete(&models.TreeResourceMapping{}, filter, id, user.Username)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, id)
}

func UpdateStatus(c echo.Context) error {
	cc := c.(*base.Context)

	var payload forms.NodeStatusForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	id := cc.ParseInt("id")

	if id == 0 {
		return base.BadRequestResponse(c, base.InvalidInstanceId)
	}

	var node *models.Node
	user, _ := cc.CurrentUser()

	err := models.Orm.GetById(&node, id)
	if node.Id == 0 || err != nil {
		return base.BadRequestResponse(c, base.DataNotFound)
	}

	if err = models.Orm.Updates(node, valid.ParseMapByStruct(payload), user.Username); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}
	return base.SuccessResponse(c, node)
}

func MultiDelete(c echo.Context) error {
	cc := c.(*base.Context)

	var payload forms.NodeMultiDeleteForm
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	user, _ := cc.CurrentUser()
	for _, nodeId := range payload.Ids {
		if err := models.Orm.SoftDeleteById(&models.Node{}, nodeId, user.Username); err != nil {
			klog.Errorf("multi delete node fail, noeId: %d, err: %s", nodeId, err.Error())
		}
	}
	return base.SuccessNoContentResponse(c)
}

func MultiUpload(c echo.Context) error {
	cc := c.(*base.Context)
	user, _ := cc.CurrentUser()

	file, err := c.FormFile("file")
	if err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	uploadedFileName := file.Filename
	uploadedFilePath := path.Join(fmt.Sprintf("%s/%s", config.ApiServerConfig().Common.UploadPath, "node"), uploadedFileName)

	src, err := file.Open()
	if err != nil {
		return base.BadRequestResponse(c, err.Error())
	}
	defer src.Close()

	dst, err := os.Create(uploadedFilePath)
	if err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	if _, err = io.Copy(dst, src); err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	excel, err := parsers.NewExcel(uploadedFilePath)
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	rows, err := excel.GetRows(excel.GetSheetName(0))
	if err != nil {
		return base.BadRequestResponse(c, err.Error())
	}

	errCount := 0
	successCount := 0

	for index, row := range rows {
		if index == 0 {
			continue
		}

		if len(row) != 12 {
			errCount += 1
			continue
		}

		row = util.ValuesReplaceSpace(row)
		if !util.ValuesIsNotNull(row...) {
			errCount += 1
			continue
		}

		choicesValues, err := models.GetNodeChoicesFieldByExcelRow(row)
		if err != nil {
			errCount += 1
			continue
		}
		node, _ := models.NodeModel.GetByName(row[0])
		if node.Id > 0 {
			errCount += 1
			continue
		}

		m := &models.Node{
			Name:      row[0],
			CnName:    row[1],
			Operator:  choicesValues["operate"],
			Bandwidth: row[9],
			Region:    row[6],
			Province:  row[7],
			Status:    choicesValues["status"],
			Creator:   user.Username,
			Attribute: choicesValues["attribute"],
			Grade:     choicesValues["grade"],
			Comment:   row[11],
			Contract:  choicesValues["contract"],
		}
		if err = models.Orm.Add(&models.Node{}, m, user.Username); err != nil {
			errCount += 1
			klog.Errorf("batch import nodeName: %s fail: %s", row[0], err.Error())
		} else {
			successCount += 1
			treeIds := models.TreeModel.FindIdByFullNames(strings.Split(row[10], ",")...)
			if len(treeIds) == 0 {
				continue
			}
			treeResourceService := services.NewTreeResourceMapping()
			treeResourceService.AddByNode(node.Id, models.TreeResourceMappingNodeType, treeIds)
		}
	}

	result := map[string]int{
		"success": successCount,
		"error":   errCount,
	}
	return base.SuccessResponse(c, result)
}
