import {useIntl, useModel} from "@@/exports";
import React, {useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  createIdcSuitType,
  updateIdcSuitType,
  deleteIdcSuitType,
  queryIdcSuitTypeList,
} from "@/services/Idc/idc";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  permissionsIdcSuitTypeMenuKeys
} from "@/access";
import {Button} from "antd";
import ProTable from "@/components/ProTable";
import {clickExtender} from "@/components/Style/style";
import {ProModelCreateFormItems, ProModelUpdateFormItems} from "./form";
import DesignProModalForm from "@/components/ProModal";

export default () => {
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const proModalUpdateRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "idc.suit.type.column.name"}),
      dataIndex: "name",
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
        checkUserUpdatePermissions(permissionsIdcSuitTypeMenuKeys, userMenuPermissions) &&
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
        checkUserDeletePermissions(permissionsIdcSuitTypeMenuKeys, userMenuPermissions) &&
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
    fetch: queryIdcSuitTypeList,
    requestQueryFieldOptions: ["name", "enName", "cnName", "modeName"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue: {}
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(permissionsIdcSuitTypeMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "idc.suit.type.export.fileName",
    sheetName: "idc.suit.type.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: permissionsIdcSuitTypeMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: deleteIdcSuitType,
    defaultSize: 'small'
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'idc.suit.type.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateIdcSuitType,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'idc.suit.type.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createIdcSuitType,
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
