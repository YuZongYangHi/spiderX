import {PageContainer} from '@ant-design/pro-components'
import {useParams, history, useIntl} from "umi";
import React, {useEffect, useRef, useState} from "react";
import Loading from "@/components/Loading";
import {
  discardRecord,
  listRecordForm,
  listRecordNodeStateBySn, listTicketRecordFlowLogsByRecordId,
  queryUserHasTicketRecordPermissions,
  retrieveRecord,
} from '@/services/Ticket/api'
import WorkflowProcessStep from './Step'
import TicketProcessDescription from './Description'
import TicketProcessForm from './Form'
import TicketProcessTransition from './Transition'
import TicketFlowLog from './FlowTransitionLog'
import TicketComment from './Comment'
import {message, Modal} from "antd";
import {useModel} from "umi";
import {ExclamationCircleFilled} from "@ant-design/icons";

const { confirm } = Modal

export default () => {
  const params = useParams();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<TicketResponse.RecordInfo>({});
  const [nodeStateList, setNodeStateList] = useState<TicketResponse.WorkflowNodeStateInfo[]>([])
  const [flowLogList, setFlowLogList] = useState<TicketResponse.flowLogInfo[]>([])
  const [formList, setFormList] = useState<TicketResponse.RecordForm[]>([])
  const stepRef = useRef();
  const intl = useIntl();
  const [currentNodeFormState, setCurrentNodeFormState] = useState<TicketResponse.nodeFormItemState[]>([])

  const getCurrentContentType = () => {
    let contentType = ""
    nodeStateList.forEach(nodeState => {
      if (nodeState.id === record.state.id) {
        if (nodeState.approvalType === 1 && nodeState.hiddenState === 2 &&
          nodeState.participantType === 4 && currentUser && currentUser.username === record.creator
        ) {
          contentType = "rw"
        } else {
          contentType = "r"
        }
      }
    })

    return contentType
  }
  useEffect(() => {
    if (!params.sn) {
      history.push('/404')
    }
    (
      async function init() {
        const permissionResult = await queryUserHasTicketRecordPermissions(params.sn)
        if (permissionResult.success && !permissionResult.data.list) {
          message.error(`您没有工单${params.sn}的访问权限`)
          history.push("/403")
        }
        const recordResult = await retrieveRecord(params.sn)
        if (recordResult.success) {
          const nodeStateResult = await listRecordNodeStateBySn(recordResult.data.list.sn);
          const flowLogResult = await listTicketRecordFlowLogsByRecordId(recordResult.data.list.id, {})
          const formListResult = await listRecordForm(recordResult.data.list.sn)
          if (nodeStateResult.success && flowLogResult.success && formListResult.success) {
            setFlowLogList(flowLogResult.data.list)
            setNodeStateList(nodeStateResult.data.list)
            setRecord(recordResult.data.list);
            setFormList(formListResult.data.list)
            setCurrentNodeFormState(JSON.parse(recordResult.data.list.state.currentFormFieldStateSet))
            setLoading(false)
          }
        }
      }
    )()
  }, [])

  const handleTicketRecordDiscardRequest = async (record: TicketResponse.RecordInfo) => {
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
        })
        window.location.reload()
      },
      onCancel() {},
    });
  }

  const getCurrentNodeFieldState = (fieldKey: string, fieldType: string) =>  {
    const result = currentNodeFormState.filter(item => item.fieldType === fieldType && item.fieldKey === fieldKey)
    return result.length > 0 && parseInt(result[0].fieldValue) || 0
  }

  const contentType = getCurrentContentType()

  const stepT: ProcessParams.Step = {
    record: record,
    nodeStateList: nodeStateList,
    flowLogList: flowLogList
  }

  const TransitionT: ProcessParams.Transition = {
    display: contentType,
    record: record,
    user: currentUser,
    formList,
    discard: handleTicketRecordDiscardRequest
  }

  const DescriotionT: ProcessParams.Description = {
    record: record,
    formList,
    getCurrentNodeFieldState
  }

  const FormT: ProcessParams.Form = {
    record,
    formValueList: formList,
    discard: handleTicketRecordDiscardRequest,
    getCurrentNodeFieldState
  }

  const flowLogT: ProcessParams.FlowLog = {
    record,
    flowLogList
  }

  const commentT: ProcessParams.Comment = {
    record,
    user: currentUser
  }

  return (
    <PageContainer title={false}>
      {loading ? <Loading/> :
        <>
          <WorkflowProcessStep {...stepT} ref={stepRef} />
          {
            contentType.length > 0 && contentType === "r" ?
              <TicketProcessDescription {...DescriotionT} /> :
              record.status === 0 &&
              <TicketProcessForm {...FormT} />
          }
          {
            record.status === 0 &&
            <TicketProcessTransition {...TransitionT} />
          }
          <TicketFlowLog {...flowLogT} />
          <TicketComment {...commentT} />
        </>
      }
    </PageContainer>
  )
}
