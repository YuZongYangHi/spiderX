import {useIntl, useModel} from "@@/exports";
import React, {useEffect, useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  listTicketWorkflowNodeStateByWorkflowId,
  createTicketWorkflowNodeState,
  updateTicketWorkflowNodeState,
  destroyTicketWorkflowNodeState,
  retrieveTicketCategory,
  listTicketWorkflowCustomFormByWorkflowId
} from "@/services/Ticket/api";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  adminTicketWorkflowStateMenuKeys
} from "@/access";
import ProTable from "@/components/ProTable";
import ProDrawerForm from "@/components/ProDrawerForm";
import {ProModelCreateFormItems, ProModelUpdateFormItems} from "./form";
import {useParams} from "umi";
import {Button, Space, Tag} from "antd";
import {clickExtender} from "@/components/Style/style";
import ColumnConvert from '@/util/ProTableColumnConvert'

export const customFormFieldRender = (record: TicketResponse.WorkflowNodeStateInfo) => {
  const result = {}
  const forms = JSON.parse(record.currentFormFieldStateSet)
  forms.forEach(item => {
    let key = `form-${item.fieldKey}-${item.fieldType}`
    result[key] = item.fieldValue
  })
  return result
}

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
  const [customFormList, setCustomFormList] = useState<TicketResponse.WorkflowCustomFormInfo[]>([]);

  useEffect(() => {
    const workflowId = parseInt(params.workflowId)
    retrieveTicketCategory(workflowId).then(res=>{
      setWorkflow(res.data.list)
    })
    const requestParams = {
      pageSize: 1000,
      pageNum: 1
    }
    listTicketWorkflowCustomFormByWorkflowId(workflowId, requestParams).then(res=>{
      setCustomFormList(res.data.list)
    })
  }, [])

  const getParticipants = (record: TicketResponse.WorkflowNodeStateInfo) => {
    if (record.participantType === 1 ) {
      return record.participants.map((item, index) => item.username)
    } else if (record.participantType === 2) {
      return record.participants.map((item, index) => item.name)
    } else if (record.participantType === 4) {
      return [record.creator]
    }
    return []
  }

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "ticket.workflow.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.state.stateName"}),
      dataIndex: "stateName",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.name"}),
      dataIndex: "categoryId",
      choices: (value, record) => record.category.name,
      render: (_, record) => record.category.name,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.state.priority"}),
      dataIndex: "priority",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.state.approvalType"}),
      dataIndex: "approvalType",
      valueType: 'select',
      valueEnum: ColumnConvert['ticket.workflow.state.approvalType'],
      choices: (value) => ColumnConvert['ticket.workflow.state.approvalType'][value].text,
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.state.hiddenState"}),
      dataIndex: "hiddenState",
      valueType: 'select',
      valueEnum: ColumnConvert['ticket.workflow.state.hiddenState'],
      choices: (value) => ColumnConvert['ticket.workflow.state.hiddenState'][value].text,
      render: (_, record) => <Tag color={ColumnConvert['ticket.workflow.state.hiddenState'][record.hiddenState].color}>{ColumnConvert['ticket.workflow.state.hiddenState'][record.hiddenState].text}</Tag>
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.state.participantType"}),
      dataIndex: "participantType",
      valueType: 'select',
      valueEnum: ColumnConvert['ticket.workflow.state.participant'],
      choices: (value) => ColumnConvert['ticket.workflow.state.participant'][value].text,
      render: (_, record) => <Tag>{ColumnConvert['ticket.workflow.state.participant'][record.participantType].text}</Tag>
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.state.participant"}),
      dataIndex: "participant",
      hideInSearch: true,
      choices: (_, record) => getParticipants(record),
      render: (_, record: TicketResponse.WorkflowNodeStateInfo) => {
        const result =  getParticipants(record)
        return <Space>{result.map((item, index) => <Tag key={index}>{item}</Tag>)}</Space>
      }
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.state.formState"}),
      dataIndex: "currentFormFieldStateSet",
      copyable: true,
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.state.webhook"}),
      dataIndex: "webhookURL",
      copyable: true,
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.description"}),
      hideInSearch: true,
      copyable: true,
      ellipsis: true,
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
        checkUserUpdatePermissions(adminTicketWorkflowStateMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                const v = {...record}
                const form = customFormFieldRender(v)
                const values = {...v, ...form}
                setCurrentRow(values)
                proModalUpdateRef.current?.proDrawerRefHandleOpen?.(true)
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(adminTicketWorkflowStateMenuKeys, userMenuPermissions) &&
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

  const submitTransform = (values: any): object => {
    const forms = Object.keys(values).filter(item => item.startsWith("form"))
    const formFields = []
    forms.forEach(item => {
      const s = item.split("-")
      const v = {
        fieldKey: s[1],
        fieldValue: values[item],
        fieldType: s[2]
      }
      formFields.push(v)
      delete values[item]
    })
    values.currentFormFieldStateSet = JSON.stringify(formFields)
    return values
  }

  const formValuesIsValid = (values: any) => {
    const userParticipantType = [1, 2, 4]
    if (values.approvalType === 1 && userParticipantType.indexOf(values.participantType) === -1) {
      return false
    }
    return !(values.approvalType > 1 && values.approvalType <= 4 && values.participantType !== 3);

  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'ticket.workflow.state.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "600px",
    layout: "vertical",
    // @ts-ignore
    request: updateTicketWorkflowNodeState,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(currentWorkflow, currentRow, customFormList,  proModalUpdateRef),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail',
    action: "update",
    transform: submitTransform,
    valueIsValid:  formValuesIsValid
  }

  const fetchParams: fetchParamsType = {
    fetch: listTicketWorkflowNodeStateByWorkflowId,
    requestQueryFieldOptions: ["stateName", "approvalType", "hiddenState", "participantType"],
    requestParams: [params.workflowId]
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(adminTicketWorkflowStateMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proDrawerRefHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "ticket.workflow.state.export.fileName",
    sheetName: "ticket.workflow.state.export.sheetName"
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'ticket.workflow.state.create.title',
    width: "600px",
    layout: "vertical",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(currentWorkflow, currentRow, customFormList, proModalCreateRef),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createTicketWorkflowNodeState,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail',
    action: "create",
    transform: submitTransform,
    valueIsValid:  formValuesIsValid
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue:  {description: {show: false}, webhookURL: {show: false}, currentFormFieldStateSet: {show: false}}
  }

  const TableProps: DesignProTable.T = {
    bread: true,
    columns: columns,
    permissionsMenuKeys: adminTicketWorkflowStateMenuKeys,
    fetchParams: fetchParams,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: destroyTicketWorkflowNodeState,
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
