export const netDeviceStatus = {
  1: {
    text: "未使用",
    status: "warning"
  },
  2: {
    text: "使用中",
    status: "success"
  },
  3: {
    text: "报修中",
    status: "error"
  }
}

export const netDeviceSwitchType = {
  1: {
    text: "千兆"
  },
  2: {
    text: "万兆"
  }
}

export default {
  "assets.netDevice.status": netDeviceStatus,
  "assets.netDevice.switch.type":  netDeviceSwitchType
}
