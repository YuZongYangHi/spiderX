export const assetsMachineTypeColumnRender = {
  1: {
    text: "物理机"
  },
  2: {
    text: "虚拟机",
  },
  3: {
    text: "云主机"
  }
}

export const assetsMachineRoleColumnRender = {
  1: {
    text: "lvs",
    color: "purple"
  },
  2: {
    text: "master",
    color: "purple"
  },
  3: {
    text: "node",
    color: "purple"
  },
  4: {
    text: "other",
    color: "purple"
  }
}

export const assetsMachineAppEnvColumnRender = {
  "prod": {
    text: "prod"
  },
  "test": {
    text: "test"
  },
  "dev": {
    text: "dev"
  },
  "staging": {
    text: "staging"
  },
  "uat": {
    text: "uat"
  },
  "pre": {
    text: "pre"
  }
}

export const assetsMachineBelongToColumnRender = {
  "IT": {
    text: "IT"
  },
  "IDC": {
    text: "IDC"
  }
}

export default {
  "assets.machine.type": assetsMachineTypeColumnRender,
  "assets.machine.role": assetsMachineRoleColumnRender,
  "assets.machine.appEnv": assetsMachineAppEnvColumnRender,
  "assets.machine.belongTo": assetsMachineBelongToColumnRender,
}



