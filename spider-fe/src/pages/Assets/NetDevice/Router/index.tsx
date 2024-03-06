import {useIntl, useModel} from "@@/exports";
import React, {useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  createRouter,
  deleteRouter,
  updateRouter,
  queryRouterList
} from "@/services/Assets/NetDevice/Router/api";
import {queryIpList} from '@/services/Assets/Ip/api'
import {queryNodeList} from '@/services/Assets/Node/api'
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  assetsNetDeviceRouterPermissionsMenuKeys
} from "@/access";
import {Button, Tag} from "antd";
import ProTable from "@/components/ProTable";
import {clickExtender} from "@/components/Style/style";
import {ProModelCreateFormItems, ProModelUpdateFormItems} from "./form";
import DesignProModalForm from "@/components/ProModal";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";
import ColumnConvert from '@/util/ProTableColumnConvert'
import {queryIdcFactoryList} from "@/services/Idc/idc";

export default () => {
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const proModalUpdateRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const [searchNode, setSearchNode] = useState("");
  const [searchFactory, setFactory] = useState("");
  const [searchIp, setIp] = useState("");
  const [searchRackSlot, setRackSlot] = useState("");
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "assets.netDevice.column.name"}),
      dataIndex: "name",
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "assets.netDevice.column.sn"}),
      dataIndex: "sn",
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "assets.netDevice.column.ip"}),
      dataIndex: "ipNetId",
      valueType: 'select',
      choices: (value: number, record: any) => {return record.ip.ip},
      request: async () => {
        const params = {}
        if (searchIp !== "") {
          params["filter"] = `ip=${searchIp}`
        }

        const result = await queryIpList(params)
        if (!result.success) {
          return []
        }
        return result.data.list.map(item => {
          return {
            label: item.ip,
            value: item.id
          }
        })
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setSearchNode(value)
        }
      },
    },
    {
      title: intl.formatMessage({id: "assets.netDevice.column.netmask"}),
      dataIndex: "ip",
      hideInSearch: true,
      render: (_, record) => record.ip.netmask,
      choices: (value: number, record: any) => {return record.ip.netmask},
    },
    {
      title: intl.formatMessage({id: "assets.netDevice.column.gateway"}),
      dataIndex: "ip",
      hideInSearch: true,
      render: (_, record) => record.ip.gateway,
      choices: (value: number, record: any) => {return record.ip.gateway},
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.nodeName"}),
      dataIndex: "nodeId",
      valueType: 'select',
      choices: (value: number, record: any) => {return record.node.name},
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: queryNodeList
        }

        if (searchNode !== "") {
          params.params["filter"] = `name=${searchNode}`
        }
        return RemoteRequestSelectSearch(params)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setIp(value)
        }
      },
    },
    {
      title: intl.formatMessage({id: "assets.netDevice.column.factory"}),
      dataIndex: "factoryId",
      valueType: 'select',
      choices: (value: number, record: any) => {return record.factory.name},
      request: async () => {
        const params = {}
        if (searchFactory !== "") {
          params["filter"] = `name=${searchFactory}`
        }

        const result = await queryIdcFactoryList(params)
        if (!result.success) {
          return []
        }
        return result.data.list.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setFactory(value)
        }
      },
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.status"}),
      dataIndex: "status",
      valueType: 'select',
      valueEnum: ColumnConvert["assets.netDevice.status"],
      choices: (value: number, record: any) => ColumnConvert["assets.netDevice.status"][record.status].text,
    },
    {
      title: intl.formatMessage({id: "assets.netDevice.column.rackSlot"}),
      dataIndex: "rackSlot",
      hideInSearch: true,
      render: (_, data) => `${data.rackSlot.idcRack.idcRoom.idc.name}_${data.rackSlot.idcRack.idcRoom.roomName}_${data.rackSlot.idcRack.name}_${data.rackSlot.slot}`,
      choices: (value: number, data: any) => `${data.rackSlot.idcRack.idcRoom.idc.name}_${data.rackSlot.idcRack.idcRoom.roomName}_${data.rackSlot.idcRack.name}_${data.rackSlot.slot}`,
    },
    {
      title: intl.formatMessage({id: "assets.netDevice.column.username"}),
      dataIndex: "username",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "assets.netDevice.column.password"}),
      dataIndex: "password",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.creator"}),
      dataIndex: "creator",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.description"}),
      hideInSearch: true,
      dataIndex: "description",
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.createTime"}),
      dataIndex: "createTime",
      hideInSearch: true,
      valueType: 'dateTime'
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.updateTime"}),
      dataIndex: "updateTime",
      hideInSearch: true,
      valueType: 'dateTime'
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (dom, record) => [
        checkUserUpdatePermissions(assetsNetDeviceRouterPermissionsMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                const value = record
                setCurrentRow(value)
                proModalUpdateRef.current?.proModalHandleOpen?.(true)}}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(assetsNetDeviceRouterPermissionsMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{tableRef.current?.deleteAction(record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  const handleOnUpdateCancel = () => {
    tableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const fetchParams: fetchParamsType = {
    fetch: queryRouterList,
    requestQueryFieldOptions: ["status", "nodeId", "sn", "rackSlotId", "factoryId", "ipNetId", "name"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue:  {description: {show: false}, username: {show: false}, password: {show: false}}
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(assetsNetDeviceRouterPermissionsMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "assets.netDevice.router.export.fileName",
    sheetName: "assets.netDevice.router.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    bread: true,
    columns: columns,
    permissionsMenuKeys: assetsNetDeviceRouterPermissionsMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: deleteRouter,
    defaultSize: 'small'
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'assets.netDevice.router.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateRouter,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'assets.netDevice.router.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createRouter,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail'
  }

  return (
    <div style={{width: "100%"}}>
      <ProTable {...TableProps} ref={tableRef} />
      <DesignProModalForm
        {...ProModalUpdateParams}
        ref={proModalUpdateRef}
      />
      <DesignProModalForm
        {...ProModalCreateParams}
        ref={proModalCreateRef}
      />
    </div>
  )
}
