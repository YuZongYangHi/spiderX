import {forwardRef, useEffect, useState} from "react";
import {listTicketRecordFlowLogsByRecordId, GetTicketRecordUrge, SendTicketRecordUrge} from '@/services/Ticket/api';
import Loading from "@/components/Loading";
import {ProCard} from "@ant-design/pro-components";
import {Flex, message, Space, Steps} from "antd";
import {clickExtender, disableStyle} from "@/components/Style/style";
import {useIntl} from "umi";
import {Urge} from '@/components/Icon'
import {useModel} from "umi";
import {UserOutlined} from '@ant-design/icons'
import moment from "moment";

export default forwardRef((props:ProcessParams.Step, ref)=>{
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<any>(0);
  const [stepList, setStepList] = useState([]);
  const intl = useIntl()
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [currentStepStatus, setCurrentStepStatus] = useState("process")

  const fetchFlowLogList = async (params: object) =>  {
    const result = await listTicketRecordFlowLogsByRecordId(props.record.id, params)
    if (result.success) {
      return result.data.list
    }
    return []
  }

  const handleUrge = async () => {
    setLoading(true)
    const result = await SendTicketRecordUrge(props.record.sn, props.record.state.id)
    setLoading(false)
    if (result.success) {
      const stepListResult = await filterStepList(props.nodeStateList, result.data.list)
      setStepList(stepListResult)
      message.success(intl.formatMessage({id: 'ticket.workflow.process.urge.success'}))
    } else {
      message.warning(intl.formatMessage({id: 'ticket.workflow.process.urge.error'}))
    }
  }
  const filterStepList = async (nodeStateList: TicketResponse.WorkflowNodeStateInfo[], urge: any) => {
    const hiddenNodeStateList = nodeStateList.filter(item => item.hiddenState === 2)
    const flowLogHiddenStateNames = []
    const steps = []
    const stateNames = hiddenNodeStateList.map(item => item.stateName).join(",")
    if (stateNames !== "") {
      const params = {
        filter: `stateName=${stateNames}`
      }
      const flowLogList = await fetchFlowLogList(params)
      flowLogList.forEach(item => flowLogHiddenStateNames.push(item.workflowNode))
    }

    nodeStateList.forEach((item, index) => {
      let step = {
        title: item.stateName
      }

      if (item.hiddenState === 1 || props.record.state.stateName === item.stateName || (item.hiddenState === 2 && flowLogHiddenStateNames.indexOf(item.stateName) !== -1)) {
        if (props.record.state.stateName === item.stateName && index > 0 && index !== nodeStateList.length -1) {
          const element = urge && urge.id ? <span style={disableStyle}>{intl.formatMessage({id: 'ticket.workflow.process.already.urge'})}</span> : <span onClick={async ()=> await handleUrge()} style={clickExtender}>{intl.formatMessage({id: 'ticket.workflow.process.urge'})}</span>
          step.description = currentUser && currentUser.username  === props.record.creator && props.record.state.participantType !== 4 ? <Urge element={element} /> : ""
        }else if (index === 0 ) {
          step.description = (
            <Flex vertical="vertical" align="flex-start" gap={4} style={{marginTop: 2}}>
              <Space size={4}>
                {props.record.creator}
                <UserOutlined />
              </Space>
              <span style={{width: 150}}>{moment(props.record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Flex>
          )
        }
        steps.push(step)
      }
    })
    return steps
  }

  const handleSetCurrentStepStatus = (flowLogs: TicketResponse.flowLogInfo[], nodeStates: TicketResponse.WorkflowNodeStateInfo[],
                                record: TicketResponse.RecordInfo) => {

    if (nodeStates[nodeStates.length -1].id === record.state.id) {
      return
    }
    const latestFlowLog = flowLogs[0]
    if (latestFlowLog.nodePriority < record.state.priority && latestFlowLog.approvalStatus === "reject") {
      setCurrentStepStatus("error")
    }
  }
  useEffect(() => {
    (async function init() {
        const urgeResult = await GetTicketRecordUrge(props.record.sn, props.record.state.id)
        const stepListResult = await filterStepList(props.nodeStateList, urgeResult.data.list)
        setStepList(stepListResult)
        setLoading(false)
        let currentStepIndex = -1
        stepListResult.filter((item, index) => {
          if (item.title === props.record.state.stateName && currentStepIndex === -1) {
            currentStepIndex = index;
          }
          return false;
        });
        handleSetCurrentStepStatus(props.flowLogList, props.nodeStateList, props.record)
        setCurrentStep(currentStepIndex);
    }) ()
  }, [])
  return (
      <ProCard
        loading={loading}
        title={intl.formatMessage({id: "ticket.workflow.process.title"})}
        headerBordered
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          marginBottom: 12
      }}>
        <Steps
          status={currentStepStatus}
          size="small"
          current={currentStep}
          items={stepList}
        />
      </ProCard>
  )
})
