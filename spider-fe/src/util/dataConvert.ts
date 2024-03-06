export const nodeOperatorConvert = {
  1: "移动",
  2: "联通",
  3: "电信",
  4: "多线"
}

export const nodeStatusConvert = {
  1: "初始化",
  2: "已上线",
  3: "维护中",
  4: "冷备",
  5: "规划中",
  6: "裁撤",
  7: "建设中",
  8: "裁撤新建",
  9: "已下线",
}

export const nodeAttributeConvert = {
  1: "容器节点",
  2: "虚拟机节点",
  3: "物理机节点",
  4: "混合节点"
}

export const nodeGradeConvert = {
  1: "标准",
  2: "骨干",
  3: "核心"
}

export const nodeContractConvert = {
  1: "直签",
  2: "代理"
}

export const nodeOperatorFilter = {
  1: {
    text: '移动'
  },
  2: {
    text: '联通'
  },
  3: {
    text: '电信'
  },
  4: {
    text: '多线'
  }
}

export const nodeIsDeletedFilter = {
  0: {
    text: '未删除'
  },
  1: {
    text: '已删除'
  }
}

export const nodeStatusFilter = {
  1: {
    text: '初始化',
    status: 'Processing'
  },
  2: {
    text: '已上线',
    status: 'Success'
  },
  3: {
    text: '维护中',
    status: 'Warning'
  },
  4: {
    text: '冷备',
    status: 'Default'
  },
  5: {
    text: '规划中',
    status: 'Default'
  },
  6: {
    text: '裁撤',
    status: 'Error'
  },
  7: {
    text: '建设中',
    status: 'Processing'
  },
  8: {
    text: '裁撤新建',
    status: 'Warning'
  },
  9: {
    text: '已下线',
    status: 'Error'
  }
}

export const nodeAttributeFilter = {
  1: {
    text: '容器节点'
  },
  2: {
    text: '虚拟机节点'
  },
  3: {
    text: '物理机节点'
  },
  4: {
    text: '混合节点'
  }
}

export const nodeGradeFilter = {
  1: {
    text: '标准'
  },
  2: {
    text: '骨干'
  },
  3: {
    text: '核心'
  }
}

export const nodeContractFilter = {
  1: {
    text: '直签'
  },
  2: {
    text: '代理'
  }
}

export const auditOperateMethodFilter = {
  1: {
    text: '创建'
  },
  2: {
    text: '修改'
  },
  3: {
    text: "删除"
  }
}

export const regionFilter = {
  '华南大区': {
    text: "华南大区",
  },
  '西北大区': {
    text: "西北大区",
  },
  '西南大区': {
    text: "西南大区",
  },
  '华东大区': {
    text: "华东大区",
  },
  '华中大区': {
    text: "华中大区",
  },
  '华北大区': {
    text: "华北大区",
  },
  '东北大区': {
    text: "东北大区",
  }
}

export const province = [
  '北京市', '天津市', '上海市', '重庆市',
  '河北省', '山西省', '辽宁省', '吉林省',
  '黑龙江省', '江苏省', '浙江省', '安徽省',
  '福建省', '江西省', '山东省', '河南省',
  '湖北省', '湖南省', '广东省', '海南省',
  '四川省', '贵州省', '云南省', '陕西省',
  '甘肃省', '青海省', '台湾省', '内蒙古自治区',
  '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
  '香港特别行政区', '澳门特别行政区', '海外'
];

export const provinceHandleFilter = () => {
  const t = {}
  province.map(function (element: string) {
    t[element] = {
      text: element
    }
  })
  return t
}

export const IdcAzTypeFilter = {
  1: {
    text: '物理',
    color: "#108ee9"
  },
  2: {
    text: '虚拟',
    color: "#2db7f5"
  }
}

export const IdcAzStatusFilter = {
  1: {
    text: '使用中',
    status: 'Success'
  },
  2: {
    text: '不可用',
    status: 'Error'
  },
  3: {
    text: '维护中',
    status: 'Warning'
  }
}

export const IdcRoomPduStandardFilter = {
  '国标': {
    text: '国标',
  },
  '欧标': {
    text: '欧标',
  },
  '国欧': {
    text: '国欧',
  }
}

export const IdcRoomPowerModeFilter = {
  '双UPS': {
    text: '双UPS',
  },
  '双HVDC': {
    text: '双HVDC',
  },
  'HVDC+市电': {
    text: 'HVDC+市电',
  }
}

export const IdcRoomRackSizeFilter = {
  '42U': {
    text: '42U',
  },
  '45U': {
    text: '45U',
  },
  '46U': {
    text: '46U',
  },
  '47U': {
    text: '47U',
  },
  '49U': {
    text: '49U',
  },
  '52U': {
    text: '52U',
  },
  '53U': {
    text: '53U',
  },
  '54U': {
    text: '54U',
  }
}

export const IdcRoomBearerTypeFilter = {
  'L型支架': {
    text: 'L型支架',
  },
  '固定托盘': {
    text: '固定托盘',
  },
  'L型+托盘': {
    text: 'L型+托盘',
  },
  '导轨': {
    text: '导轨'
  }
}


export const IdcRoomBearWeightFilter = {
  '50KG': {
    text: '50KG',
  },
  '60KG': {
    text: '60KG',
  },
  '80KG': {
    text: '80KG',
  },
  '120KG': {
    text: '120KG'
  }
}

export const IdcRackSlotTypeFilter = {
  1: {
    text: "服务器",
    color: "#108ee9"
  },
  2: {
    text: "交换机",
    color: "#2db7f5"
  },
  3: {
    text: "路由器",
    color: "#87d068"
  }
}

export const AuditOperateTypeFilter = {
  1: {
    text: "创建",
    color: "#87d068",
  },
  2: {
    text: "修改",
    color: "warning"
  },
  3: {
    text: "删除",
    color: "#f50"
  }
}

export const AuditUserLoginFilter = {
  1: {
    text: "登录",
    color: "#87d068",
  },
  2: {
    text: "登出",
    color: "#87d068",
  }
}

export const optionRender = (valueSelectOption: object): [] => {
  return Object.keys(valueSelectOption).map(value => {
    return { label: valueSelectOption[value].text, value: value}})
}
