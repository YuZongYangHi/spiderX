import {PageContainer, ProCard} from "@ant-design/pro-components";
import {Steps} from 'antd';
import {getIntl, getLocale, useParams, history, useModel, useLocation} from "umi";
import {useEffect} from "react";
import {Outlet} from 'react-router-dom'

const intl = getIntl(getLocale());

const steps = [
  {
    title: intl.formatMessage({id: "ticket.create.step.first1"})
  },
  {
    title: intl.formatMessage({id: "ticket.create.step.first2"})
  },
  {
    title: intl.formatMessage({id: "ticket.create.step.first3"})
  },
  {
    title: intl.formatMessage({id: "ticket.create.step.first4"})
  }
]

export default () => {
  const params = useParams()
  const {
    productId, setProductId,
    categoryId, setCategoryId,
    currentStep, setCurrentStep
  } = useModel('ticket')
  const location = useLocation()

  const handleStep = (value: number) => {
    if (value > currentStep || currentStep === 0)  {
      return
    }
    setCurrentStep(value)

    switch (value) {
      case 0:
        setCategoryId(0)
        setProductId(0)
        history.push("/ticket/product/")
        break;
      case 1:
        history.push(`/ticket/product/${productId}/category`)
        setCategoryId(0)
        break;
      case 2:
        history.push(`/ticket/product/${productId}/category/${categoryId}/document`)
        break;
    }
  }

  useEffect(() => {
    if (Object.keys(params).length === 0 ) {
      setCurrentStep(0)
    } else if (params.productId && !params.categoryId) {
      setProductId(parseInt(params.productId))
      setCurrentStep(1)
    } else if (params.productId && params.categoryId) {
      setProductId(parseInt(params.productId))
      setCategoryId(parseInt(params.categoryId))

      if (location.pathname.endsWith("/submit")) {
        setCurrentStep(3)
      } else {
        setCurrentStep(2)
      }
    } else {
      history.push('/404')
    }
  }, [])

  useEffect(() => {
    return () => {
      setCurrentStep(0)
      setProductId(0)
      setCategoryId(0)
    }
  }, [])
  return (
    <PageContainer title={false}>
      <ProCard  style={{
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        marginBottom: 24
      }}>
        <Steps
          onChange={handleStep}
          size="small"
          current={currentStep}
          items={steps}
        />
      </ProCard>
      <Outlet/>
    </PageContainer>
  )
}
