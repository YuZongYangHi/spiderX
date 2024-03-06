import {
  ModalForm,
  ProFormInstance,
  ProFormTreeSelect,
  ProFormText,
} from "@ant-design/pro-components";
import React, {useRef} from "react";
import {useIntl, useModel} from "umi";
import {migrateTree} from "@/services/Assets/ServiceTree/api";
import {FormattedMessage, history} from "@@/exports";
import {message} from "antd";

export default () => {
  const formRef = useRef<ProFormInstance>();
  const intl = useIntl();
  const {
    migrateVidable, handleMigrateVisable, handleRenderTree, currentTree,
    expandedKeys, setExpandedKeys, treeRawList, buildTreeSelect, getCurrentTreePatentNamePath,
    setSelectedKeys
  } = useModel('tree')
  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.assets.hosts.tree.operate.migrate.title',
        defaultMessage: 'add node',
      })}
      width="500px"
      open={migrateVidable}
      formRef={formRef}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          if (formRef) {
            formRef.current?.resetFields();
          }
          handleMigrateVisable(false)
        }
      }}
      onFinish={async (value) => {
        if (value.target == currentTree.parentId) {
          message.warning(intl.formatMessage({id: 'pages.assets.hosts.tree.operate.migrate.form.repeat'}))
          return
        }

        const data = {
          srcId: currentTree.id,
          destId: value.target
        }
        const result = await migrateTree(data)
        if (result.success) {
          handleRenderTree(true)
          handleMigrateVisable(false)
          setSelectedKeys([result.data.list.fullIdPath])
          setExpandedKeys([...expandedKeys, result.data.list.fullIdPath])
          message.success(intl.formatMessage({id:'pages.assets.hosts.tree.operate.migrate.form.success'}))
          history.push(`/assets/hosts/server-tree/${currentTree.id}/machine`)
        }
      }}
    >
      <ProFormText
        disabled={true}
        initialValue={getCurrentTreePatentNamePath(currentTree)}
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
        label={intl.formatMessage({id: "pages.assets.hosts.tree.operate.migrate.form.srcPath"})}
        width="xl"
        name="srcParentPath"
      />
      <ProFormText
        disabled={true}
        initialValue={currentTree.name}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.assets.hosts.tree.operate.migrate.form.srcDirName"
              />
            ),
          },
        ]}
        label={intl.formatMessage({id: "pages.assets.hosts.tree.operate.migrate.form.srcDirName"})}
        width="xl"
        name="svcDirName"
      />
      <ProFormTreeSelect
        name="target"
        allowClear
        secondary
        fieldProps={{
          treeNodeLabelProp: "fullNamePath"
        }}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.assets.hosts.tree.operate.migrate.form.target"
              />
            ),
          },
        ]}
        label={intl.formatMessage({id: "pages.assets.hosts.tree.operate.migrate.form.target"})}
        request={async ()=>{
          return buildTreeSelect(treeRawList, 0)
        }}
      />
    </ModalForm>
  )
}
