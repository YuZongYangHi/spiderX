import {useIntl, useModel} from "@@/exports";
import React, {useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {
  IdcAzStatusFilter, IdcRoomBearerTypeFilter, IdcRoomBearWeightFilter,
  IdcRoomPduStandardFilter,
  IdcRoomPowerModeFilter,
  IdcRoomRackSizeFilter,
} from "@/util/dataConvert";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  createIdcRoom,
  updateIdcRoom,
  deleteIdcRoom,
  queryIdcRoomList,
  queryIdcList
} from "@/services/Idc/idc";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {Tag} from 'antd'
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  permissionsIdcRoomMenuKeys
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
  const [searchIdcName, setIdcName] = useState("");
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "idc.room.column.roomName"}),
      dataIndex: "roomName",
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.physicsName"}),
      dataIndex: "physicsAz",
      choices: (value: IdcResponse.IdcInfo, record) => record.idc.physicsAz.name,
      hideInSearch: true,
      render: (_, record) => {
        return record.idc.physicsAz.name
      }
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.virtualName"}),
      dataIndex: "virtualAz",
      hideInSearch: true,
      choices: (value: IdcResponse.IdcInfo, record) => record.idc.virtualAz.name,
      render: (_, record) => {
        return record.idc.virtualAz.name
      }
    },
    {
      title: intl.formatMessage({id: "idc.room.column.idc"}),
      dataIndex: "idcId",
      choices: (value: number) => {
        const c = tableRef.current.data.filter(item => item.idcId === value)
        return c[0].idc.name
      },
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: queryIdcList
        }

        if (searchIdcName !== "") {
          params.params["filter"] = `name=${searchIdcName}`
        }
        return RemoteRequestSelectSearch(params)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setIdcName(value)
        }
      },
      render: (_, record) => {
        return <Tag color="#2db7f5">{record.idc.name}</Tag>
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
      title: intl.formatMessage({id: "idc.room.column.pduStandard"}),
      dataIndex: "pduStandard",
      valueEnum: IdcRoomPduStandardFilter,
      valueType: "select",
      choices: (value: number) => IdcRoomPduStandardFilter[value].text
    },
    {
      title: intl.formatMessage({id: "idc.room.column.powerMode"}),
      dataIndex: "powerMode",
      valueEnum: IdcRoomPowerModeFilter,
      valueType: "select",
      choices: (value: number) => IdcRoomPowerModeFilter[value].text
    },
    {
      title: intl.formatMessage({id: "idc.room.column.rackSize"}),
      dataIndex: "rackSize",
      valueEnum: IdcRoomRackSizeFilter,
      valueType: "select",
      choices: (value: number) => IdcRoomRackSizeFilter[value].text
    },
    {
      title: intl.formatMessage({id: "idc.room.column.bearerType"}),
      dataIndex: "bearerType",
      valueEnum: IdcRoomBearerTypeFilter,
      valueType: "select",
      choices: (value: number) => IdcRoomBearerTypeFilter[value].text
    },
    {
      title: intl.formatMessage({id: "idc.room.column.bearWeight"}),
      dataIndex: "bearWeight",
      valueEnum: IdcRoomBearWeightFilter,
      valueType: "select",
      choices: (value: number) => IdcRoomBearWeightFilter[value].text
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
        checkUserUpdatePermissions(permissionsIdcRoomMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                const value = record
                delete value["fullName"]
                setCurrentRow(value)
                proModalUpdateRef.current?.proModalHandleOpen?.(true)
              }
              }
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(permissionsIdcRoomMenuKeys, userMenuPermissions) &&
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
    fetch: queryIdcRoomList,
    requestQueryFieldOptions: ["roomName", "idcId", "pduStandard", "powerMode", "rackSize", "bearerType", "bearWeight", "status"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue: {}
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(permissionsIdcRoomMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "idc.room.export.fileName",
    sheetName: "idc.room.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: permissionsIdcRoomMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: deleteIdcRoom,
    defaultSize: 'small'
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'idc.room.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateIdcRoom,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'idc.room.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createIdcRoom,
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
