import {useIntl, useModel} from "@@/exports";
import React, {useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {
  IdcAzStatusFilter} from "@/util/dataConvert";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  createIdcRack,
  updateIdcRack,
  deleteIdcRack,
  queryIdcRackList,
  queryIdcRoomList,
} from "@/services/Idc/idc";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {Tag} from 'antd'
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  permissionsIdcRackMenuKeys
} from "@/access";
import {Button} from "antd";
import ProTable from "@/components/ProTable";
import {clickExtender} from "@/components/Style/style";
import {ProModelCreateFormItems, ProModelUpdateFormItems} from "./form";
import DesignProModalForm from "@/components/ProModal";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";

export default () => {
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const proModalUpdateRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const [searchIdcRoomName, setIdcRoomName] = useState("");
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "idc.rack.column.name"}),
      dataIndex: "name",
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.physicsName"}),
      dataIndex: "physicsAz",
      hideInSearch: true,
      choices: (value: IdcResponse.IdcRoomInfo, record) => record.idcRoom.idc.physicsAz.name,
      render: (_, record) => record.idcRoom.idc.physicsAz.name,
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.virtualName"}),
      dataIndex: "virtualAz",
      hideInSearch: true,
      choices: (value: IdcResponse.IdcRoomInfo, record) => record.idcRoom.idc.virtualAz.name,
      render: (_, record) => record.idcRoom.idc.virtualAz.name,
    },
    {
      title: intl.formatMessage({id: "idc.room.column.idc"}),
      dataIndex: "idcRoom",
      hideInSearch: true,
      choices: (value: IdcResponse.IdcRoomInfo, record) => record.idcRoom.idc.name,
      render: (_, record) => record.idcRoom.idc.name,
    },
    {
      title: intl.formatMessage({id: "idc.room.column.roomName"}),
      dataIndex: "idcRoomId",
      choices: (value: number) => {
        const c = tableRef.current.data.filter(item => item.idcRoomId === value)
        return c[0].idcRoom.roomName
      },
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "roomName",
            value: "id"
          },
          params: {},
          request: queryIdcRoomList
        }

        if (searchIdcRoomName !== "") {
          params.params["filter"] = `roomName=${searchIdcRoomName}`
        }
        return RemoteRequestSelectSearch(params)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setIdcRoomName(value)
        }
      },
      render: (_, record) => {
        return <Tag color="#2db7f5">{record.idcRoom.roomName}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.status"}),
      dataIndex: "status",
      valueEnum: IdcAzStatusFilter,
      valueType: "select",
      choices: (value: number) => IdcAzStatusFilter[value].text
    },
    {
      title: intl.formatMessage({id: "idc.rack.column.row"}),
      dataIndex: "row",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.rack.column.col"}),
      dataIndex: "col",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.rack.column.group"}),
      dataIndex: "group",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.rack.column.uNum"}),
      dataIndex: "uNum",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.rack.column.ratedPower"}),
      dataIndex: "ratedPower",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.rack.column.netUNum"}),
      dataIndex: "netUNum",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.rack.column.current"}),
      dataIndex: "current",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.creator"}),
      dataIndex: "creator",
      hideInSearch: true
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
        checkUserUpdatePermissions(permissionsIdcRackMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                const value = record
                setCurrentRow(value)
                proModalUpdateRef.current?.proModalHandleOpen?.(true)
              }
              }
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(permissionsIdcRackMenuKeys, userMenuPermissions) &&
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
    fetch: queryIdcRackList,
    requestQueryFieldOptions: ["name", "idcRoomId", "status"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue: {}
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(permissionsIdcRackMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "idc.rack.export.fileName",
    sheetName: "idc.rack.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: permissionsIdcRackMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: deleteIdcRack,
    defaultSize: 'small'
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'idc.rack.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateIdcRack,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'idc.rack.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createIdcRack,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail'
  }

  return (
    <>
      <ProTable {...TableProps} ref={tableRef} />
      <DesignProModalForm
        {...ProModalUpdateParams}
        ref={proModalUpdateRef}
      />
      <DesignProModalForm
        {...ProModalCreateParams}
        ref={proModalCreateRef}
      />
    </>
  )
}
