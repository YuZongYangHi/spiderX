
import React, {useRef, useState} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {ProColumns, ProFormText, PageContainer} from "@ant-design/pro-components";
import {history, useIntl, useModel} from "@@/exports";
import {CommonTable} from "@/components/Table/typings";
import {
 queryAPIRoleList, deleteAPIRole, createAPIRole, updateAPIRole
} from "@/services/permissions/rbac/role";
import {
  checkUserCreatePermissions,
  checkUserDeletePermissions,
  checkUserHavePageReadPermissions,
  checkUserUpdatePermissions,
  permissionsRoleMenuKeys
} from "@/access";
import {clickExtender} from "@/components/Style/style";
import {Button} from "antd";
import {useAccess} from "umi";

export default () => {
  const proTableRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const proModalUpdateRef = useRef(null);
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const access = useAccess()
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<rbacAPIResponse.RoleInfo>();
  const [currentRowParams, setCurrentRowParams] = useState<any[]>();
  const formItems =  [
    {
      name: "name",
      label: intl.formatMessage({id: 'pages.permissions.role.column.name'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.role.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.permissions.role.column.name'})
      }
    },
    {
      name: "description",
      label: intl.formatMessage({id: 'pages.permissions.role.column.description'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.role.column.description'}),
      component: ProFormText,
      width: "xl",
      options: {
      },
      rules: {
        required: false,
        message: intl.formatMessage({id: 'pages.permissions.resource.column.description'})
      },
    }
  ]
  const columns: ProColumns<rbacAPIResponse.ResourceInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.role.column.name'}),
      dataIndex: "name",
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.role.column.description'}),
      dataIndex: "description",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.role.column.createTime'}),
      dataIndex: "createTime",
      hideInSearch: true,
      valueType: "dateTime"
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.role.column.updateTime'}),
      dataIndex: "updateTime",
      hideInSearch: true,
      valueType: "dateTime"
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        checkUserHavePageReadPermissions(permissionsRoleMenuKeys, access, userMenuPermissions) &&
        <span style={clickExtender}
              key="resourceAllocate"
              onClick={()=>{
                history.push(`/permissions/role/${record.id}/resources`)
              }}>
          {intl.formatMessage({id: 'pages.permissions.menu.role.column.options.resourceAllocate'})}
        </span>,
        checkUserHavePageReadPermissions(permissionsRoleMenuKeys, access, userMenuPermissions) &&
        <span style={clickExtender}
              key="roleGrant"
              onClick={()=>{
                history.push(`/permissions/role/${record.id}/api/grant`)
              }}>
          {intl.formatMessage({id: 'pages.permissions.menu.role.column.options.roleGrant'})}
        </span>,
        checkUserUpdatePermissions(permissionsRoleMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="edit"
              onClick={()=>{
                proModalUpdateRef.current?.proModalHandleOpen?.(true)
                const value = {
                  id: record.id,
                  name: record.name,
                  description: record.description
                }
                setCurrentRowParams([record.id])
                setCurrentRow(value);
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(permissionsRoleMenuKeys, userMenuPermissions) &&
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
    permissionsMenuKeys: permissionsRoleMenuKeys,
    // @ts-ignore
    listRequest: queryAPIRoleList,
    // @ts-ignore
    requestParams: [],
    rowKey: "id",
    requestQueryFieldOptions: ["name"],
    openSearch: true,
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsRoleMenuKeys, userMenuPermissions) &&
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
        request: deleteAPIRole
      }
    }
  }

  const handleOnUpdateCancel = () => {
    proTableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'pages.permissions.role.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateAPIRole,
    initialValues: currentRow,
    formItems: formItems,
    params: currentRowParams,
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }
  const ProModalCreateParams: ProModal.Params = {
    title: 'pages.permissions.role.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: [
      formItems[0],
      formItems[1],
    ],
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createAPIRole,
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
