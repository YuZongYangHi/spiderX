import {useIntl, useModel} from "@@/exports";
import React, {useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  createIdcSuit,
  updateIdcSuit,
  deleteIdcSuit,
  queryIdcSuitTypeList,
  queryIdcSuitSeasonList,
  queryIdcSuitList
} from "@/services/Idc/idc";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  permissionsIdcSuitMenuKeys
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
  const [suitSeasonName, setSuitSeasonName] = useState("");
  const [suitTypeName, setSuitTypeName] = useState("");
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.name"}),
      dataIndex: "name",
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.season"}),
      dataIndex: "season",
      valueType: 'select',
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "name"
          },
          params: {},
          request: queryIdcSuitSeasonList
        }

        if (suitSeasonName !== "") {
          params.params["filter"] = `name=${suitSeasonName}`
        }
        return RemoteRequestSelectSearch(params)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setSuitSeasonName(value)
        }
      },
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.type"}),
      dataIndex: "type",
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "name"
          },
          params: {},
          request: queryIdcSuitTypeList
        }

        if (suitTypeName !== "") {
          params.params["filter"] = `name=${suitTypeName}`
        }
        return RemoteRequestSelectSearch(params)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setSuitTypeName(value)
        }
      },
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.cpu"}),
      dataIndex: "cpu",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.memory"}),
      dataIndex: "memory",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.storage"}),
      dataIndex: "storage",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.raid"}),
      dataIndex: "raid",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.gpu"}),
      dataIndex: "gpu",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.nic"}),
      dataIndex: "nic",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.suit.column.psu"}),
      dataIndex: "psu",
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
        checkUserUpdatePermissions(permissionsIdcSuitMenuKeys, userMenuPermissions) &&
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
        checkUserDeletePermissions(permissionsIdcSuitMenuKeys, userMenuPermissions) &&
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
    fetch: queryIdcSuitList,
    requestQueryFieldOptions: ["name", "type", "season"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue: {}
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(permissionsIdcSuitMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "idc.suit.export.fileName",
    sheetName: "idc.suit.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: permissionsIdcSuitMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: deleteIdcSuit,
    defaultSize: 'small'
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'idc.suit.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateIdcSuit,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'idc.suit.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createIdcSuit,
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
