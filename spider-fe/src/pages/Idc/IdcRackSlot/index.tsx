import {useIntl, useModel} from "@@/exports";
import React, {useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {
  IdcAzStatusFilter, IdcRackSlotTypeFilter
} from "@/util/dataConvert";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  createIdcRackSlot,
  updateIdcRackSlot,
  deleteIdcRackSlot,
  queryIdcRackSlotList,
  queryIdcRackList,
} from "@/services/Idc/idc";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {Tag} from 'antd'
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  permissionsIdcRackSlotMenuKeys
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
      title: intl.formatMessage({id: "idc.rack.slot.column.fullName"}),
      dataIndex: "fullName",
      width: 185,
      fixed: 'left',
      hideInSearch: true,
      choices: (idcRack: IdcResponse.IdcRackInfo, record) => {
        return `${record.idcRack.idcRoom.idc.name}_${record.idcRack.idcRoom.roomName}_${record.idcRack.name}`
      },
      render: (_, record) => {
        return `${record.idcRack.idcRoom.idc.name}_${record.idcRack.idcRoom.roomName}_${record.idcRack.name}_${record.slot}`}
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.physicsName"}),
      dataIndex: "physicsAz",
      hideInSearch: true,
      choices: (idcRack: IdcResponse.IdcRackInfo, record) => record.idcRack.idcRoom.idc.physicsAz.name,
      render: (_, record) => record.idcRack.idcRoom.idc.physicsAz.name,
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.virtualName"}),
      dataIndex: "virtualAz",
      hideInSearch: true,
      choices: (idcRack: IdcResponse.IdcRackInfo, record) => record.idcRack.idcRoom.idc.virtualAz.name,
      render: (_, record) => record.idcRack.idcRoom.idc.virtualAz.name,
    },{
      title: intl.formatMessage({id: "idc.room.column.idc"}),
      dataIndex: "idc",
      hideInSearch: true,
      choices: (idcRack: IdcResponse.IdcRackInfo, record) => record.idcRack.idcRoom.idc.name,
      render: (_, record) => {
        return record.idcRack.idcRoom.idc.name
      }
    },
    {
      title: intl.formatMessage({id: "idc.room.column.roomName"}),
      dataIndex: "idcRoom",
      hideInSearch: true,
      choices: (idcRack: IdcResponse.IdcRackInfo, record) => record.idcRack.idcRoom.roomName,
      render: (_, record) => {
        return record.idcRack.idcRoom.roomName
      }
    },
    {
      title: intl.formatMessage({id: "idc.rack.column.name"}),
      dataIndex: "idcRackId",
      choices: (value: number) => {
        const c = tableRef.current.data.filter(item => item.idcRackId === value)
        return c[0].idcRack.name
      },
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: queryIdcRackList
        }

        if (searchIdcRoomName !== "") {
          params.params["filter"] = `name=${searchIdcRoomName}`
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
        return <Tag color="#2db7f5">{record.idcRack.name}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: "idc.rack.slot.column.slot"}),
      dataIndex: "slot",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.rack.slot.column.port"}),
      dataIndex: "port",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.rack.slot.column.uNum"}),
      dataIndex: "uNum",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.status"}),
      dataIndex: "status",
      valueEnum: IdcAzStatusFilter,
      valueType: "select",
      choices: (value: number) => IdcAzStatusFilter[value].text
    },
    {
      title: intl.formatMessage({id: "idc.rack.slot.column.type"}),
      dataIndex: "type",
      valueEnum: IdcRackSlotTypeFilter,
      valueType: "select",
      choices: (value: number) => IdcRackSlotTypeFilter[value].text,
      render: (_, record) => {
        return <Tag color={IdcRackSlotTypeFilter[record.type].color}>{IdcRackSlotTypeFilter[record.type].text}</Tag>
      }
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
        checkUserUpdatePermissions(permissionsIdcRackSlotMenuKeys, userMenuPermissions) &&
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
        checkUserDeletePermissions(permissionsIdcRackSlotMenuKeys, userMenuPermissions) &&
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
    fetch: queryIdcRackSlotList,
    requestQueryFieldOptions: ["idcRackId", "type", "status"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue: {}
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(permissionsIdcRackSlotMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "idc.rack.slot.export.fileName",
    sheetName: "idc.rack.slot.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: permissionsIdcRackSlotMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: deleteIdcRackSlot,
    defaultSize: 'small'
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'idc.rack.slot.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateIdcRackSlot,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'idc.rack.slot.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createIdcRackSlot,
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
