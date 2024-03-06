import {Access, useAccess, useModel, useIntl, history} from 'umi';
import {
  assetsNodePermissionsMenuKeys,
  checkUserDeletePermissions,
  checkUserHavePageReadPermissions, checkUserUpdatePermissions,
  checkUserCreatePermissions
} from "@/access";
import ForbiddenPage from "@/pages/403";
import {ActionType, PageContainer, ProColumns, ProTable, ColumnsState} from '@ant-design/pro-components'
import React, {useEffect, useRef, useState} from "react";
import {
  Button, Flex, MenuProps, Tag, Dropdown,
  message, Space, Modal, Checkbox, Upload, UploadProps, UploadFile,
} from "antd";
import {
  queryNodeList, deleteNode, updateNode, addNode, updateNodeStatus, multiDelete, multiImport
} from '@/services/Assets/Node/api'
import {fetchParamsType} from "@/util/ProTableRequest/type";
import fetchUtil from '@/util/ProTableRequest/index'
import {SortOrder} from "antd/lib/table/interface";
import {buildTree} from '@/util/Tree/tree'
import {queryServiceTreeList} from '@/services/Assets/ServiceTree/api'
import {
  DeleteOutlined, WarningOutlined, CheckOutlined, InboxOutlined,
  DownOutlined, UploadOutlined, ExclamationCircleFilled
} from '@ant-design/icons'
import {
  nodeAttributeConvert,
  nodeOperatorFilter,
  nodeStatusFilter,
  nodeAttributeFilter,
  nodeGradeFilter,
  nodeContractFilter,
  regionFilter,
  provinceHandleFilter,
  nodeIsDeletedFilter
} from '@/util/dataConvert'
import {clickExtender} from "@/components/Style/style";
import Loading from "@/components/Loading";
import {PopconfirmType} from "@/components/Popconfirm/typing";
import ProPopConfirm from '@/components/Popconfirm'
import {ProDrawerNodeCreateFormItems, ProDrawerNodeUpdateFormItems} from './form'
import ProDrawerForm from '@/components/ProDrawerForm'
import ExportJsonExcel from "js-export-excel"
import moment from 'moment'

const { confirm } = Modal;
const { Dragger } = Upload;

const fetchParams: fetchParamsType = {
  requestQueryFieldOptions: [
    "name", "cnName", "operator", "contract", "status",
    "attribute", "grade", "region", "province", "bandwidth",
    "productLines", "isDeleted"
  ],
  requestQuery: {},
  requestParams: [],
  fetch: queryNodeList
}

const provinceFilter = provinceHandleFilter()

export default () => {
  const intl = useIntl()
  const access = useAccess();
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<NodeResponse.NodeInfo[]>([]);
  const [currentRow, setCurrentRow] = useState<NodeResponse.NodeInfo>({});
  const [productLines, setProductLines] = useState([])
  const [loading, setLoading] = useState<boolean>(false);
  const deleteRef = useRef();
  const proDrawerFormCreateRef = useRef(null);
  const proDrawerFormUpdateRef = useRef(null);
  const [selectRowValues, setSelectRowValues] = useState<NodeResponse.NodeInfo[]>([]);
  const [polling, setPolling] = useState<number>(0);
  const [multiUploadOpen, setMultiUploadOpen] = useState(false);
  const [multiUploadConfirm, setMultiUploadConfirm] = useState(false);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [uploadFileDisable, setUploadFileDisbled] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleMultiUploadOk = () => {
    if (uploadFileList.length === 0) {
      message.warning(intl.formatMessage({id: 'assets.node.toolBar.table.import.empty'}))
      return
    }
    setUploadFileDisbled(true)
    setMultiUploadConfirm(true)
    const formData = new FormData();
    uploadFileList.forEach((file) => {
      formData.append('file', file);
    });

    multiImport(formData).then((res=>{
      if (res.success) {
        const msg = (<div>
          <p>{intl.formatMessage({id: 'assets.node.toolBar.table.import.response.success'})}: {res.data.list.success}, {intl.formatMessage({id: 'assets.node.toolBar.table.import.response.error'})}: {res.data.list.error}</p>
        </div>)
        const cfg = {
          type: 'success',
          content: msg,
          duration: 3,
        }

        if (res.data.list.error > 0) {
          cfg.type = "warning"
          messageApi.open(cfg)
          setUploadFileDisbled(false)
          setMultiUploadConfirm(false)
        } else {
          messageApi.open(cfg)
          actionRef.current?.reload()
          handleMultiUploadCancel()
        }
    }
    }))
  }

  const handleMultiUploadCancel = () => {
    setUploadFileList([])
    setMultiUploadOpen(false)
    setUploadFileDisbled(false)
    setMultiUploadConfirm(false)
  }

  const uploadProps: UploadProps = {
    disabled: uploadFileDisable,
    name: 'file',
    multiple: false,
    fileList: uploadFileList,
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 <= 10
      if (!isLt10M) {
        message.error(intl.formatMessage({id: 'assets.node.toolBar.table.import.size'}))
        return
      }
      if ( file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
        setUploadFileList([file])
        //setUploadFileList([...uploadFileList, file])
      } else {
        message.error(intl.formatMessage({id: 'assets.node.toolBar.table.import.type'}))
      }
    },
    onRemove: (file) => {
      setUploadFileList([])
      return
      const index = uploadFileList.indexOf(file);
      const newFileList = uploadFileList.slice();
      newFileList.splice(index, 1);
      setUploadFileList(newFileList);
    },
  };

  const ProDrawerNodeUpdateParams: ProModal.Params = {
    formItems: ProDrawerNodeUpdateFormItems(productLines),
    title: "assets.node.update.title",
    width: "600px",
    params: [currentRow.id],
    initialValues: currentRow,
    handleOnCancel: () => {actionRef.current.reload()},
    request: updateNode,
    successMessage: "assets.node.update.success.message",
    errorMessage: "assets.node.update.error.message",
  }
  const ProDrawerNodeCreateParams: ProModal.Params = {
    formItems: ProDrawerNodeCreateFormItems(productLines),
    title: "assets.node.create.title",
    width: "600px",
    params: [],
    initialValues: {},
    handleOnCancel: () => {actionRef.current.reload()},
    request: addNode,
    successMessage: "assets.node.create.success.message",
    errorMessage: "assets.node.create.error.message",
  }
  const handleOnDelete = async () => {
    deleteRef.current.setConfirmLoading(true)
    const result = await deleteNode(currentRow.id)
    if (result.success) {
      message.success(intl.formatMessage({id: 'assets.node.table.option.delete.success'}))
      deleteRef.current.setOpen(false)
      deleteRef.current.setConfirmLoading(false)
      actionRef.current?.reload()
    }else {
      message.error(result.errorMessage)
    }
  }
  const deleteParams: PopconfirmType = {
    title: `${intl.formatMessage({id: 'assets.node.table.option.delete.title'})}`,
    description: intl.formatMessage({id: 'assets.node.table.option.delete.description'}),
    element: <><DeleteOutlined />&nbsp;&nbsp;{intl.formatMessage({id: 'assets.node.table.option.delete'})}</>,
    onConfirm: handleOnDelete,
  }

  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    region: {
      show: false,
    },
    city: {
      show: false,
    },
    comment: {
      show: false,
    },
    contract: {
      show: false,
    },
    grade: {
      show: false
    },
    bandwidth: {
      show: false
    }
  });

  const handleUpdateStatus = async (id: number, status: number, messageId: string) => {
    const body = {
      status: status
    }
    const result = await updateNodeStatus(id, body)
    if (result.success) {
      message.success(intl.formatMessage({id: messageId}))
      actionRef.current?.reload()
      return
    }
    console.log(result.errorMessage)
  }

  const optionMoreItems: MenuProps['items'] = [
    currentRow.status === 9 ?
      {
        label: intl.formatMessage({id: 'assets.node.table.option.online'}),
        key: 'online',
        icon: <CheckOutlined />,
        onClick: async ({item, key, keyPath, domEvent}) => {
          domEvent.stopPropagation()
          await handleUpdateStatus(currentRow.id, 2, 'assets.node.table.option.online.message')
        }
      } :
      {
        label: intl.formatMessage({id: 'assets.node.table.option.offline'}),
        key: 'offline',
        icon: <WarningOutlined />,
        onClick: async ({item, key, keyPath, domEvent}) => {
          domEvent.stopPropagation()
          await handleUpdateStatus(currentRow.id, 9, 'assets.node.table.option.offline.message')
        }
      },
    {
      type: 'divider'
    }, {
      label: <ProPopConfirm {...deleteParams} ref={deleteRef} />,
      key: 'delete',
      danger: true,
      //icon: <DeleteOutlined />,
      onClick: async ({item, key, keyPath, domEvent}) => {

      }
    },
  ]

  const handleUpdate = (record: NodeResponse.NodeInfo) => {
    if (record.isDeleted === 1) {
      message.error(intl.formatMessage({id: 'assets.node.table.option.edit.offline.message'}))
      return
    }
    setCurrentRow(record)
    proDrawerFormUpdateRef?.current?.proDrawerRefHandleOpen?.(true)
  }

   const columns: ProColumns<NodeResponse.NodeInfo>[] = [
    {
      title: intl.formatMessage({id: 'assets.node.table.column.id'}),
      dataIndex: 'id',
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.name'}),
      dataIndex: 'name',
      width: 100,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.cnName'}),
      dataIndex: 'cnName',
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.operator'}),
      dataIndex: 'operator',
      valueType: 'select',
      valueEnum: nodeOperatorFilter,
      choices: (value: number) => nodeOperatorFilter[value].text
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.status'}),
      dataIndex: 'status',
      valueType: 'select',
      sorter: (a: NodeResponse.NodeInfo, b: NodeResponse.NodeInfo) => a.status - b.status,
      valueEnum: nodeStatusFilter,
      choices: (value: number) => nodeStatusFilter[value].text
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.attribute'}),
      dataIndex: 'attribute',
      valueType: 'select',
      valueEnum: nodeAttributeFilter,
      choices: (value: number) => nodeAttributeFilter[value].text,
      render: (_, record) => {
        return <Tag color="processing">{nodeAttributeConvert[record.attribute]}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.grade'}),
      dataIndex: 'grade',
      valueType: 'select',
      valueEnum: nodeGradeFilter,
      choices: (value: number) => nodeGradeFilter[value].text,
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.region'}),
      dataIndex: 'region',
      valueType: 'select',
      valueEnum: regionFilter,
      choices: (value: number) => regionFilter[value].text,
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.province'}),
      dataIndex: 'province',
      valueType: 'select',
      fieldProps: {
        showSearch: true
      },
      valueEnum: provinceFilter,
      choices: (value: number) => provinceFilter[value].text,
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.contract'}),
      dataIndex: 'contract',
      valueType: 'select',
      valueEnum: nodeContractFilter,
      choices: (value: number) => nodeContractFilter[value].text,
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.bandwidth'}),
      dataIndex: 'bandwidth',
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.productLines'}),
      dataIndex: 'productLines',
      valueType: 'treeSelect',
      fieldProps: {
        options: productLines,
        fieldNames: {
          children: 'children',
          label: 'name',
          value: 'id',
        },
        showSearch: true,
        autoClearSearchValue: true,
        filterTreeNode: true,
        multiple: true,
        treeNodeFilterProp: 'id',
        treeNodeLabelProp: 'fullNamePath'
      },
      choices: (value: any) => {
        return value.map((item, index)=>{
          return item.fullNamePath
        })
      },
      render: (_, record) => {
        return <Flex wrap="wrap" gap="small">
          {record.productLines.map((item, index)=>(
            <Tag style={{cursor: 'pointer'}} onClick={()=>{history.push(`/assets/hosts/server-tree/${item.id}/machine`)}} key={index}>{item.fullNamePath}</Tag>
          ))}
        </Flex>
      }
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.isDeleted'}),
      dataIndex: 'isDeleted',
      hideInTable: true,
      valueType: 'select',
      valueEnum: nodeIsDeletedFilter,
      choices: (value: number) => nodeIsDeletedFilter[value].text
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.creator'}),
      dataIndex: 'creator',
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.comment'}),
      dataIndex: 'comment',
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.createTime'}),
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      choices: (value: string) => moment(value).format("YYYY-MM-DD hh:mm:ss")
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.updateTime'}),
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      choices: (value: string) => moment(value).format("YYYY-MM-DD hh:mm:ss")
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.option'}),
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) =>  [
        checkUserHavePageReadPermissions(assetsNodePermissionsMenuKeys, access, userMenuPermissions) &&
        <span style={clickExtender}
              key="look"
              onClick={()=>{
                window.open(`/assets/nodes/${record.id}/detail`)
              }}
        >
            {intl.formatMessage({id: 'assets.node.table.option.detail'})}
        </span>,
        record.isDeleted !== 1 &&
        checkUserUpdatePermissions(assetsNodePermissionsMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="edit"
              onClick={()=>{handleUpdate(record)}}
        >
            {intl.formatMessage({id: 'assets.node.table.option.edit'})}
        </span>,
        record.isDeleted !== 1 && checkUserDeletePermissions(assetsNodePermissionsMenuKeys, userMenuPermissions) &&
        <Dropdown key="more" trigger={['click']} menu={{items: optionMoreItems }} >
          <span key="more-span" style={clickExtender} onClick={()=>{setCurrentRow(record)}}>
            {intl.formatMessage({id: 'assets.node.table.option.more'})} <DownOutlined />
          </span>
        </Dropdown>
      ]
    },
  ]

  const multiDeleteHandle = (selectRows: NodeResponse.NodeInfo[]) => {
    return confirm({
      title: intl.formatMessage({id: 'assets.node.table.alert.option.multiDelete.title'}),
      icon: <ExclamationCircleFilled />,
      content: <div><Flex wrap="wrap" gap="small">
        {
          selectRows.map((item, index)=>{
            return (<span key={index}>{item.name}</span>)
          })
        }
      </Flex></div>,
      onOk() {
        const data = {
          ids: selectRows.map((item)=>item.id)
        }
        return multiDelete(data).then((res=>{
          message.success(intl.formatMessage({id: 'assets.node.table.option.delete.success'}))
          actionRef.current?.reload()
          setSelectRowValues([])
        })).catch(err=>{
          message.error(intl.formatMessage({id: 'assets.node.table.option.delete.error'}))
          console.log(err)
        })
      },
      onCancel() {},
    });
  };

  useEffect(()=>{
    queryServiceTreeList().then(result=>{
      if (result.success) {
        const response = buildTree(result.data.list, 0)
        setProductLines(response)
      }
    })
  }, [])

  const fetch = async (params: object, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
    const result = await fetchUtil(fetchParams, params, sort, filter)
    if (result.success) {
      setData(result.data)
    }
    return result
  }

  const getSelectRowKeys = () => {
      return selectRowValues.map((item: NodeResponse.NodeInfo)=>{return item.id})
  }

  const exportExcel = (data: NodeResponse.NodeInfo[]) => {
    if (data.length === 0) {
      return
    }
    const option = {};
    option.fileName = `${intl.formatMessage({id: 'assets.node.table.alert.option.export.fileName'})}${moment().format("YYYYMMDDHHmm")}`;
    option.datas = [
      {
        sheetData: data.map(item => {
          const result = {};
          columns.forEach(c => {
            console.log()
            result[c.dataIndex] = c.hasOwnProperty("choices") && c.choices(item[c.dataIndex]) || item[c.dataIndex];
          });
          return result;
        }),
        sheetName: intl.formatMessage({id: 'assets.node.table.alert.option.export.fileName'}),
        sheetFilter: columns.map(item => item.dataIndex),
        sheetHeader: columns.map(item => item.valueType !== "option" && item.title || ""),
        columnWidths: columns.map(() => 10),
      }
    ];

    const result = []

    for (let elem of option.datas[0].sheetData) {
      result.push(elem)
    }
    option.datas[0].sheetData = result
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };
  const eventPollingChange = (e) => {
    if (e.target.checked) {
      setPolling(2000);
      return
    }
    setPolling(0);
  }
  return (
    <Access
      accessible={checkUserHavePageReadPermissions(assetsNodePermissionsMenuKeys, access, userMenuPermissions)}
      fallback={<ForbiddenPage/>}>
      <PageContainer title={false}>
        {loading ? <Loading/> :
          <ProTable
            rowKey={'id'}
            columnsState={{
              value: columnsStateMap,
              onChange: setColumnsStateMap,
            }}
            defaultSize="small"
            form={{
              syncToInitialValues: false,
              syncToUrl:false
            }}
            rowSelection={{
              // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
              // 注释该行则默认不显示下拉选项
              selections: [],
              defaultSelectedRowKeys: [],
              selectedRowKeys: getSelectRowKeys(),
             // onChange: (_,selectedRows) =>setSelectRowValues(selectedRows),
              onSelect: (record, selected) => setSelectRowValues(selected ? Array.from(new Set([...selectRowValues, record])) : selectRowValues.filter(o => o !== record)),
              onSelectAll: (selected, selectedRows, changeRows) => setSelectRowValues(selected ? Array.from(new Set([...selectedRows, ...selectedRows.filter(o => o).map(o => o)])) : selectRowValues.filter(o => !changeRows.find(row => row === o)))
            }}
            tableAlertRender={({
                                 selectedRowKeys,
                                 selectedRows,
                                 onCleanSelected,
                               }) => {
              return (
                <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginInlineStart: 8 }} onClick={()=>{setSelectRowValues([])}}>
                取消选择
              </a>
            </span>

                  <span>{`运行中数量: ${selectedRows.reduce(
                    (pre, item) => {
                      if (item.status === 2) {
                         return pre + 1
                      }
                      return pre
                    },
                    0,
                  )} 个`}</span>

                </Space>
              );
            }}
            tableAlertOptionRender={() => {
              return (
                <Space size={16}>
                  <a href={"#"} onClick={()=>{multiDeleteHandle(selectRowValues)}}>{intl.formatMessage({id: 'assets.node.table.alert.option.multiDelete'})}</a>
                  <a href={"#"} onClick={()=>{exportExcel(selectRowValues)}}>{intl.formatMessage({id: 'assets.node.table.alert.option.exportData'})}</a>
                </Space>
              );
            }}
            actionRef={actionRef}
            columns={columns}
            pagination={{
              showSizeChanger: true,
            }}
            request={fetch}
            scroll={{x: 'max-content'}}
            polling={polling}
            toolBarRender={()=>[
              checkUserCreatePermissions(assetsNodePermissionsMenuKeys, userMenuPermissions) && <Button key="in" onClick={()=>{setMultiUploadOpen(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.import'})} <UploadOutlined /></Button>,
              checkUserCreatePermissions(assetsNodePermissionsMenuKeys, userMenuPermissions) && <Button key="export" onClick={()=>{exportExcel(data)}} >{intl.formatMessage({id: 'assets.node.toolBar.export'})} <DownOutlined /></Button>,
              checkUserCreatePermissions(assetsNodePermissionsMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proDrawerFormCreateRef?.current?.proDrawerRefHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
              <Checkbox onChange={eventPollingChange}>{intl.formatMessage({id: 'assets.node.toolBar.table.start.polling'})}</Checkbox>
            ]}
          />
        }
        <ProDrawerForm {...ProDrawerNodeCreateParams} ref={proDrawerFormCreateRef}  />
        <ProDrawerForm {...ProDrawerNodeUpdateParams} ref={proDrawerFormUpdateRef}  />
        <Modal
          maskClosable={false}
          title={intl.formatMessage({id: 'assets.node.toolBar.table.import'})}
          open={multiUploadOpen}
          onOk={handleMultiUploadOk}
          confirmLoading={multiUploadConfirm}
          onCancel={handleMultiUploadCancel}
          destroyOnClose={true}
        >
          <>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{intl.formatMessage({id: 'assets.node.toolBar.table.import.title'})}</p>
            <p className="ant-upload-hint">
              {intl.formatMessage({id: 'assets.node.toolBar.table.import.description'})}
            </p>
          </Dragger>
            <div style={{height: 10, marginTop: 5, marginBottom: 20}}>
            <a style={{float: 'right'}} href="/files/spider-node-import-example.xlsx">{intl.formatMessage({id: 'assets.node.toolBar.table.import.templateName'})}</a>
            </div>
          </>
        </Modal>
        {contextHolder}
      </PageContainer>
    </Access>
  )
}
