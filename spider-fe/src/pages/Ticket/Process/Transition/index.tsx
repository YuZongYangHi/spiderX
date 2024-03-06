import {ProCard, ProFormTextArea} from '@ant-design/pro-components'
import {Flex, Button} from 'antd';
import {useEffect, useState} from "react";
import {GetRecordCurrentNodeApprovalButton, updateTicketRecord} from '@/services/Ticket/api'

export default (props: ProcessParams.Transition) => {
  const [buttonLoading, setButtonLoading] = useState(false)
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false)
  const [buttonList, setButtonList] = useState<TicketResponse.WorkflowTransitionInfo[]>([])

  useEffect(() => {
    (async function init() {
      setLoading(true)
      const result = await GetRecordCurrentNodeApprovalButton(props.record.sn);
      if (result.success) {
        setButtonList(result.data.list || [])
      }
      setLoading(false)
    }) ()
  }, [])

  const handleTransition = async (value: TicketResponse.WorkflowTransitionInfo) => {
    setButtonLoading(true)
    if (value.buttonType === "cancel") {
      return await props.discard(props.record)
    }
    const result = await updateTicketRecord(value.buttonType, props.record.categoryId, props.record.sn, props.formValueList, suggestion)
    if (result.success) {
      window.location.reload()
    }
  }

  const getButtonProps = (button: TicketResponse.WorkflowTransitionInfo) => {
    const style = {}
   if (button.buttonType === "agree" || button.buttonType === "reject") {
     style.type = "primary"
   }

   if (button.buttonType === "reject") {
     style.danger = true
   }
    return style
  }

  const generateButtonElement = () => {
    return buttonList.map((item, index) => (
      <Button loading={buttonLoading} key={index} {...getButtonProps(item)} onClick={async () => handleTransition(item) }>{item.buttonName}</Button>
    ))
  }

  return (
      props.display === 'r' && buttonList.length > 0 ?
        <ProCard
          loading={loading}
          title={false}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            marginBottom: 24
          }}>
          <div>
            <ProFormTextArea
              fieldProps={{
                onChange: (e) => setSuggestion(e.target.value)
              }}
              width="lg"
              placeholder="请输入"
              label="处理意见"/>
            <Flex justify="flex-end" align="center" gap={10}>
              {generateButtonElement()}
            </Flex>
          </div>
        </ProCard>
        : <></>
  )
}
