import {useIntl, useModel} from "@@/exports";
import React, {useEffect, useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  retrieveTicketCategory,
  createTicketWorkflowTransition,
  updateTicketWorkflowTransition,
  destroyTicketWorkflowTransition,
  listTicketWorkflowTransitionByWorkflowId, listTicketWorkflowNodeStat
} from "@/services/Ticket/api";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  adminTicketWorkflowTransitionMenuKeys
} from "@/access";
import ProTable from "@/components/ProTable";
import ProDrawerForm from "@/components/ProDrawerForm";
import {ProModelCreateFormItems, ProModelUpdateFormItems} from "./form";
import {useParams} from "umi";
import {Button, Tag} from "antd";
import {clickExtender} from "@/components/Style/style";
import ColumnConvert from '@/util/ProTableColumnConvert'
import {RemoteRequestSelectSearch} from "@/handler/Request/request";

export default () => {
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<TicketResponse.WorkflowNodeStateInfo>();
  const proModalUpdateRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const params = useParams()
  const [currentWorkflow, setWorkflow] = useState({})
  const [searchSrcNode, setSearchSrcNode] = useState("");
  const [searchTargetNode, setSearchTargetNode] = useState("");

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
      title: intl.formatMessage({id: "ticket.workflow.transition.column.buttonName"}),
      dataIndex: "buttonName",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.transition.column.buttonType"}),
      dataIndex: "buttonType",
      valueType: "select",
      valueEnum: ColumnConvert['ticket.workflow.transition.type']
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.name"}),
      dataIndex: "categoryId",
      choices: (value, record) => record.category.name,
      render: (_, record) => record.category.name,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.transition.column.src"}),
      dataIndex: "currentWorkflowStateId",
      choices: (value, record) => record.srcState.stateName,
      valueType: 'select',
      render: (_, record) => <Tag color="#2db7f5">{record.srcState.stateName}</Tag>,
      request: () => {
        const p: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "stateName",
            value: "id"
          },
          params: {"filter": `ticket_workflow_id=${params.workflowId}`},
          request: listTicketWorkflowNodeStat
        }

        if (searchSrcNode !== "") {
          p.params["filter"] += `&stateName=${searchSrcNode}`
        }
        return RemoteRequestSelectSearch(p)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setSearchSrcNode(value)
        }
      },
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.transition.column.dest"}),
      dataIndex: "targetWorkflowStateId",
      choices: (value, record) => record.targetState.stateName,
      valueType: 'select',
      render: (_, record) => <Tag color="#2db7f5">{record.targetState.stateName}</Tag>,
      request: () => {
        const p: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "stateName",
            value: "id"
          },
          params: {"filter": `ticket_workflow_id=${params.workflowId}`},
          request: listTicketWorkflowNodeStat
        }

        if (searchTargetNode !== "") {
          p.params["filter"] += `&stateName=${searchTargetNode}`
        }
        return RemoteRequestSelectSearch(p)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setSearchTargetNode(value)
        }
      },
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
        checkUserUpdatePermissions(adminTicketWorkflowTransitionMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                setCurrentRow(record)
                proModalUpdateRef.current?.proDrawerRefHandleOpen?.(true)
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(adminTicketWorkflowTransitionMenuKeys, userMenuPermissions) &&
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
    title: 'ticket.workflow.transition.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "500px",
    layout: "vertical",
    // @ts-ignore
    request: updateTicketWorkflowTransition,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(currentWorkflow, proModalUpdateRef),
    params: [currentRow && currentRow.id],
    successMessage: 'ticket.workflow.transition.update.success',
    errorMessage: 'ticket.workflow.transition.update.fail',
    action: "update"
  }

  const fetchParams: fetchParamsType = {
    fetch: listTicketWorkflowTransitionByWorkflowId,
    requestQueryFieldOptions: ["buttonName", "buttonType", "currentWorkflowStateId", "targetWorkflowStateId"],
    requestParams: [params.workflowId]
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(adminTicketWorkflowTransitionMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proDrawerRefHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "ticket.workflow.transition.export.fileName",
    sheetName: "ticket.workflow.transition.export.sheetName"
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'ticket.workflow.transition.create.title',
    width: "500px",
    layout: "vertical",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(currentWorkflow, proModalCreateRef),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createTicketWorkflowTransition,
    successMessage: 'ticket.workflow.transition.create.success',
    errorMessage: 'ticket.workflow.transition.create.fail',
    action: "create"
  }

  const TableProps: DesignProTable.T = {
    bread: true,
    columns: columns,
    permissionsMenuKeys: adminTicketWorkflowTransitionMenuKeys,
    fetchParams: fetchParams,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: destroyTicketWorkflowTransition,
    defaultSize: 'small'
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
