
import React, {useRef} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {ProColumns, ProFormSelect} from "@ant-design/pro-components";
import {useIntl, useModel, useParams} from "@@/exports";
import {CommonTable} from "@/components/Table/typings";
import {
  queryAPIRoleRelAvailableResourceList, deleteAPIRoleRelResource, createAPIRoleRelResource, queryAPIRoleRelResourceList
} from "@/services/permissions/rbac/roleResource";
import {
  checkUserCreatePermissions,
  checkUserDeletePermissions,
  permissionsRoleRelResourceMenuKeys
} from "@/access";
import {clickExtender} from "@/components/Style/style";
import {Button} from "antd";
import {apiVerbValueRender} from "@/util/options";

export default () => {
  const proTableRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const intl = useIntl();
  const p = useParams()
  const columns: ProColumns<rbacAPIResponse.RoleRelResourceInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.role.column.name'}),
      dataIndex: "roleId",
      render: (dom, record) => {
        return record.role.name
      },
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.role.rel.resource.column.resourceName'}),
      dataIndex: "actionId",
      hideInSearch: true,
      render: (dom, record) => {
        return record.action.resource
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.role.rel.resource.column.resourceVerb'}),
      dataIndex: "action",
      hideInSearch: true,
      render: (dom, record) => {
        return apiVerbValueRender(record.action.verb)
      }
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        checkUserDeletePermissions(permissionsRoleRelResourceMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{proTableRef.current?.deleteAction(record.role.id, record.action.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  const ProTableParams: CommonTable.Params = {
    columns: columns,
    permissionsMenuKeys: permissionsRoleRelResourceMenuKeys,
    // @ts-ignore
    listRequest: queryAPIRoleRelResourceList,
    // @ts-ignore
    requestParams: [p.roleId],
    rowKey: "id",
    requestQueryFieldOptions: [],
    openSearch: false,
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsRoleRelResourceMenuKeys, userMenuPermissions) &&
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
        request: deleteAPIRoleRelResource
      }
    }
  }

  const handleOnUpdateCancel = () => {
    proTableRef?.current?.actionRef?.current?.reload?.()
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'pages.permissions.role.create.title',
    width: "510px",
    // @ts-ignore
    params: [p.roleId],
    initialValues: {},
    formItems: [
      {
        name: "resourceId",
        label: intl.formatMessage({id: 'pages.permissions.role.rel.resource.column.resourceName'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.role.rel.resource.column.resourceName'}),
        component: ProFormSelect,
        width: "xl",
        options: {
          fieldProps: {
            allowClear: true,
            showSearch: true
          },
          request: async () => {
            const result = await queryAPIRoleRelAvailableResourceList(p?.roleId)
            if (!result.success) {
              return []
            }
            return result.data.list.map(value => (
              {
                label: `${value.resource} | ${value.verb}`,
                value: value.id,
              }
            ))
          }
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.role.rel.resource.column.resourceName'})
        }
      }
    ],
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createAPIRoleRelResource,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail'
  }

  return (
    <>
      <DesignProTable
        {...ProTableParams}
        ref={proTableRef}
      />

      <DesignProModalForm
        {...ProModalCreateParams}
        ref={proModalCreateRef}
      />
    </>
  )
}
