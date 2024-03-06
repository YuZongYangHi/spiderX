import {ProColumns} from '@ant-design/pro-components';
import {getIntl, getLocale, useModel} from "umi";
import React, {useState} from "react";
import columnConvert from "@/util/ProTableColumnConvert";
import {Space, Tag, Modal, message} from "antd";
import {clickExtender} from "@/components/Style/style";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";
import {
  listTicketCategory,
  listTicketWorkflowNodeStat,
  discardRecord
} from '@/services/Ticket/api'
import {ExclamationCircleFilled} from '@ant-design/icons'

const intl = getIntl(getLocale());
const { confirm } = Modal

export const ColumnsRender = (tableRef) => {
  const [categoryName, setCategoryName] = useState("");
  const [stateName, setStateName] = useState("");
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

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

   const handleTicketRecordDiscard = async (record: TicketResponse.RecordInfo) => {
    confirm({
      title: intl.formatMessage({id: "ticket.record.discard.title"}),
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          <div>SN: <span style={{color: "red"}}>{record.sn}</span></div>
        <div>{intl.formatMessage({id: "ticket.record.discard.content"})}</div>
       </>
      ),
      onOk: async () => {
        await discardRecord(record.sn).then(res=> {
          message.success(intl.formatMessage({id: "ticket.record.discard.success"}))
          tableRef?.current?.actionRef?.current?.reload?.()
        })

      },
      onCancel() {},
    });
  }

  const columns: ProColumns<TicketResponse.RecordInfo>[] = [
    {
      title: intl.formatMessage({id: "ticket.record.column.sn"}),
      dataIndex: "sn",
      copyable: true,
      render: (dom, record) => {
        return <span style={clickExtender}  onClick={()=>window.open(`${window.location.origin}/ticket/workflow/${record.sn}`) }>{dom}</span>
      }
    },
    {
      title: intl.formatMessage({id: "ticket.record.column.categoryName"}),
      dataIndex: "categoryId",
      choices: (value, record) => record.category.name,
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: listTicketCategory
        }

        if (categoryName !== "") {
          params.params["filter"] = `name=${categoryName}`
        }
        return RemoteRequestSelectSearch(params)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setCategoryName(value)
        }
      },
      render: (_, record) => <Tag color="#108ee9">{record.category.name}</Tag>
    },
    {
      title: intl.formatMessage({id: "ticket.record.column.status"}),
      dataIndex: "status",
      valueType: "select",
      valueEnum: columnConvert['ticket.record.status'],
      choices: (value, record) => columnConvert['ticket.record.status'][value].text,
    },
    {
      title: intl.formatMessage({id: "ticket.record.column.stateName"}),
      dataIndex: "stateId",
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "stateName",
            value: "id"
          },
          params: {},
          request: listTicketWorkflowNodeStat
        }

        if (stateName !== "") {
          params.params["filter"] = `stateName=${stateName}`
        }
        return RemoteRequestSelectSearch(params)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setStateName(value)
        }
      },
      choices: (value, record) => record.state.stateName,
      render: (_, record) => <Tag color="processing">{ record.state.stateName}</Tag>
    },
    {
      title: intl.formatMessage({id: "ticket.record.column.approver"}),
      dataIndex: "approver",
      choices: (value, record) => getParticipants(record),
      render: (_, record) => {
        const result =  getParticipants(record)
        return <Space>{result.map((item, index) => <Tag key={index}>{item}</Tag>)}</Space>
      }
    },
    {
      title: intl.formatMessage({id: "ticket.record.column.creator"}),
      dataIndex: "creator"
    },
    {
      title: intl.formatMessage({id: "ticket.record.column.createTime"}),
      dataIndex: "createTime",
      hideInSearch: true,
      valueType: 'dateTime'
    },
    {
      title: intl.formatMessage({id: "ticket.record.column.updateTime"}),
      dataIndex: "updateTime",
      hideInSearch: true,
      valueType: 'dateTime'
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        <span key="look"
              style={clickExtender}
              onClick={()=>window.open(`${window.location.origin}/ticket/workflow/${record.sn}`) }>
          {intl.formatMessage(({id: 'ticket.record.column.detail'}))}
        </span>,
        currentUser && currentUser.username === record.creator || currentUser && currentUser.isAdmin ?  record.status === 0 && <span style={clickExtender}
                                                                                                               key="discard"
                                                                                                               onClick={() => handleTicketRecordDiscard(record)}
          >
            {intl.formatMessage({id: 'ticker.record.column.discard'})}
        </span> : <></>,
        currentUser && currentUser.isAdmin &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{tableRef?.current?.deleteAction(record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  return columns
}
