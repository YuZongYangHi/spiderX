package services

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/forms"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/models"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/pkg/net_ip"
	"github.com/labstack/echo/v4"
	"k8s.io/klog/v2"
	"strings"
)

type NetIP struct {
	ctx       echo.Context
	IpManager *net_ip.NetIp
	valid     *base.Validator
}

func (c *NetIP) GenerateIpCreateForm(ipRangeId int64, ipRangeForm forms.NetIpRangeCreate, ipInfo net_ip.IpInfo) map[string]interface{} {
	f := forms.NetIpCreate{
		IpRangeId: ipRangeId,
		Ip:        ipInfo.IP,
		Netmask:   ipInfo.Netmask,
		Gateway:   ipInfo.Gateway,
		Type:      ipRangeForm.Type,
		Version:   ipRangeForm.Version,
		Env:       ipRangeForm.Env,
		Status:    ipRangeForm.Status,
		Operator:  ipRangeForm.Operator,
	}
	return c.valid.ParseMapByStruct(f)
}

func (c *NetIP) GenerateIpUpdateForm(ipRange forms.NetIpRangeCreate, ipInfo net_ip.IpInfo) map[string]interface{} {
	f := forms.NetIpUpdate{
		Gateway:  ipInfo.Gateway,
		Type:     ipRange.Type,
		Env:      ipRange.Env,
		Status:   ipRange.Status,
		Operator: ipRange.Operator,
	}
	return c.valid.ParseMapByStruct(f)
}

func (c *NetIP) Sync(ipRangeId int64, ipRange forms.NetIpRangeCreate) error {
	cc := c.ctx.(*base.Context)
	user, err := cc.CurrentUser()
	if err != nil {
		return err
	}

	ipList, err := c.IpManager.ParseCIDR(ipRange.Cidr, ipRange.Gateway)

	if err != nil {
		return err
	}

	totalLength := len(ipList)
	currentLength := 0

	for _, ipInfo := range ipList {
		currentLength += 1
		if strings.HasSuffix(ipInfo.IP, ".0") || totalLength-1 == currentLength {
			continue
		}

		m := c.GenerateIpCreateForm(ipRangeId, ipRange, ipInfo)
		ip, _ := models.NetIpModel.GetByIp(ipInfo.IP)
		if ip.Id > 0 {
			m = c.GenerateIpUpdateForm(ipRange, ipInfo)
			err = models.Orm.Updates(&ip, m, user.Username)
		} else {
			err = models.Orm.Add(&models.NetIp{}, m, user.Username)
		}

		if err != nil {
			klog.Errorf("ip sync db handle error: %s", err.Error())
		}
	}
	return nil
}

func (c *NetIP) SyncRelResource(ipNetId int64, resourcrs []forms.RelResource) error {
	if len(resourcrs) == 0 {
		return nil
	}
	if err := models.NetIpModel.ClearRelResource(ipNetId); err != nil {
		return err
	}

	for _, rel := range resourcrs {
		m := models.NetIpRelResource{
			Type:       rel.ResourceType,
			ResourceId: rel.ResourceId,
			IpNetId:    ipNetId,
		}
		if n, _ := models.NetIpModel.GetRelResource(m); n.Id > 0 {
			continue
		}

		if err := models.Orm.Add(&models.NetIpRelResource{}, c.valid.ParseMapByStruct(m), "system"); err != nil {
			klog.Errorf("[ net-ip] related resource error: %s", err.Error())
			return err
		}
	}
	return nil
}

func NewNetIp(c echo.Context) *NetIP {
	return &NetIP{
		ctx:       c,
		IpManager: net_ip.NewNetIp(),
		valid:     base.NewValidator(c),
	}
}
