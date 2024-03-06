import React, {useState} from "react";

export default () => {
  // 服务树列表
  const [treeList, setTreeList] = useState([]);

  // 当前点击的服务树数据
  const [currentTree, setCurrentTree] = useState({});

  // （受控）展开指定的树节点
  const [expandedKeys, setExpandedKeys] = useState();

  // （受控）设置选中的树节点，多选需设置 multiple 为 true
  const [selectedKeys, setSelectedKeys] = useState()

  // 服务树的加载
  const [treeLoading, setTreeLoading] = useState(true)

  // 后端返回的服务树原始数据
  const [treeRawList, setTreeRawList] = useState([]);

  // 重新生成树拓扑
  const [shouldRenderTree, handleRenderTree] = useState(false)

  const [createVisable, handleCreateVisable] = useState(false)

  const [updateVisable, handleUpdateVisable] = useState(false)

  const [migrateVidable, handleMigrateVisable] = useState(false)

  // 监听主机点击服务树跳转后，更新点击拓扑
  const [watchMachineClickTree, setMachineClickTree] = useState(0);

  const getLocationTreeId = (params: any) => {
    if (params["*"]) {
      return parseInt(params["*"].split("/")[0])
    }
    return 0
  }

  const fetchTreeInfoById = (nodes: any, treeId: number): any => {
    let nodeInfo: any
    nodes.forEach((item: any)=>{
      if (item.id === treeId) {
        nodeInfo = item
      }
    })
    return nodeInfo
  }

  const getLocationTreeInfo = (params: any, rawList: any) => {
    const globalTreeId = getLocationTreeId(params)
    if (globalTreeId > 0)
      return fetchTreeInfoById(rawList, globalTreeId)
    }

  const getNodeExpandedKeys = (nodeInfo: any, rawNodeList: any) => {
    const expandedKeyList = []
    rawNodeList.forEach(item => {
      if (nodeInfo.fullIdPath.indexOf(item.fullIdPath) !== -1) {
        expandedKeyList.push(item.fullIdPath)
      }
    })
    // @ts-ignore
    return expandedKeyList
  }

  const buildTreeSelect = (items: ServiceTreeResponse.TreeInfo[], pid: number = 0) => {
    let pItems = items.filter(s => s.parentId === pid)
    if (!pItems || pItems.length <= 0)
      return null

    let design = []
    pItems.forEach(item => {
      design.push({
        title: item.name,
        key: item.id,
        id: item.id,
        fullNamePath: item.fullNamePath,
        value: item.id
      })
    })
    design.forEach(item => {
      const res = buildTreeSelect(items, item.id)
      if (res && res.length > 0)
        item.children = [...res]
    })
    return [...design]
  }

  const getCurrentTreePatentNamePath = (node: any) => {
    if (Object.keys(node).length === 0) {
      return ""
    }
    const list = node.fullNamePath.split('/')
    let fullNamePath = ""
    list.forEach(item=>{
      if (item && item != node.name) {
        fullNamePath += `/${item}`
      }
    })
    return fullNamePath
  }
  return {
    treeList, setTreeList,
    currentTree, setCurrentTree,
    expandedKeys, setExpandedKeys,
    selectedKeys, setSelectedKeys,
    treeLoading, setTreeLoading,
    treeRawList, setTreeRawList,
    getLocationTreeId, fetchTreeInfoById,
    getLocationTreeInfo, getNodeExpandedKeys,
    createVisable, handleCreateVisable,
    updateVisable, handleUpdateVisable,
    shouldRenderTree, handleRenderTree,
    migrateVidable, handleMigrateVisable,
    buildTreeSelect, getCurrentTreePatentNamePath,
    watchMachineClickTree, setMachineClickTree
  }
}
