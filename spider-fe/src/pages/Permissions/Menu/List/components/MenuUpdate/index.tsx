import {
  ModalForm,
  ProFormInstance,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  RequestOptionsType
} from "@ant-design/pro-components";
import {UpdateMenu} from "@/services/permissions/menu/menu";
import {message} from "antd";
import {FormattedMessage, useIntl, useModel} from "@@/exports";
import React, {useEffect, useRef, useState} from "react";

export default (props: any) => {
  const updateFormRef = useRef<ProFormInstance>();
  const intl = useIntl();
  const [parentListDisplay, setParentListDisplay] = useState(false);
  const  {menuList, setCurrentMenuRow,  currentMenuRow, handleUpdateModalOpen, updateModalOpen  } = useModel('menu');

  useEffect(()=>{
    if (updateModalOpen && currentMenuRow && currentMenuRow.parentId > 0) {
      setParentListDisplay(true)
    }
  }, [updateModalOpen])

  return (
  <ModalForm
    title={intl.formatMessage({
      id: 'pages.permissions.menu.list.update.title',
      defaultMessage: 'New rule',
    })}
    formRef={updateFormRef}
    width="500px"
    open={updateModalOpen}
    initialValues={currentMenuRow}
    modalProps={{
      onCancel: () => {
        setCurrentMenuRow({})
        setParentListDisplay(false)
        handleUpdateModalOpen(false)
      },
      destroyOnClose: true
    }}
    onFinish={async (value) => {
      if (!value.parentId) {
        value.parentId = 0
      }
      delete value["relatedParent"]

      const result = await UpdateMenu(currentMenuRow?.id || 0, value);
      if (result.success) {
        message.success("update successfully")
        handleUpdateModalOpen(false);
        if (props.actionRef.current) {
          props.actionRef.current.reload();
        }
        if (updateFormRef) {
          updateFormRef.current?.resetFields();
        }
      } else {
        message.error(result.errorMessage)
      }
    }}
  >
    <ProFormText
      rules={[
        {
          required: true,
          message: (
            <FormattedMessage
              id="pages.permissions.menu.list.form.create.item.name"
            />
          ),
        },
      ]}
      label={intl.formatMessage({id: "pages.permissions.menu.list.form.create.item.name"})}
      width="xl"
      name="name"
    />
    <ProFormText
      rules={[
        {
          required: true,
          message: (
            <FormattedMessage
              id="pages.permissions.menu.list.form.create.item.key"
            />
          ),
        },
      ]}
      label={intl.formatMessage({id: "pages.permissions.menu.list.form.create.item.key"})}
      width="xl"
      name="key"
    />

    {
      parentListDisplay &&
      <ProFormSelect
        name="parentId"
        label={intl.formatMessage({id: "pages.permissions.menu.list.form.create.item.parentList"})}
        request={async () => {
          const result: RequestOptionsType[] | PromiseLike<RequestOptionsType[]> | { label: string; value: number; }[] = []
          menuList.forEach((value) => {
            result.push({
              label: value.name,
              value: value.id
            })
          })
          return result;
        }}
        placeholder={intl.formatMessage({id: "pages.permissions.menu.list.form.create.item.placeholder.parentList"})}
        rules={[{
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.menu.list.form.create.item.required.message'})
        }]}
      />
    }
    <ProFormSwitch
      fieldProps={{
        onChange: (click: boolean) => {
          setParentListDisplay(click)
        }
      }}
      name="relatedParent"
      label={intl.formatMessage({id: "pages.permissions.menu.list.form.create.item.relateParent"})}
    />
  </ModalForm>
  )
}
