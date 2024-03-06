package services

import (
	"errors"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/pkg/util"
	"github.com/labstack/echo/v4"
	"k8s.io/klog/v2"
	"strconv"
	"strings"
)

type Server struct {
	treeRel *TreeResourceMapping
	tagRel  *ServerRelTag
}

func (c *Server) UpdateRel(serverId int64, form forms.ServerUpdateForm) error {
	return c.SyncRel(serverId, form.ProductLines, form.Tags)
}

func (c *Server) CreateRel(form forms.ServerCreateForm) error {
	server, err := models.ServerModel.GetBySn(form.Sn)
	if err != nil {
		return err
	}
	return c.SyncRel(server.Id, form.ProductLines, form.Tags)
}

func (c *Server) SyncRel(serverId int64, productLines []int64, tags []string) error {
	if len(productLines) > 0 {
		err := c.treeRel.AddByNode(serverId, models.TreeResourceMappingServerType, productLines)
		if err != nil {
			return err
		}
	}

	if len(tags) > 0 {
		if err := c.tagRel.Set(serverId, tags); err != nil {
			return err
		}
	}
	return nil
}

func (c *Server) BatchImport(ctx echo.Context) (map[string]int, error) {
	cc := ctx.(*base.Context)
	user, _ := cc.CurrentUser()

	treeId := cc.ParseInt("treeId")
	if treeId == 0 {
		return nil, errors.New(base.InvalidInstanceId)
	}

	upload := NewUpload("server", ctx)
	rows, err := upload.Parser()
	if err != nil {
		return nil, err
	}

	treeResourceService := NewTreeResourceMapping()
	serverTagService := NewServerRelTag()
	errCount := 0
	successCount := 0
	for index, row := range rows {
		if index == 0 {
			continue
		}

		if len(row) != 34 {
			errCount += 1
			klog.Errorf("row count error")
			continue
		}

		row = util.ValuesReplaceSpace(row)
		if !util.ValuesIsNotNull(row...) {
			klog.Errorf("value strings replace space error")
			errCount += 1
			continue
		}

		choicesValues, err := models.GetServerChoicesFieldByExcelRow(row)
		if err != nil {
			klog.Errorf("column convert error")
			errCount += 1
			continue
		}

		if h, _ := models.ServerModel.GetBySn(row[0]); h.Id > 0 {
			errCount += 1
			klog.Errorf("sn: %s already use", row[0])
			continue
		}

		if h, _ := models.ServerModel.GetByHostname(row[1]); h.Id > 0 {
			errCount += 1
			klog.Errorf("hostname already use")
			continue
		}

		rackSlot := strings.Split(row[30], "_")[3]
		int64Num, err := strconv.ParseInt(rackSlot, 10, 64)
		if err != nil {
			klog.Errorf("idc rack slot covert error")
			errCount += 1
			continue
		}

		rackSlotInstance, err := models.IdcRackSlotModel.GetFullNameBySlot(row[30], int64Num)
		if err != nil {
			klog.Errorf("idc rack slot not found")
			errCount += 1
			continue
		}

		factory, err := models.FactoryModel.GetByName(row[29])
		if err != nil || factory.Id == 0 {
			errCount += 1
			klog.Errorf("factory not found")
			continue
		}

		provider, err := models.ProviderMode.GetByName(row[28])
		if err != nil || provider.Id == 0 {
			errCount += 1
			klog.Errorf("provider not found")
			continue
		}

		suit, err := models.SuitModel.GetByName(row[27])
		if err != nil {
			errCount += 1
			klog.Errorf("suit not found")
			continue
		}

		node, err := models.NodeModel.GetByName(row[8])
		if err != nil {
			errCount += 1
			klog.Errorf("node not found")
			continue
		}

		m := &models.Server{
			Sn:            row[0],
			Hostname:      row[1],
			Type:          choicesValues["device"],
			SuitId:        suit.Id,
			PowerInfo:     row[25],
			PowerCost:     row[26],
			Role:          choicesValues["role"],
			Operator:      choicesValues["operator"],
			ProviderId:    provider.Id,
			FactoryId:     factory.Id,
			NodeId:        node.Id,
			IdcRackSlotId: rackSlotInstance.Id,
			Status:        choicesValues["status"],
			AppEnv:        row[12],
			AppEnvDesc:    row[13],
			SystemType:    row[22],
			SystemVersion: row[23],
			SystemArch:    row[24],
			BelongTo:      row[14],
			BelongToDesc:  row[15],
			ArrivalTime:   row[31],
			OverdueTime:   row[32],
			PrivNetIp:     row[6],
			PrivNetMask:   row[16],
			PrivNetGw:     row[17],
			PubNetIp:      row[5],
			PubNetMask:    row[18],
			PubNetGw:      row[19],
			MgmtPortIp:    row[7],
			MgmtPortMask:  row[20],
			MgmtPortGw:    row[21],
			Comment:       row[33],
			Creator:       user.Username,
		}

		if err = models.Orm.Add(&models.Server{}, m, user.Username); err != nil {
			errCount += 1
			klog.Errorf("batch import sn: %s fail: %s", row[0], err.Error())
		} else {
			successCount += 1
			server, _ := models.ServerModel.GetBySn(row[0])
			treeIds := []int64{treeId}
			if len(treeIds) > 0 {
				treeResourceService.AddByNode(server.Id, models.TreeResourceMappingServerType, treeIds)
			}
			tag := row[11]
			if tag != "" {
				tags := strings.Split(tag, ",")
				serverTagService.Set(server.Id, tags)
			}
		}
	}
	result := map[string]int{
		"success": successCount,
		"error":   errCount,
	}
	return result, nil
}

func (c *Server) MigrateServerTree(srcTreeId int64, targetIds []int64, serverIds []int64) error {
	for _, serverId := range serverIds {
		if err := c.treeRel.Migrate(srcTreeId, targetIds, serverId, models.TreeResourceMappingServerType); err != nil {
			return err
		}
	}
	return nil
}

func NewServer() *Server {
	return &Server{
		treeRel: NewTreeResourceMapping(),
		tagRel:  NewServerRelTag(),
	}
}
