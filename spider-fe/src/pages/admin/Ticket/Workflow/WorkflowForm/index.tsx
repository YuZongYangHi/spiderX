import {useIntl, useModel} from "@@/exports";
import React, {useEffect, useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  listTicketWorkflowCustomFormByWorkflowId,
  createTicketWorkflowCustomForm,
  updateTicketWorkflowCustomForm,
  destroyTicketWorkflowCustomForm,
  retrieveTicketCategory,
} from "@/services/Ticket/api";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  adminTicketWorkflowFormMenuKeys
} from "@/access";
import ProTable from "@/components/ProTable";
import ProDrawerForm from "@/components/ProDrawerForm";
import {ProModelCreateFormItems, ProModelUpdateFormItems} from "./form";
import {useParams} from "umi";
import {Button} from "antd";
import {clickExtender} from "@/components/Style/style";
import columnConvert from '@/util/ProTableColumnConvert'

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
      title: intl.formatMessage({id: "ticket.workflow.form.column.fieldName"}),
      dataIndex: "fieldLabel",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.form.column.fieldValue"}),
      dataIndex: "fieldKey",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.form.column.type"}),
      dataIndex: "fieldType",
      valueType: 'select',
      valueEnum: columnConvert['ticket.workflow.form.fieldType'],
      choices: (value, record) => columnConvert['ticket.workflow.form.fieldType'][value].text,
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.form.column.required"}),
      dataIndex: "required",
      valueType: 'select',
      valueEnum: columnConvert['ticket.workflow.form.required'],
      choices: (value, record) => columnConvert['ticket.workflow.form.required'][value].text,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.form.column.defaultValue"}),
      dataIndex: "defaultValue",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.form.column.priority"}),
      dataIndex: "priority",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.name"}),
      dataIndex: "categoryId",
      choices: (value, record) => record.category.name,
      render: (_, record) => record.category.name,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.form.column.remoteURL"}),
      dataIndex: "remoteURL",
      hideInSearch: true,
      copyable: true,
      ellipsis: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.form.column.fieldOptions"}),
      dataIndex: "fieldOptions",
      hideInSearch: true,
      copyable: true,
      ellipsis: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.form.column.width"}),
      dataIndex: "width",
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.form.column.rowMargin"}),
      dataIndex: "rowMargin",
      hideInSearch: true,
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
        checkUserUpdatePermissions(adminTicketWorkflowFormMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                setCurrentRow(record)
                proModalUpdateRef.current?.proDrawerRefHandleOpen?.(true)
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(adminTicketWorkflowFormMenuKeys, userMenuPermissions) &&
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
    title: 'ticket.workflow.form.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "600px",
    layout: "vertical",
    // @ts-ignore
    request: updateTicketWorkflowCustomForm,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(currentWorkflow, proModalUpdateRef),
    params: [currentRow && currentRow.id],
    successMessage: 'ticket.workflow.form.update.success',
    errorMessage: 'ticket.workflow.form.update.fail'
  }

  const fetchParams: fetchParamsType = {
    fetch: listTicketWorkflowCustomFormByWorkflowId,
    requestQueryFieldOptions: ["fieldType", "fieldKey", "fieldLabel"],
    requestParams: [params.workflowId]
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(adminTicketWorkflowFormMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proDrawerRefHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "ticket.workflow.form.export.fileName",
    sheetName: "ticket.workflow.form.export.sheetName"
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'ticket.workflow.form.create.title',
    width: "600px",
    layout: "vertical",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(currentWorkflow, proModalCreateRef),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createTicketWorkflowCustomForm,
    successMessage: 'ticket.workflow.form.create.success',
    errorMessage: 'ticket.workflow.form.update.fail'
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue:  {
      fieldOptions: { show: false },
      remoteURL: { show: false },
      width: {show: false},
      rowMargin: {show: false}
    }
  }

  const TableProps: DesignProTable.T = {
    bread: true,
    columns: columns,
    permissionsMenuKeys: adminTicketWorkflowFormMenuKeys,
    fetchParams: fetchParams,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: destroyTicketWorkflowCustomForm,
    defaultSize: 'small',
    columnsState
  }

  return (
    <div style={{width: "100%"}}>
      <ProTable {...TableProps} ref={tableRef} />
      <ProDrawerForm
        {...ProModalUpdateParams}
        ref={proModalUpdateRef}
      />
      <ProDrawerForm
        {...ProModalCreateParams}
        ref={proModalCreateRef}
      />
    </div>
  )
}
