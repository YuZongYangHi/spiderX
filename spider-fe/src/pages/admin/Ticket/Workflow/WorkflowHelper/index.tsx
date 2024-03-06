import {useIntl, useModel} from "@@/exports";
import React, {useEffect, useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  createTicketWorkflowWiki,
  updateTicketWorkflowWiki,
  destroyTicketWorkflowWiki,
  listTicketWorkflowWikiByWorkflowId,
  retrieveTicketCategory
} from "@/services/Ticket/api";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  adminTicketWorkflowWikiMenuKeys
} from "@/access";
import ProTable from "@/components/ProTable";
import DesignProModalForm from "@/components/ProModal";
import {ProModelCreateFormItems, ProModelUpdateFormItems} from "./form";
import {useParams} from "umi";
import {Button} from "antd";
import {clickExtender} from "@/components/Style/style";

export default () => {
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const proModalUpdateRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const params = useParams()
  const [currentWorkflow, setWorkflow] = useState({})

  useEffect(() => {
    const workflowId = parseInt(params.workflowId)
    retrieveTicketCategory(workflowId).then(res=>{
      setWorkflow(res.data.list)
    })
  }, [])
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "ticket.workflow.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.helper.name"}),
      dataIndex: "name",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.helper.workflow"}),
      dataIndex: "categoryId",
      choices: (value, record) => record.category.name,
      render: (_, record) => record.category.name,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.helper.url"}),
      dataIndex: "url",
      hideInSearch: true,
      copyable: true,
      ellipsis: true,
      render: (_, record) => <span style={clickExtender} onClick={()=>window.open(record.url)} >{record.url}</span>
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.description"}),
      hideInSearch: true,
      dataIndex: "description",
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
        checkUserUpdatePermissions(adminTicketWorkflowWikiMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                setCurrentRow(record)
                proModalUpdateRef.current?.proModalHandleOpen?.(true)
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(adminTicketWorkflowWikiMenuKeys, userMenuPermissions) &&
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

  const ProModalUpdateParams: ProModal.Params = {
    title: 'ticket.workflow.helper.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateTicketWorkflowWiki,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(currentWorkflow),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }

  const fetchParams: fetchParamsType = {
    fetch: listTicketWorkflowWikiByWorkflowId,
    requestQueryFieldOptions: ["name"],
    requestParams: [params.workflowId]
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(adminTicketWorkflowWikiMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "ticket.workflow.helper.export.fileName",
    sheetName: "ticket.workflow.helper.export.sheetName"
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'ticket.workflow.helper.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(currentWorkflow),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createTicketWorkflowWiki,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail'
  }

  const TableProps: DesignProTable.T = {
    bread: true,
    columns: columns,
    permissionsMenuKeys: adminTicketWorkflowWikiMenuKeys,
    fetchParams: fetchParams,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: destroyTicketWorkflowWiki,
    defaultSize: 'small'
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
