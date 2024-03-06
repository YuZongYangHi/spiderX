
import React, {useRef, useState} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {ProColumns, ProFormText, PageContainer} from "@ant-design/pro-components";
import {useIntl, useModel} from "@@/exports";
import {CommonTable} from "@/components/Table/typings";
import {
  queryGroupList,deleteGroup, updateGroup, createGroup
} from "@/services/group/api";
import {
  checkUserCreatePermissions, checkUserDeletePermissions, checkUserUpdatePermissions,
  permissionsGroupMenuKeys
} from "@/access";
import {clickExtender} from "@/components/Style/style";
import {Button} from "antd";

export default () => {
  const proTableRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const proModalUpdateRef = useRef(null);
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<MenuPermissionsForm.GrantGroupUpdate>();
  const [currentRowParams, setCurrentRowParams] = useState<any[]>();
  const formItems =  [
    {
      name: "name",
      label: intl.formatMessage({id: 'pages.permissions.group.column.name'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.group.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.permissions.group.column.name'})
      }
    },
    {
      name: "cnName",
      label: intl.formatMessage({id: 'pages.group.column.cnName'}),
      placeholder: intl.formatMessage({id: 'pages.group.column.cnName'}),
      component: ProFormText,
      width: "xl",
      options: {
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.group.column.cnName'})
      }
    },
    {
      name: "email",
      label: intl.formatMessage({id: 'pages.group.column.email'}),
      placeholder: intl.formatMessage({id: 'pages.group.column.email'}),
      component: ProFormText,
      width: "xl",
      options: {
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.group.column.email'})
      }
    },
    {
      name: "description",
      label: intl.formatMessage({id: 'pages.permissions.group.column.description'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.group.column.description'}),
      component: ProFormText,
      width: "xl",
      options: {
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.create.rule'})
      }
    }
  ]
  const columns: ProColumns<GroupResponse.GroupInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.group.column.name'}),
      dataIndex: "name",
    },
    {
      title: intl.formatMessage({id: 'pages.group.column.cnName'}),
      dataIndex: "cnName",
    },
    {
      title: intl.formatMessage({id: 'pages.group.column.email'}),
      dataIndex: "email",
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.group.column.description'}),
      dataIndex: "description",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.group.column.createTime'}),
      dataIndex: "createTime",
      hideInSearch: true,
      valueType: "dateTime"
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.group.column.updateTime'}),
      dataIndex: "updateTime",
      hideInSearch: true,
      valueType: "dateTime"
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        checkUserUpdatePermissions(permissionsGroupMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="edit"
              onClick={()=>{
                proModalUpdateRef.current?.proModalHandleOpen?.(true)
                const value = {
                  id: record.id,
                  name: record.name,
                  description: record.description,
                  email: record.email,
                  cnName: record.cnName
                }
                setCurrentRowParams([record.id])
                setCurrentRow(value);
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(permissionsGroupMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{proTableRef.current?.deleteAction(record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  const ProTableParams: CommonTable.Params = {
    columns: columns,
    permissionsMenuKeys: permissionsGroupMenuKeys,
    // @ts-ignore
    listRequest: queryGroupList,
    // @ts-ignore
    requestParams: [],
    rowKey: "id",
    requestQueryFieldOptions: ["name"],
    openSearch: true,
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsGroupMenuKeys, userMenuPermissions) &&
      <Button
        key={"create"}
        type={"primary"}
        onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}}
      >{intl.formatMessage({id: 'component.operate.create'})}</Button>
    ],
    operate: {
      delete: {
        title: "component.operate.delete.title",
        content: "component.operate.delete.content",
        successMessage: "component.operate.delete.successMessage",
        errorMessage: "component.operate.delete.errorMessage",
        // @ts-ignore
        request: deleteGroup
      }
    }
  }

  const handleOnUpdateCancel = () => {
    proTableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'pages.permissions.group.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateGroup,
    initialValues: currentRow,
    formItems: formItems,
    params: currentRowParams,
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }
  const ProModalCreateParams: ProModal.Params = {
    title: 'pages.permissions.group.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: formItems,
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createGroup,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail'
  }

  return (
    <PageContainer title={false}>
      <DesignProTable
        {...ProTableParams}
        ref={proTableRef}
      />
      <DesignProModalForm
        {...ProModalUpdateParams}
        ref={proModalUpdateRef}
      />
      <DesignProModalForm
        {...ProModalCreateParams}
        ref={proModalCreateRef}
      />
    </PageContainer>
  )
}
