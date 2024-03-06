import {DrawerForm} from '@ant-design/pro-components'
import {useState, forwardRef, useRef, useImperativeHandle, useEffect} from 'react';
import {useIntl} from "umi";
import {message} from 'antd';
import {ProFormItemRender} from "@/components/ProForm";

export default forwardRef((props: ProModal.Params, ref)=>{
  const [drawerVisit, setDrawerVisit] = useState(false);
  const formRef = useRef(null);
  const intl = useIntl();

  const setFormFieldValue = (key: string, value: any) => {
    if (formRef.current) {
      formRef.current.setFieldValue(key, value)
    }
  }

  useImperativeHandle(ref, () => {
    return {
      proDrawerRef: formRef,
      proDrawerRefHandleOpen: setDrawerVisit,
      setFormFieldValue,
      action: props.action
    }
  })

  const formItems: any  = [];
  props.formItems?.forEach((item, index)=> {
    formItems.push(ProFormItemRender(item, index))
  })

  return (
    <DrawerForm
      title={intl.formatMessage({
        id: props.title,
        defaultMessage: 'Drawer Form',
      })}
      layout={props.layout || "horizontal"}
      initialValues={props.initialValues || {}}
      open={drawerVisit}
      formRef={formRef}
      width={props.width}
      drawerProps={{
        onClose: () => {
          props.handleOnCancel?.();
          setDrawerVisit(false);
        },
        destroyOnClose: true,
        keyboard: false,
        maskClosable: false
      }}
      onFinish={async (value) => {
        let data = value
        if (props.transform) {
          data = props.transform(value)
        }

        if (props.valueIsValid && !props.valueIsValid(value)) {
          message.error(intl.formatMessage({id: "ticket.form.valid.fail"}))
          return
        }
        let result:any
        if (props.params.length > 0) {
          result = await props.request(...props.params, data);
        }else {
          result = await props.request(data);
        }
        if (result?.success) {
          message.success(intl.formatMessage({id: props.successMessage}))
          props.handleOnCancel();
          setDrawerVisit(false);
        } else {
          message.error(intl.formatMessage({id: props.errorMessage}))
        }
      }}
    >
      {formItems}
    </DrawerForm>
  )
})
