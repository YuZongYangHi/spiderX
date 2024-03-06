import {ModalForm, ProFormInstance} from "@ant-design/pro-components";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {useIntl} from "umi";
import {message} from "antd";
import {ProFormItemRender} from "@/components/ProForm";

export default forwardRef((props: ProModal.Params, ref)=>{
  const formRef = useRef<ProFormInstance>();
  const intl = useIntl();
  const [open, handleOpen] = useState<boolean>();

  useImperativeHandle(ref, () => {
    return {
      proModalRef: formRef,
      proModalHandleOpen: handleOpen,
      open
    }
  })
  const formItems: any  = [];
  props.formItems?.forEach((item, index)=> {
    formItems.push(ProFormItemRender(item, index))
  })
  return (
    <ModalForm
      title={intl.formatMessage({
        id: props.title,
        defaultMessage: 'Modal Form',
      })}
      initialValues={props.initialValues || {}}
      open={open}
      formRef={formRef}
      width={props.width}
      modalProps={{
        onCancel: () => {
          props.handleOnCancel?.();
          handleOpen(false);
        },
        destroyOnClose: true,
        keyboard: false,
        maskClosable: false
      }}

      onFinish={async (value) => {
        // call parent function valid
        if (props.valueIsValid && !props.valueIsValid(value)) {
          message.error(intl.formatMessage({id: 'component.form.valid.fail'}))
          return
        }
        const result = await props.request(...props.params, value);
        if (result?.success) {
          message.success(intl.formatMessage({id: props.successMessage}))
          props.handleOnCancel();
          handleOpen(false);
        } else {
          message.error(intl.formatMessage({id: props.errorMessage}))
        }
      }}
    >
      {formItems}
    </ModalForm>
  )
})

