package pkg

import (
	"fmt"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"k8s.io/klog/v2"

	"time"
)

type TreeUtil struct{}

func (c *TreeUtil) BuildMigrateChildren(parentTree models.Tree, targetTree models.Tree) error {
	treeChildren, _ := models.TreeModel.FindByPid(parentTree.Id)
	if len(treeChildren) == 0 {
		return nil
	}

	for _, tree := range treeChildren {
		if tree.Id == targetTree.Id {
			continue
		}
		tree.Level = parentTree.Level + 1
		tree.FullIdPath = fmt.Sprintf("%s/%d", parentTree.FullIdPath, tree.Id)
		tree.FullNamePath = fmt.Sprintf("%s/%s", parentTree.FullNamePath, tree.Name)
		tree.UpdateTime = time.Now()
		if err := models.OrmDB().Save(&tree).Error; err != nil {
			klog.Errorf("[ tree children migrate ] error: %s", err.Error())
			return err
		}
		if err := c.BuildMigrateChildren(tree, targetTree); err != nil {
			return err
		}
	}
	return nil
}

func NewTreeUtil() *TreeUtil {
	return &TreeUtil{}
}
