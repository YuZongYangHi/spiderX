import {useIntl} from "@@/exports";
import React, {useRef} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  queryAuditUserLoginList
} from "@/services/Audit/api";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  permissionAuditLoginMenuKeys
} from "@/access";
import ProTable from "@/components/ProTable";
import {AuditUserLoginFilter} from '@/util/dataConvert'
import {Tag} from 'antd'

export default () => {
  const tableRef = useRef();
  const intl = useIntl();
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "audit.login.column.username"}),
      dataIndex: "username",
    },
    {
      title: intl.formatMessage({id: "audit.login.column.type"}),
      dataIndex: "type",
      valueType: 'select',
      choices: (value: number) => AuditUserLoginFilter[value].text,
      valueEnum: AuditUserLoginFilter,
      render: (_, record) => {
        return <Tag>{AuditUserLoginFilter[record.type].text}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: "audit.login.column.datetime"}),
      dataIndex: "datetime",
      hideInSearch: true,
      valueType: 'dateTime'
    }
  ]

  const fetchParams: fetchParamsType = {
    fetch: queryAuditUserLoginList,
    requestQueryFieldOptions: ["username", "type"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue: {}
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = []

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "audit.login.export.fileName",
    sheetName: "audit.login.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: permissionAuditLoginMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: null,
    defaultSize: 'small'
  }

  return (
    <>
      <ProTable {...TableProps} ref={tableRef} />
    </>
  )
}
