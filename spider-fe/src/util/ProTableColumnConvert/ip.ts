export const assetsIpVersionColumnRender = {
  1: {
    text: "ipv4",
    color: "#2db7f5"
  },
  2: {
    text: "ipv6",
    color: "#108ee9"
  },
}

export const assetsIpEnvColumnRender = {
  1: {
    text: "线上",
    color: "magenta"
  },
  2: {
    text: "测试",
    color: "cyan"
  },
  3: {
    text: "隔离",
    color: "orange"
  },
}

export const assetsIpStatusColumnRender = {
  1: {
    text: "未使用",
    status: "warning"
  },
  2: {
    text: "已使用",
    status: "success"
  }
}

export const assetsIpTypeColumnRender = {
  1: {
    text: "公网",
  },
  2: {
    text: "内网",
  },
  3: {
    text: "管理网"
  }
}

export default {
  "assets.ip.version": assetsIpVersionColumnRender,
  "assets.ip.status": assetsIpStatusColumnRender,
  "assets.ip.env": assetsIpEnvColumnRender,
  "assets.ip.type": assetsIpTypeColumnRender
}
