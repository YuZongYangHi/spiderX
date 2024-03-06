
import React, {useRef} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {PageContainer, ProColumns, ProFormText} from "@ant-design/pro-components";
import {useIntl, useModel} from "umi";
import {CommonTable} from "@/components/Table/typings";
import {
  checkUserCreatePermissions, checkUserDeletePermissions, permissionsMenuRoleResourceMenuKeys
} from "@/access";
import {
  MenuRoleResourceList, MenuRoleResourceDelete, MenuRoleResourceCreate, MenuRoleResourceMenusList, MenuGrantGroupList
} from "@/services/permissions/menu/menu";
import {clickExtender} from "@/components/Style/style";
import {Button, message} from "antd";
import {useParams} from "@@/exports";

export default () => {
  const proTableRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const intl = useIntl();
  const p = useParams()
  const formItems =  [
    {
      name: "menuId",
      label: intl.formatMessage({id: 'pages.permissions.menu.role.resource.column.menuName'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.menu.role.resource.column.menuName'}),
      component: ProFormText,
      width: "xl",
      options: {
        fieldProps: {
          showSearch: true
        },
        request: async () => {
          const result = await MenuRoleResourceMenusList(p?.roleId)
          if (!result.success) {
            message.error("获取菜单失败")
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
        message: intl.formatMessage({id: 'pages.permissions.menu.role.resource.column.menuName'})
      }
    }
  ]
  // @ts-ignore
  const columns: ProColumns<MenuRoleResourceResponse.ResourceInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.resource.column.roleName'}),
      dataIndex: "roleName",
      render: (dom, record) => {
        return record.role.name
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.resource.column.menuName'}),
      dataIndex: "menuName",
      hideInSearch: true,
      render: (dom, record) => {
        return record.menu.name
      }
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.resource.column.menuKey'}),
      dataIndex: "menuKey",
      hideInSearch: true,
      render: (dom, record) => {
        return record.menu.key
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
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        // @ts-ignore
        checkUserDeletePermissions(permissionsMenuRoleResourceMenuKeys, userMenuPermissions) &&
        <span style={clickExtender} key="delete" onClick={()=>{proTableRef.current?.deleteAction(record.role.id, record.id)}}> {intl.formatMessage({id: 'component.operate.delete'})}</span>
      ]
    }
  ]
  const ProTableParams: CommonTable.Params = {
    columns: columns,
    openSearch: false,
    permissionsMenuKeys: permissionsMenuRoleResourceMenuKeys,
    // @ts-ignore
    listRequest: MenuRoleResourceList,
    // @ts-ignore
    requestParams: [p.roleId],
    requestQueryFieldOptions: [],
    rowKey: "id",
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsMenuRoleResourceMenuKeys, userMenuPermissions) &&
      <Button
        key={"create"}
        type={"primary"}
        onClick={()=>{
          proModalCreateRef.current?.proModalHandleOpen?.(true)}
      }
      >{intl.formatMessage({id: 'component.operate.create'})}</Button>
    ],
    operate: {
      delete: {
        title: "component.operate.delete.title",
        content: "component.operate.delete.content",
        successMessage: "component.operate.delete.successMessage",
        errorMessage: "component.operate.delete.errorMessage",
        // @ts-ignore
        request: MenuRoleResourceDelete
      }
    }
  }

  const handleOnUpdateCancel = () => {
    proTableRef?.current?.actionRef?.current?.reload?.()
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'component.operate.create',
    width: "510px",
    // @ts-ignore
    params: [p.roleId],
    initialValues: {},
    formItems: formItems,
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: MenuRoleResourceCreate,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail'
  }
  return (
    <PageContainer header={{title: false}}>
      <DesignProTable
        {...ProTableParams}
        ref={proTableRef}
      />
      <DesignProModalForm
        {...ProModalCreateParams}
        ref={proModalCreateRef}
      />
    </PageContainer>
  )
}
