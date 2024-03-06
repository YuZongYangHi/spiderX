import {useModel, useIntl} from "umi";
import {ModalForm, ProFormInstance, ProFormText} from '@ant-design/pro-components'
import {message} from "antd";
import React, {useRef} from "react";
import {FormattedMessage} from "@@/exports";
import {updateTreeResource} from '@/services/Assets/ServiceTree/api'

export default () => {
  const {
    updateVisable, handleUpdateVisable, handleRenderTree, currentTree
  } = useModel('tree')
  const intl = useIntl();
  const createFormRef = useRef<ProFormInstance>();
  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.assets.hosts.tree.operate.update.title',
        defaultMessage: 'add node',
      })}
      width="500px"
      open={updateVisable}
      initialValues={currentTree}
      formRef={createFormRef}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          if (createFormRef) {
            createFormRef.current?.resetFields();
          }
          handleUpdateVisable(false)
        }
      }}
      onFinish={async (value) => {
        const list = currentTree.fullNamePath.split('/')
        let fullNamePath = ""
        list.forEach(item=>{
          if (item && item != currentTree.name) {
            fullNamePath += `/${item}`
          }
        })
        const data = {
          fullNamePath: `${fullNamePath}/${value.name}`,
          name: value.name,
        }
        const result = await updateTreeResource(currentTree.id, data)
        if (result.success) {
          message.success(intl.formatMessage({id: 'component.form.edit.success'}))
          handleRenderTree(true)
          handleUpdateVisable(false)
          createFormRef.current?.resetFields();
        } else {
          message.success(result.errorMessage)
        }
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.assets.hosts.tree.create.name"
              />
            ),
          },
        ]}
        label={intl.formatMessage({id: "pages.assets.hosts.tree.create.name"})}
        width="xl"
        name="name"
      />
    </ModalForm>
  )
}
