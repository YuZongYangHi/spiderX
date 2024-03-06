import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {ProCard, ProForm} from "@ant-design/pro-components";
import {Row, Col, Space, Divider, message, Modal, Flex, Tag} from 'antd'
import {BackTitle} from '@/components/CustonizeTitle'
import {FormItemRender, FormValueTransform} from './form'
import {clickExtender} from "@/components/Style/style";

export const vertical = "vertical"
export const inline = "inline"
export const horizontal = "horizontal"

export const verticalLayoutConfig = () => {
  return {
    style: {
      marginLeft: "10%"
    },
    grid: true,
    rowProps: {
      gutter: [16, 0]
    },
    submitter: {
      render: (props, doms) => {
        return (
          <div style={{width: "100%"}}>
            <Divider/>
            <div style={{ marginTop: 12, float: "right"}}>
              <Space>{doms}</Space>
            </div>
          </div>
        )
      }
    }
  }
}

export const inlineLayoutConfig = () => {
  return {
    style: {
      marginLeft: "10%"
    },
    rowProps: {
      gutter: [16, 16]
    },
    labelCol: { span: 7 },
    grid: true,
    submitter: {
      render: (props, doms) => {
        return (
        <div style={{width: "100%"}}>
          <Divider/>
          <div style={{ marginTop: 12, float: "right"}}>
              <Space>{doms}</Space>
          </div>
        </div>
        )
      }
    }
  }
}

export const horizontalLayoutConfig = () => {
  return {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    style: {
      marginLeft: "20%"
    },
    submitter: {
      render: (props, doms) => {
        return  <Row>
          <Col span={14} offset={4}>
            <Space>{doms}</Space>
          </Col>
        </Row>
      }
    }
  }
}

export const LoadProFomLayoutConfig = (layout: string) => {
  return layout === horizontal ? horizontalLayoutConfig():
      layout === inline ? inlineLayoutConfig(): verticalLayoutConfig()
}

export default forwardRef((props: TicketWorkflowForm.T, ref)=> {
  const [category, setCategory] = useState<TicketResponse.CategoryInfo>({});
  const formRef = useRef()
  useImperativeHandle(ref, () => {
    return {}
  })

  useEffect(() => {
    if (props.data.length > 0) {
      setCategory(props.data[0].category)
    }
  }, [props.data])

  const BackTitleT = {
    title: category.name,
    uri: `${window.location.origin}/ticket/product/${category?.product?.id}/category/${category?.id}/document`
  }

   const mergeFormData = (formValues: any[]) => {
    const result: { fieldType: number; fieldLabel: string; fieldKey: number; fieldValue: any}[] = []
    props.data.forEach(item => {
      result.push({
        fieldType: item.fieldType,
        fieldLabel: item.fieldLabel,
        fieldKey: item.fieldKey,
        fieldValue: FormValueTransform(item.fieldType, formValues[item.fieldKey]),
      })
    })
    return result
  }

  const onFinish = async (values) => {
    if (props.IsValid && !props.IsValid(values)) {
      message.error("表单校验失败")
      return
    }

    let transform = mergeFormData(values)
    if (props.TransForm) {
      transform = props.TransForm(transform)
    }
    const result =  props.params ? await props.fetch(...props.params, transform) : await props.fetch(transform)

    if (result.success) {
      Modal.success({
        width: 400,
        title: props.successTitle,
        content:  (
          <Flex
            gap="middle"
            justify="flex-start"
            align="flex-start"
            vertical>
            <Space>
              <span>流水号: </span>
              <span>{result.data.list.sn}</span>
            </Space>
            <Space>
              <span>当前节点: </span>
              <Tag color="#2db7f5">{result.data.list.nodeName}</Tag>
            </Space>
            <Space>
              <span style={clickExtender} onClick={() => {window.location.href =`${window.location.origin}/ticket/workflow/${result.data.list.sn}`}}>点击查看工单流程</span>
            </Space>
          </Flex>
        ),
      })
      formRef.current?.resetFields()
      return
    }
  }

  useImperativeHandle(ref, () => {
    return {
      mergeFormData
    }
  })

  return (
      <ProCard>
        {props.backTitle &&  <BackTitle {...BackTitleT}/> }
          <ProForm
            formRef={formRef}
            initialValues={props.initialValues}
            layout={category.layout}
            onFinish={props.onFinish ? props.onFinish : onFinish}
            {...LoadProFomLayoutConfig(category.layout)}
            {...props.formAttributes}
            >
            {props.data.map(item => (
              FormItemRender(item, formRef, props.formItemFunc ? props.formItemFunc(item) : {})
            ))}
          </ProForm>
      </ProCard>
  )
})
