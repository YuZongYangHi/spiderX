package tree

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/pkg"
	"github.com/labstack/echo/v4"
	"time"
)

func List(c echo.Context) error {
	treeList, err := models.TreeModel.GetAll()
	if err != nil {
		return base.ErrorResponse(c, 500, err.Error())
	}
	return base.SuccessResponse(c, treeList)
}

func Delete(c echo.Context) error {
	cc := c.(*base.Context)
	user, _ := cc.CurrentUser()
	if !user.IsAdmin {
		return base.ForbiddenResponse(c)
	}

	var payload forms.TreeDelete
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, "")
	}

	if err := models.TreeModel.RelDeleteByFullIdPath(payload.FullIdPath); err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	cond := map[string]interface{}{
		"tree_id": payload.Id,
	}
	models.Orm.Delete(&models.TreeResourceMapping{}, cond, payload.Id, "system")
	return base.SuccessResponse(c, payload)
}

func Create(c echo.Context) error {
	cc := c.(*base.Context)
	user, _ := cc.CurrentUser()
	if !user.IsAdmin {
		return base.ForbiddenResponse(c)
	}

	lastRow := models.TreeModel.GetLastRecordOrderId()

	var payload forms.TreeCreate
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, "")
	}

	tree := &models.Tree{
		Id:           lastRow.Id + 1,
		Name:         payload.Name,
		Level:        payload.Level,
		ParentId:     payload.ParentId,
		FullNamePath: payload.FullNamePath,
		FullIdPath:   fmt.Sprintf("%s/%d", payload.FullIdPath, lastRow.Id+1),
	}

	result := models.OrmDB().Create(tree)
	if result.Error != nil {
		return base.ServerInternalErrorResponse(c, result.Error.Error())
	}
	return base.SuccessResponse(c, tree)
}

func Update(c echo.Context) error {
	cc := c.(*base.Context)
	user, _ := cc.CurrentUser()
	if !user.IsAdmin {
		return base.ForbiddenResponse(c)
	}

	id := cc.ParseInt("id")
	if id == 0 {
		return base.BadRequestResponse(c, "")
	}

	var payload forms.TreeUpdate
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, "")
	}

	tree, err := models.TreeModel.GetById(id)
	if err != nil || tree.Id == 0 {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	srcName := tree.Name
	targetName := payload.Name

	tree.Name = payload.Name
	tree.UpdateTime = time.Now()

	err = models.OrmDB().Save(&tree).Error
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	if srcName != targetName {
		if err = models.OrmDB().
			Exec(models.BatchUpdateTreeNamePathSQL, srcName, targetName, "%"+srcName+"%").
			Error; err != nil {
			return base.ServerInternalErrorResponse(c, err.Error())
		}
	}
	return base.SuccessResponse(c, tree)
}

func Migrate(c echo.Context) error {
	cc := c.(*base.Context)
	user, _ := cc.CurrentUser()
	if !user.IsAdmin {
		return base.ForbiddenResponse(c)
	}
	var payload forms.TreeMigrate
	valid := base.NewValidator(c)
	if err := valid.IsValid(&payload); err != nil {
		return base.BadRequestResponse(c, "")
	}

	srcTree, _ := models.TreeModel.GetById(payload.SrcId)
	targetTree, _ := models.TreeModel.GetById(payload.DestId)
	if srcTree.Id == 0 || targetTree.Id == 0 {
		return base.NotFoundResponse(c)
	}

	treeUtil := pkg.NewTreeUtil()
	srcTreeChildren, _ := models.TreeModel.FindByFullIdPath(srcTree.FullIdPath)
	ppTree, _ := models.TreeModel.GetById(srcTree.ParentId)

	reverse := false

	if targetTree.ParentId == srcTree.Id {
		reverse = true
		targetTree.Level -= 1
		targetTree.ParentId = srcTree.ParentId

	} else if targetTree.Level > srcTree.Level {
		reverse = true
		targetTree.Level = srcTree.Level
		targetTree.ParentId = ppTree.Id
	}

	if reverse {
		targetTree.FullIdPath = fmt.Sprintf("%s/%d", ppTree.FullIdPath, targetTree.Id)
		targetTree.FullNamePath = fmt.Sprintf("%s/%s", ppTree.FullNamePath, targetTree.Name)
		targetTree.UpdateTime = time.Now()

		if err := models.OrmDB().Save(&targetTree).Error; err != nil {
			return base.ServerInternalErrorResponse(c, err.Error())
		}

		if err := treeUtil.BuildMigrateChildren(targetTree, ppTree); err != nil {
			return base.ServerInternalErrorResponse(c, err.Error())
		}
	}

	srcTree.ParentId = targetTree.Id
	srcTree.Level = targetTree.Level + 1
	srcTree.FullIdPath = fmt.Sprintf("%s/%d", targetTree.FullIdPath, srcTree.Id)
	srcTree.FullNamePath = fmt.Sprintf("%s/%s", targetTree.FullNamePath, srcTree.Name)
	srcTree.UpdateTime = time.Now()

	err := models.OrmDB().Save(&srcTree).Error
	if err != nil {
		return base.ServerInternalErrorResponse(c, err.Error())
	}

	if len(srcTreeChildren) > 0 {
		if err = treeUtil.BuildMigrateChildren(srcTree, targetTree); err != nil {
			return base.ServerInternalErrorResponse(c, err.Error())
		}
	}

	return base.SuccessResponse(c, srcTree)
}
