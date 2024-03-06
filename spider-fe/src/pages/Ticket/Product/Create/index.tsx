import {useModel, useParams, history, useIntl} from "umi";
import {useEffect, useState} from "react";
import {findCustomFormByCategoryId} from '@/services/Ticket/api'
import Loading from "@/components/Loading";
import TicketFormComponent from '@/components/TIcketWorkflowForm'
import {createTicketRecord} from '@/services/Ticket/api'

export default () => {
  const params = useParams()
  const {
    setCurrentStep, categoryId, setCategoryId
  } = useModel('ticket')

  const [loading, setLoading] = useState(true);
  const [formList, setFormList] = useState<TicketResponse.WorkflowCustomFormInfo[]>([]);
  const intl = useIntl()

  useEffect(() => {
    setCurrentStep(3)
    setLoading(true)
    const categoryId = parseInt(params.categoryId)
    const productId = parseInt(params.productId)

    if (!categoryId || !productId) {
      history.push('/404')
    }

    setCategoryId(categoryId)
    findCustomFormByCategoryId(categoryId).then(res=>{
      if (!res.success) {
        return
      }
      if (res.data.list.length === 0) {
        history.push('/404')
      }
      setFormList(res.data.list);
      setLoading(false)
    })
  }, [])

  const transForm = (values) => {
    return values
  }

  const formT: TicketWorkflowForm.T = {
    data: formList,
    TransForm: transForm,
    fetch: createTicketRecord,
    params: [categoryId],
    backTitle: true,
    successTitle: intl.formatMessage({id: 'ticket.record.create.success'}),
  }

  return loading ? <Loading/> : <TicketFormComponent {...formT} />
}
