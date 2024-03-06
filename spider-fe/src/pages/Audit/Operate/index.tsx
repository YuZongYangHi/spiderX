import {useIntl} from "@@/exports";
import React, {useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  queryAuditOperateList
} from "@/services/Audit/api";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  permissionAuditOperateMenuKeys
} from "@/access";
import ProTable from "@/components/ProTable";
import {clickExtender} from "@/components/Style/style";
import {AuditOperateTypeFilter} from '@/util/dataConvert'
import {Tag, Drawer} from 'antd'
import {ProDescriptions} from '@ant-design/pro-components'
import ReactJson from "react-json-view";

export default () => {
  const tableRef = useRef();
  const intl = useIntl();
  const [open, setOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "audit.operate.column.resourceName"}),
      dataIndex: "resourceName",
    },
    {
      title: intl.formatMessage({id: "audit.operate.column.resourcePk"}),
      dataIndex: "resourcePk",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "audit.operate.column.type"}),
      dataIndex: "type",
      valueType: 'select',
      choices: (value: number) => AuditOperateTypeFilter[value].text,
      valueEnum: AuditOperateTypeFilter,
      render: (_, record) => {
        return <Tag color={AuditOperateTypeFilter[record.type].color}>{AuditOperateTypeFilter[record.type].text}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: "audit.operate.column.username"}),
      dataIndex: "username",
    },
    {
      title: intl.formatMessage({id: "audit.operate.column.datetime"}),
      dataIndex: "datetime",
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
        <span style={clickExtender}
              key="look"
              onClick={()=>{
                const value = record
                setCurrentRow(value)
                handleDetailOpen()
              }
              }
        >
            {intl.formatMessage({id: 'audit.operate.column.look'})}
        </span>
      ]
    }
  ]

  const handleDetailOpen = () => {
    setOpen(true)
  }

  const handleDetailClose = () => {
    setCurrentRow({})
    setOpen(false)
  }

  const fetchParams: fetchParamsType = {
    fetch: queryAuditOperateList,
    requestQueryFieldOptions: ["username", "type", "resourceName"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue: {}
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = []

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "audit.export.fileName",
    sheetName: "audit.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: permissionAuditOperateMenuKeys,
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
      <Drawer
        title={intl.formatMessage({id: 'assets.audit.operate.detail.title'})}
        placement="right"
        width={700}
        onClose={handleDetailClose}
        open={open}
      >
        <ProDescriptions column={2} title={false}>
          <ProDescriptions.Item
            label={intl.formatMessage({id: "assets.node.table.column.id"})}
          >
            {open && currentRow.id}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id: 'assets.audit.operate.table.column.type'})}
          >
            {open && <Tag color={AuditOperateTypeFilter[currentRow.type].color}>{AuditOperateTypeFilter[currentRow.type].text}</Tag>}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id:'assets.audit.operate.table.column.username'})}
          >
            {open && currentRow.username}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id: 'assets.audit.operate.table.column.datetime'})}
          >
            {open && currentRow.datetime}
          </ProDescriptions.Item>
        </ProDescriptions>

        <ProDescriptions column={1}>
          <ProDescriptions.Item
            label={intl.formatMessage({id: "assets.audit.operate.detail.src"})}
          >
            {open ? <ReactJson src={JSON.parse(currentRow.srcData)}/> :<></>}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id: "assets.audit.operate.detail.target"})}
          >
            {open ? <ReactJson src={JSON.parse(currentRow.targetData)}/> :<></>}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id: "assets.audit.operate.detail.diff"})}
          >
            {open ? <ReactJson src={JSON.parse(currentRow.diffData)}/> :<></>}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Drawer>
    </>
  )
}
