
import React, {useRef, useState} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {ProColumns, ProFormText, PageContainer} from "@ant-design/pro-components";
import {useIntl, useModel} from "@@/exports";
import {CommonTable} from "@/components/Table/typings";
import {
  queryAPIResourceList, deleteAPIResource, updateAPIResource, createAPIResource
} from "@/services/permissions/rbac/resource";
import {
  checkUserCreatePermissions, checkUserDeletePermissions, checkUserUpdatePermissions,
  permissionsResourceMenuKeys
} from "@/access";
import {clickExtender} from "@/components/Style/style";
import {Button} from "antd";
import {apiPermissionsValueEnum, apiVerbValueRender} from "@/util/options";

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
      name: "resource",
      label: intl.formatMessage({id: 'pages.permissions.resource.column.resource'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.resource.column.resource'}),
      component: ProFormText,
      width: "xl",
      options: {
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.permissions.resource.column.resource'})
      }
    },
    {
      name: "verb",
      label: intl.formatMessage({id: 'pages.permissions.resource.column.verb'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.resource.column.verb'}),
      component: ProFormText,
      width: "xl",
      options: {
        valueEnum: apiPermissionsValueEnum
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.permissions.resource.column.verb'})
      },
    },
    {
      name: "description",
      label: intl.formatMessage({id: 'pages.permissions.resource.column.description'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.resource.column.description'}),
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
      title: intl.formatMessage({id: 'pages.permissions.resource.column.resource'}),
      dataIndex: "resource",
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.resource.column.verb'}),
      dataIndex: "verb",
      valueType: 'select',
      render: (dom, record) => {
        return apiVerbValueRender(record.verb)
      },
      valueEnum: apiPermissionsValueEnum
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.resource.column.description'}),
      dataIndex: "description",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.resource.column.createTime'}),
      dataIndex: "createTime",
      hideInSearch: true,
      valueType: "dateTime"
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.resource.column.updateTime'}),
      dataIndex: "updateTime",
      hideInSearch: true,
      valueType: "dateTime"
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        checkUserUpdatePermissions(permissionsResourceMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="edit"
              onClick={()=>{
                proModalUpdateRef.current?.proModalHandleOpen?.(true)
                const value = {
                  id: record.id,
                  resource: record.resource,
                  verb: record.verb,
                  description: record.description
                }
                setCurrentRowParams([record.id])
                setCurrentRow(value);
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(permissionsResourceMenuKeys, userMenuPermissions) &&
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
    permissionsMenuKeys: permissionsResourceMenuKeys,
    // @ts-ignore
    listRequest: queryAPIResourceList,
    // @ts-ignore
    requestParams: [],
    rowKey: "id",
    requestQueryFieldOptions: ["resource", "verb"],
    openSearch: true,
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsResourceMenuKeys, userMenuPermissions) &&
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
        request: deleteAPIResource
      }
    }
  }

  const handleOnUpdateCancel = () => {
    proTableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'pages.permissions.resource.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateAPIResource,
    initialValues: currentRow,
    formItems: formItems,
    params: currentRowParams,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail'
  }
  const ProModalCreateParams: ProModal.Params = {
    title: 'pages.permissions.group.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: [
      formItems[0],
      formItems[1],
      formItems[2]
    ],
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createAPIResource,
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
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
