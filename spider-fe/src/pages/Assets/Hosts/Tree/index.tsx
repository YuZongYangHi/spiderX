import "./index.css"
import React, {useEffect, useState} from 'react';
import {
  Tree, Input, Divider, MenuProps, Dropdown, Space, Breadcrumb,
  Empty, Modal, message
} from 'antd';
import CreateTreeModal from './Create'
import UpdateTreeModal from './Update'
import MigrateTreeModal from './Migrate'
import {
  queryServiceTreeList, deleteTreeResource
} from '@/services/Assets/ServiceTree/api'
import { Resizable } from "re-resizable";
import {
  SearchOutlined, SyncOutlined, MoreOutlined, MenuUnfoldOutlined,
  MenuFoldOutlined, HomeOutlined, TeamOutlined, UserOutlined, EditOutlined, EllipsisOutlined,
  DeleteOutlined, NodeIndexOutlined, FolderOutlined, PlusOutlined, ExclamationCircleFilled
} from '@ant-design/icons';
import Loading from '@/components/Loading'
import {ProCard} from '@ant-design/pro-components'
import type { TreeProps } from 'antd/lib/tree';
import {useModel, useIntl, history, useParams} from "umi";
import tree from "@/models/tree";

const { confirm } = Modal;

const App: React.FC = () => {
  const intl = useIntl();
  const [collapsed, setCollapsed] = useState(true);
  const [serviceTreeMinWidth, setServiceTreeMinWidth] = useState(300);
  const [serviceTreeMaxWidth, setServiceTreeMaxWidth] = useState(600);
  const [breadCrumb, setBreadCrumb] = useState([])
  const [activeIndex, setActiveIndex] = useState(null);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  // 服务树输入框回车时候的内容
  const [searchValue, setSearchValue] = useState("")
  // 服务树搜索返回的内容
  const [searchResult, setSearchResult] = useState({})
  // 是否开始搜索
  const [prepareSearch, setPrepareSearch] = useState(false);

  // 服务树搜索框变更时候的内容
  const [searchOnChangeValue, setSearchOnchangeValue] = useState("")

  const params = useParams()

  const {
    treeList, setTreeList,
    currentTree, setCurrentTree,
    expandedKeys, setExpandedKeys,
    selectedKeys, setSelectedKeys,
    treeLoading, setTreeLoading,
    treeRawList, setTreeRawList,
    getLocationTreeInfo, getNodeExpandedKeys,
    handleCreateVisable, handleUpdateVisable,
    shouldRenderTree, handleRenderTree,
    handleMigrateVisable, watchMachineClickTree, setMachineClickTree
  } = useModel('tree');

  const treeSearchMenuItems: MenuProps['items'] = [
    {
      label: intl.formatMessage({id: 'pages.assets.hosts.tree.search.close'}),
      key: 'close',
      icon: <MenuFoldOutlined />,
      onClick: () => {
        setServiceTreeMinWidth(60)
        setServiceTreeMaxWidth(60)
        setCollapsed(false)
      }
    }
  ];

  const treeNodeTitleOptionItems: MenuProps['items'] = [
    {
      label: intl.formatMessage({id: 'pages.assets.hosts.tree.operate.add'}),
      key: 'add',
      icon: <PlusOutlined />,
      onClick: function({ item, key, keyPath, domEvent }) {
        domEvent.stopPropagation()
        handleCreateVisable(true)
      }
    },
    {
      label: intl.formatMessage({id: 'pages.assets.hosts.tree.operate.edit'}),
      key: 'edit',
      icon: <EditOutlined />,
      onClick: function({ item, key, keyPath, domEvent }) {
        domEvent.stopPropagation()
        handleUpdateVisable(true)
      }
    },
    {
      label: intl.formatMessage({id: 'pages.assets.hosts.tree.operate.migrate'}),
      key: 'migrate',
      icon: <NodeIndexOutlined />,
      onClick: function({ item, key, keyPath, domEvent }) {
        domEvent.stopPropagation()
        if (currentTree.parentId === 0) {
          message.warning(intl.formatMessage({id: 'pages.assets.hosts.tree.operate.migrate.noSupport.message'}))
          return
        }
        handleMigrateVisable(true)
      }
    },
    {
      type: 'divider',
    },
    {
      label: intl.formatMessage({id: 'pages.assets.hosts.tree.operate.delete'}),
      key: 'delete',
      danger: true,
      icon: <DeleteOutlined />,
      onClick: function({ item, key, keyPath, domEvent }) {
        domEvent.stopPropagation()
        showDeleteConfirm()
      }
    }
  ]

  const handleMouseEnter = (item) => {
    setActiveIndex(item.id)
  };

  const handleMouseLeave = () => {
    setActiveIndex(0)
  };

  const showDeleteConfirm = () => {
    confirm({
      title: <div>
        {intl.formatMessage({id: 'pages.assets.hosts.tree.operate.delete.title'})}
        &nbsp;
         <span style={{color: 'red'}}>{`{ ${currentTree.name} }`}</span>
        &nbsp;
        ?
      </div>,
      icon: <ExclamationCircleFilled />,
      content: intl.formatMessage({id: 'pages.assets.hosts.tree.operate.delete.description'}),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async ()=> {
        setTreeLoading(true)
        const data = {
          fullIdPath: currentTree.fullIdPath,
          id: currentTree.id
        }
        deleteTreeResource(data).then(res=>{
          if (res.success) {
            message.success(intl.formatMessage({id: 'component.operate.delete.successMessage'}))
            if (selectedKeys.length > 0 && (selectedKeys[0] == currentTree.fullIdPath || selectedKeys[0].startsWith(currentTree.fullIdPath))) {
              window.location.href = "/assets/hosts/server-tree"
            } else {
              syncTreeData()
            }
          }
        }).catch(error=>{
          console.log("delete tree error: ", error)
          message.error(intl.formatMessage({id: 'component.operate.delete.errorMessage'}))
          setTreeLoading(false)
        })
      },
      onCancel() {
      },
    });
  };

  const buildTree = (items: ServiceTreeResponse.TreeInfo[], pid = 0) => {
    let pItems = items.filter(s => s.parentId === pid)
    if (!pItems || pItems.length <= 0)
      return null

    let design = []
    pItems.forEach(item => {
      design.push({
        title: item.name,
        key: item.fullIdPath,
        id: item.id,
        name: item.name,
        level: item.level,
        parentId: item.parentId,
        fullNamePath: item.fullNamePath,
        fullIdPath: item.fullIdPath,
        createTime: item.createTime,
        updateTime: item.updateTime,
        icon: <TeamOutlined />
      })
    })
    design.forEach(item => {
      const res = buildTree(items, item.id)
      if (res && res.length > 0)
        item.children = [...res]
      else {
        item.icon = <UserOutlined />
      }
    })
    return [...design]
  }

  const syncTreeData = async (init = false) => {
    setTreeLoading(true)
    const result = await queryServiceTreeList()
    if (result.success) {
      setTreeRawList(result.data.list)
      const response = buildTree(result.data.list, 0)
      setTreeList([...response])
      setTreeLoading(false)

      if (init) {
        const currentTreeInfo = getLocationTreeInfo(params, result.data.list)
        if (currentTreeInfo) {
          setSelectedCursor(currentTreeInfo, result.data.list)
        }
      }
    }
  }

  useEffect(()=>{
    syncTreeData(true)
  }, [])

  useEffect(()=>{
    if (shouldRenderTree) {
      syncTreeData()
      handleRenderTree(false)
    }
  }, [shouldRenderTree])

  useEffect(() => {
    return () => {
      setSelectedKeys([]);
      setExpandedKeys([]);
    };
  }, []);

  useEffect(()=>{
    if (treeRawList.length === 0 || watchMachineClickTree === 0) {
      return
    }
    const treeId = parseInt(params['*'].split('/')[0])
    const items = treeRawList.filter(item => item.id == treeId)
    const item = items.length > 0 ? items[0] : {}
    if (item.id !== currentTree.id && Object.keys(item).length > 0) {
      setSelectedCursor(item, treeRawList)
    }
  }, [watchMachineClickTree])

  const handleBreadCrumb = (node) => {
    const nameSp = node.fullNamePath.split('/')
    const idSp = node.fullIdPath.split('/')
    const nameList = nameSp.slice(1, nameSp.length)
    const idList = idSp.slice(1, idSp.length)
    const routers = [
      {
        href: '',
        title: <HomeOutlined />,
      },
    ]
    nameList.forEach((item: string, index: number) => {
      const route = {
        path: `/${idList[index]}`,
        title: `${item}`
      }
      routers.push(route)
    })
    setBreadCrumb(routers)
  }

  const onSelect: TreeProps['onSelect'] = (currentSelectedKeys: any, info) => {
    if (currentSelectedKeys.length === 0) {
      return;
    }
    handleBreadCrumb(info.node)
    setCurrentTree(info.node)
    setSelectedKeys(currentSelectedKeys)
    if (expandedKeys) {
      setExpandedKeys([...expandedKeys, info.node.fullIdPath])
    } else {
      setExpandedKeys([info.node.fullIdPath])
    }
    setAutoExpandParent(false)
    setMachineClickTree(0)
    history.push(`/assets/hosts/server-tree/${info.node.id}/machine`)
  }

  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const treeTitleRender = (nodeData: any) => {
    return <span
              style={{display: 'inline-block', width: '80%', position: 'relative'}}
              onMouseEnter={()=>{handleMouseEnter(nodeData)}}
              onMouseLeave={handleMouseLeave}>
              <span>{nodeData.name}</span>
              <Dropdown
                menu={{items:treeNodeTitleOptionItems}}
                trigger={['click']} >
                <EllipsisOutlined onClick={(e)=>{
                  setCurrentTree(nodeData)
                  e.stopPropagation()
                  e.preventDefault()}} className={currentUser && currentUser.isAdmin && activeIndex === nodeData.id ? "tree-title-extra-operate-active" : "tree-title-extra-operate-inactive"}/>
              </Dropdown>
      </span>
  }

  const handleOnSearch = (value: string) => {
    const t = {
      dir: [],
      services: []
    }
    treeRawList.forEach((item) => {
      if (item.name.indexOf(value) !== -1)  {
        t["services"].push(item)
      }

      if (item.fullNamePath.indexOf(value) !== -1) {
        t["dir"].push(item)
      }
    })

    if (t["dir"].length > 0 || t["services"].length > 0 ) {
      setSearchResult(t)
    } else {
      setSearchResult({})
    }
  }

  const onSearchChange = (e: any) => {
    const value = e.target.value
    if (value.length === 0) {
      setPrepareSearch(false)
      setSearchValue("")
      setSearchResult({})
      return
    }
    setPrepareSearch(true)
    setSearchValue(value)
    handleOnSearch(value)
  }

  const onSearchResultClick = (item: any) => {
    setCurrentTree(item)
    setSearchResult({})
    setPrepareSearch(false)
    history.push(`/assets/hosts/server-tree/${item.id}/machine`)
  }

  const setSelectedCursor = (node: any, rawList: any) => {
    if (node) {
      handleBreadCrumb(node)
      setSelectedKeys([node.fullIdPath])
      setExpandedKeys(getNodeExpandedKeys(node, rawList))
    }
  }

  return (
        <Resizable
          minWidth={serviceTreeMinWidth}
          minHeight={"100vh"}
          maxWidth={serviceTreeMaxWidth}
          style={{position: 'relative'}}
        >
          <ProCard style={{height : "100%"}}>
            {collapsed ?
              (
                <div>
                  <Breadcrumb items={breadCrumb}/>
                  <Divider/>
                  <Input
                    value={searchOnChangeValue}
                    onChange={(e)=>{setSearchOnchangeValue(e.target.value)}}
                    style={{marginBottom: 12}}
                    placeholder="支持关键字、a/b/c路径搜索"
                    prefix={<SearchOutlined/>}
                    onPressEnter={onSearchChange}
                    suffix={
                      <>
                        <SyncOutlined style={{cursor: 'pointer'}} onClick={() => {
                          syncTreeData()
                        }}/>
                        <Dropdown menu={{items:treeSearchMenuItems}}>
                          <MoreOutlined style={{cursor: 'pointer'}}/>
                        </Dropdown>
                      </>
                    }
                  />
                  {treeLoading ? <Loading/> : searchResult && Object.keys(searchResult).length > 0 ?
                    <>
                      <p className="tree-search-result-title">服务</p>
                      <div style={{marginBottom: 14}}>
                      {
                        searchResult["services"] && searchResult["services"].map((item, index) => (
                          <div key={`tree-search-result-service-parent-${index}`} className="tree-search-result-content" onClick={()=>{
                            onSearchResultClick(item)
                            setSelectedCursor(item, treeRawList)
                          }}>
                            <Space size={3} key={`parent${index}`}>
                              <span key={`${index}-service-icon`}><TeamOutlined/></span>
                              <span key={`${index}-service-name`}>{item.name}</span>
                            </Space>
                          </div>
                        ))
                      }
                      </div>
                      <p className="tree-search-result-title">服务目录</p>
                      {
                        searchResult["dir"] && searchResult["dir"].map((item, index) => (
                          <div key={`tree-search-result-dir-parent-${index}`} className="tree-search-result-content" onClick={()=>{
                            onSearchResultClick(item)
                            setSelectedCursor(item, treeRawList)
                          }}>
                            <Space size={3} key={`parent${index}`}>
                              <span key={`${index}-dir-icon`}><FolderOutlined /></span>
                              <span key={`${index}-dir-name`}>{item.fullNamePath}</span>
                            </Space>
                          </div>
                        ))
                      }
                    </>
                    :
                    Object.keys(searchResult).length === 0 && prepareSearch ? <div style={{marginTop: 12}}><Empty/></div>:  <Tree
                    rootStyle={{
                      marginTop: 12,
                    }}
                    autoExpandParent={autoExpandParent}
                    showIcon
                    blockNode
                    onSelect={onSelect}
                    onExpand={onExpand}
                    selectedKeys={selectedKeys}
                    expandedKeys={expandedKeys}
                    titleRender={nodeData=> {return treeTitleRender(nodeData)}}
                    treeData={treeList}/>}
                </div>
              )
              : ( <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                  <MenuUnfoldOutlined  style={{cursor: 'pointer'}} onClick={() => {
                    setServiceTreeMinWidth(300)
                    setServiceTreeMaxWidth(600)
                    setCollapsed(true)
                    setSearchValue("")
                  }}/>
                  <SyncOutlined style={{cursor: 'pointer'}} onClick={() => {
                    syncTreeData()
                  }}/>
                </Space>
              )
            }
            <CreateTreeModal/>
            <UpdateTreeModal/>
            <MigrateTreeModal/>
          </ProCard>
        </Resizable>
  )
};

export default App;
