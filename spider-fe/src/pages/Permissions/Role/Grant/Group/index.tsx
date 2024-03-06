import React, {useRef} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {ProColumns, ProFormText} from "@ant-design/pro-components";
import {useIntl, useModel, useParams} from "@@/exports";
import {CommonTable} from "@/components/Table/typings";
import {
  queryAPIRoleRelGroupAvailableList, deleteAPIRoleRelGroup, createAPIRoleRelGroup, queryAPIRoleRelGroupList
} from "@/services/permissions/rbac/roleRelGroup";
import {
  checkUserCreatePermissions,
  checkUserDeletePermissions,
  permissionsRoleRelGroupMenuKeys
} from "@/access";
import {clickExtender} from "@/components/Style/style";
import {Button, message} from "antd";

export default () => {
  const proTableRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const intl = useIntl();
  const p = useParams()
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const columns: ProColumns<MenuRoleAllocationResponse.GroupInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.groupName'}),
      dataIndex: "groupName",
      hideInSearch: true,
      render: (dom, record) => {
        return record.group.name;
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.column.description'}),
      dataIndex: "description",
      hideInSearch: true,
      render: (dom, record) => {
        return record.group.description;
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.column.updateTime'}),
      dataIndex: "createTime",
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.column.updateTime'}),
      dataIndex: "updateTime",
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        checkUserDeletePermissions(permissionsRoleRelGroupMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{proTableRef.current?.deleteAction(p.roleId, record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  const ProTableParams: CommonTable.Params = {
    columns: columns,
    permissionsMenuKeys: permissionsRoleRelGroupMenuKeys,
    // @ts-ignore
    listRequest: queryAPIRoleRelGroupList,
    // @ts-ignore
    requestParams: [p?.roleId.toString()],
    rowKey: "id",
    requestQueryFieldOptions: [],
    openSearch: false,
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsRoleRelGroupMenuKeys, userMenuPermissions) &&
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
        request: deleteAPIRoleRelGroup
      }
    }
  }

  const handleOnUpdateCancel = () => {
    proTableRef?.current?.actionRef?.current?.reload?.()
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'pages.permissions.menu.list.role.grant.group.create.title',
    width: "510px",
    // @ts-ignore
    params: [p?.roleId.toString()],
    initialValues: {},
    formItems: [
      {
        name: "groupId",
        label: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.groupName'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.groupName'}),
        component: ProFormText,
        width: "xl",
        options: {
          request: async () => {
            // @ts-ignore
            const result = await queryAPIRoleRelGroupAvailableList(p?.roleId)
            if (!result.success) {
              message.error("获取用户组失败")
              return []
            }
            return result.data.list.map(value => (
              {
                label: value.name,
                value: value.id,
              }
            ))
          }
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.groupName.rule'})
        }
      },
    ],
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createAPIRoleRelGroup,
    successMessage: 'pages.permissions.menu.list.role.grant.group.form.create.success',
    errorMessage: 'pages.permissions.menu.list.role.grant.group.form.create.fail'
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
