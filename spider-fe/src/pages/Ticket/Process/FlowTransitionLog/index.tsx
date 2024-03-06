import {forwardRef} from "react";
import {ProCard, ProTable} from "@ant-design/pro-components";
import {useIntl} from "umi";
import {Tag} from 'antd'

export default forwardRef((props: ProcessParams.FlowLog, ref)=> {
  const intl = useIntl()
  const column = [
    {
      title: intl.formatMessage({id: "ticket.workflow.flowLog.nodeName"}),
      dataIndex: "workflowNode",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.flowLog.approver"}),
      dataIndex: "approver",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.flowLog.status"}),
      dataIndex: "approvalStatus",
      render: (_, record) => {
        const colorStyle = {
          agree: {
            text: intl.formatMessage({id: 'ticket.transition.agree'}),
            color: "green"
          },

          reject: {
            color: "red",
            text: intl.formatMessage({id: "ticket.transition.reject"})
          },
          cancel: {
            color: "warning",
            text: intl.formatMessage({id: "ticket.transition.cancel"})
          }
        }
        return <Tag key="tag" color={colorStyle[record.approvalStatus].color}>{colorStyle[record.approvalStatus].text}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.flowLog.createTime"}),
      dataIndex: "createTime",
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.flowLog.handleDuration"}),
      dataIndex: "handleDuration",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.flowLog.suggestion"}),
      dataIndex: "suggestion",
    }
  ]
  return (
    <ProCard
      headerBordered
      title={intl.formatMessage({id: 'ticket.flowLog.title'})}
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        marginBottom: 24
      }}
    >
       <ProTable
          rowKey="id"
          dataSource={props.flowLogList ? props.flowLogList: []}
          columns={column}
          search={false}
          pagination={false}
          options={false}
          size={"small"}
       />
    </ProCard>
  )
} )
