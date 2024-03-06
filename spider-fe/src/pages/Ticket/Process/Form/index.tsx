import {ProCard} from '@ant-design/pro-components'
import {useEffect, useRef, useState} from "react";
import {createTicketRecord, findCustomFormByCategoryId, updateTicketRecord} from "@/services/Ticket/api";
import TicketFormComponent from "@/components/TIcketWorkflowForm";
import {useIntl} from "umi";
import {Button} from "antd";
export default (props: ProcessParams.Form) => {
  const [loading, setLoading] = useState(false)
  const [formAttributesList, setFormAttributesList] = useState<TicketResponse.WorkflowCustomFormInfo[]>([]);
  const intl = useIntl()
  const [formValues, setFormValues] = useState({});
  const formRef = useRef();
  const [buttonLoading, setButtonLoading] = useState(false)

  useEffect(() => {
    (async function init() {
      setLoading(true)
      const result = await findCustomFormByCategoryId(props.record.categoryId)
      if (result.success) {
        setFormAttributesList(result.data.list)
        const f = {}
        props.formValueList.forEach(item=> {f[item.fieldKey] = item.fieldValue})
        setFormValues(f)
        setLoading(false)
      }
    })()
  }, [])

  const onFinish = async (values) => {
    setButtonLoading(true)
    const transform = formRef.current.mergeFormData(values)
    const result = await updateTicketRecord("agree", props.record.categoryId, props.record.sn, transform, "")
    if (result.success) {
      window.location.reload()
    }
  }

  const getFormItemDisabledOption = (value: TicketResponse.WorkflowCustomFormInfo) => {
    const state = props.getCurrentNodeFieldState(value.fieldKey.toString(), value.fieldType.toString())
    return {
      disabled: state === 2
    }
  }

  const formT: TicketWorkflowForm.T = {
    data: formAttributesList,
    TransForm: (value) => value,
    initialValues: formValues,
    fetch: createTicketRecord,
    params: [],
    successTitle: intl.formatMessage({id: 'ticket.record.create.success'}),
    onFinish: onFinish,
    formItemFunc: getFormItemDisabledOption,
    formAttributes: {
      submitter: {
        render: (p, doms) => {
          return [
            <Button
              loading={buttonLoading}
              type="primary"
              key="submit"
              onClick={() => p.form?.submit?.()}
            >
              提交
            </Button>,
            <Button onClick={async ()=> {await props.discard(props.record)}} key="cancel" danger>废弃</Button>
          ]
        }
      }
    }
  }

  return  (<ProCard
    title={props.record.category.name}
    loading={loading}
    headerBordered
    style={{
      border: "1px solid #f0f0f0",
      borderRadius: 8,
      marginBottom: 12
    }}>
      {
        !loading && formAttributesList.length > 0 &&
        <TicketFormComponent {...formT} ref={formRef} />
      }
    </ProCard>
  )
}
