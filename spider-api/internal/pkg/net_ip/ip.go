package net_ip

import (
	"k8s.io/klog/v2"
	"net"
)

type IpInfo struct {
	IP      string
	Netmask string
	Gateway string
}

type NetIp struct{}

func inc(ip net.IP) {
	for j := len(ip) - 1; j >= 0; j-- {
		ip[j]++
		if ip[j] > 0 {
			break
		}
	}
}

func (c *NetIp) ParseCIDR(cidr string, gateway string) ([]IpInfo, error) {
	_, ipNet, _ := net.ParseCIDR(cidr)

	klog.Infof("ip range: %s", ipNet.IP)
	klog.Infof("ip netmask: %s", net.IP(ipNet.Mask))
	klog.Infof("ip gateway: %s", gateway)

	var result []IpInfo

	for ip := ipNet.IP.Mask(ipNet.Mask); ipNet.Contains(ip); inc(ip) {
		result = append(result, IpInfo{
			IP:      ip.String(),
			Netmask: net.IP(ipNet.Mask).String(),
			Gateway: gateway,
		})
	}
	return result, nil
}

func NewNetIp() *NetIp {
	return &NetIp{}
}
