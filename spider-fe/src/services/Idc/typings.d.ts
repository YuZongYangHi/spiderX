declare namespace IdcRequest {
  type AzUpdate = {
    region: string;
    province: string;
    type: number;
    status: number;
  }

  type AzCreate = {
    name: string;
    cnName: string;
    region: string;
    province: string;
    type: number;
    status: number;
  }

  type IdcCreate = {
    name: string;
    cnName: string;
    status: number;
    physicsAzId: number;
    virtualAzId: number;
    address: string;
    region: string;
    city: string;
    cabinetNum: number;
    idcPhone: string;
    idcMail: string;
    comment: string;
  }

  type IdcUpdate = {
    cnName: string;
    status: number;
    physicsAzId: number;
    virtualAzId: number;
    address: string;
    region: string;
    city: string;
    cabinetNum: number;
    idcPhone: string;
    idcMail: string;
    comment: string;
  }

  type IdcRoomCreate = {
    roomName: string;
    idcId: number;
    pduStandard: string;
    powerMode: string;
    rackSize: string;
    bearerType: string;
    bearWeight: string;
    status: number;
  }

  type IdcRoomUpdate = {
    idcId: number;
    pduStandard: string;
    powerMode: string;
    rackSize: string;
    bearerType: string;
    bearWeight: string;
    status: number;
  }

  type IdcRackCreate = {
    name: string;
    row: string;
    col: string;
    group: string;
    uNum: number;
    ratedPower: number;
    netUNum: number;
    current: number;
    status: number;
    idcRoomId: number;
  }

  type IdcRackUpdate = {
    row: string;
    col: string;
    group: string;
    uNum: number;
    ratedPower: number;
    netUNum: number;
    current: number;
    status: number;
    idcRoomId: number;
  }

  type IdcRackSlotCreate = {
    id: number;
    name: string;
    uNum: number;
    type: number;
    port: number;
    idcRackId: number;
    creator: string;
    createTime: string;
    updateTime: string;
    slot: number;
  }

  type IdcRackSlotUpdate = {
    id: number;
    uNum: number;
    type: number;
    port: number;
    idcRackId: number;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  type IdcFactoryCreate = {
    name: string;
    enName: string;
    cnName: string;
    modeName: string;
    description: string;
  }

  type IdcFactoryUpdate = {
    id: number;
    name: string;
    enName: string;
    cnName: string;
    modeName: string;
    description: string;
  }

  type IdcProviderCreate = {
    name: string;
    alias: string;
  }

  type IdcProviderUpdate = {
    name: string;
    alias: string;
  }

  type IdcSuitCreate = {
    name: string;
    season: string;
    type: string;
    gpu: string;
    raid: string;
    cpu: string;
    memory: string;
    storage: string;
  }

  type IdcSuitUpdate = {
    season: string;
    type: string;
    gpu: string;
    raid: string;
    cpu: string;
    memory: string;
    storage: string;
  }

  type IdcSuitCommonCreate = {
    name: string;
  }
}

declare namespace IdcResponse {
  type AzInfo = {
    id: number;
    name: string;
    cnName: string;
    region: string;
    province: string;
    type: number;
    status: number;
    creator: string;
    createTime: string;
    updateTime: string;
  }
  type IdcInfo = {
    id: number;
    name: string;
    cnName: string;
    status: number;
    physicsAzId: number;
    virtualAzId: number;
    address: string;
    region: string;
    city: string;
    cabinetNum: number;
    idcPhone: string;
    idcMail: string;
    comment: string;
    creator: string;
    createTime: string;
    updateTime: string;
    physicsAz: AzInfo;
    virtualAz: AzInfo;
  }

  type IdcRoomInfo = {
    id: number;
    roomName: string;
    idcId: number;
    idc: IdcInfo;
    pduStandard: string;
    powerMode: string;
    rackSize: string;
    bearerType: string;
    bearWeight: string;
    status: number;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  type IdcRackInfo = {
    id: number;
    name: string;
    row: string;
    col: string;
    group: string;
    uNum: number;
    ratedPower: number;
    netUNum: number;
    current: number;
    status: number;
    idcRoom: IdcRoomInfo;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  type IdcRackSlotInfo = {
    id: number;
    name: string;
    uNum: number;
    type: number;
    port: number;
    idcRackId: number;
    idcRack: IdcRackInfo;
    creator: string;
    createTime: string;
    updateTime: string;
    status: number;
    slot: number;
  }

  type IdcFactoryInfo = {
    id: number;
    name: string;
    enName: string;
    cnName: string;
    modeName: string;
    description: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  type IdcProviderInfo = {
    id: number;
    name: string;
    alias: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  type IdcSuitInfo = {
    id: number;
    name: string;
    season: string;
    type: string;
    gpu: string;
    raid: string;
    cpu: string;
    memory: string;
    storage: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  type IdcSuitSeasonInfo = {
    id: number;
    name: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  type IdcSuitTypeInfo = {
    id: number;
    name: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }

}
