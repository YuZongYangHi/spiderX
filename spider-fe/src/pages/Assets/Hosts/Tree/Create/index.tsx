import {useModel, useIntl} from "umi";
import {ModalForm, ProFormInstance, ProFormText} from '@ant-design/pro-components'
import {message} from "antd";
import React, {useRef} from "react";
import {FormattedMessage} from "@@/exports";
import {createTreeResource} from '@/services/Assets/ServiceTree/api'

export default () => {
  const {
    createVisable, handleCreateVisable, handleRenderTree, currentTree,
    expandedKeys, setExpandedKeys
  } = useModel('tree')
  const intl = useIntl();
  const createFormRef = useRef<ProFormInstance>();
  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.assets.hosts.tree.operate.add.title',
        defaultMessage: 'add node',
      })}
      width="500px"
      open={createVisable}
      formRef={createFormRef}
      modalProps={{
        onCancel: () => {
          if (createFormRef) {
            createFormRef.current?.resetFields();
          }
          handleCreateVisable(false)
        }
      }}
      onFinish={async (value) => {
        const data = {
          fullIdPath: currentTree.fullIdPath,
          fullNamePath: `${currentTree.fullNamePath}/${value.name}`,
          name: value.name,
          parentId: currentTree.id,
          level: currentTree.level + 1
        }
        const result = await createTreeResource(data)
        if (result.success) {
          message.success(intl.formatMessage({id: 'component.form.create.success'}))
          handleRenderTree(true)
          handleCreateVisable(false)
          let newExpanded = false
          expandedKeys.forEach(item => {
            if (item === result.data.list.fullIdPath) {
              newExpanded = true
            }
          })
          if (!newExpanded) {
            setExpandedKeys([...expandedKeys, result.data.list.fullIdPath])
          }
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
