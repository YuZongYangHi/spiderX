
import React, {useRef, useState} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {ProColumns, ProFormText, ProFormTextArea, TableDropdown} from "@ant-design/pro-components";
import {useIntl, useModel, history} from "umi";
import {CommonTable} from "@/components/Table/typings";
import  {
  checkUserCreatePermissions, checkUserDeletePermissions, checkUserHavePageReadPermissions, checkUserUpdatePermissions,
  permissionsMenuRolePermissionsMenuKeys
} from "@/access";
import {
  MenuRoleCreate, MenuRoleDelete, MenuRoleUpdate, MenuRoleList
} from "@/services/permissions/menu/menu";
import {clickExtender} from "@/components/Style/style";
import {Button} from "antd";
import {useAccess} from "umi";

export default () => {
  const proTableRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const proModalUpdateRef = useRef(null);
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<MenuPermissionsForm.GrantGroupUpdate>();
  const [currentRowParams, setCurrentRowParams] = useState<any[]>();
  const access = useAccess()
  const formItems =  [
    {
      name: "name",
      label: intl.formatMessage({id: 'pages.permissions.menu.role.column.name'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.menu.role.column.name'}),
      component: ProFormText,
      width: "xl",
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.permissions.menu.role.column.name'})
      }
    },
    {
      name: "description",
      label: intl.formatMessage({id: 'pages.permissions.menu.role.column.description'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.menu.role.column.description'}),
      component: ProFormTextArea,
      width: "xl",
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.permissions.menu.role.column.description'})
      }
    }
  ]
  // @ts-ignore
  const columns: ProColumns<MenuResponse.MenuRoleInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.column.name'}),
      dataIndex: "name",
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.column.description'}),
      dataIndex: "description",
      hideInSearch: true
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.column.createTime'}),
      dataIndex: "createTime",
      valueType: 'dateTime',
      hideInSearch: true,
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
        checkUserHavePageReadPermissions(permissionsMenuRolePermissionsMenuKeys, access, userMenuPermissions) &&
        <span style={clickExtender}
              key="resourceAllocate"
              onClick={()=>{
                history.push(`/permissions/menu/role/${record.id}/resource`)
              }}>
          {intl.formatMessage({id: 'pages.permissions.menu.role.column.options.resourceAllocate'})}
        </span>,
        checkUserHavePageReadPermissions(permissionsMenuRolePermissionsMenuKeys, access, userMenuPermissions) &&
        <span style={clickExtender}
              key="roleGrant"
              onClick={()=>{
                history.push(`/permissions/menu/role/${record.id}/allocation`)
              }}>
          {intl.formatMessage({id: 'pages.permissions.menu.role.column.options.roleGrant'})}
        </span>,
        <TableDropdown
          key="actionGroup"
          menus={[
            // @ts-ignore
            checkUserUpdatePermissions(permissionsMenuRolePermissionsMenuKeys, userMenuPermissions) &&  {
            key: 'copy', name:  <span style={clickExtender}
                                  key="edit"
                                  onClick={()=>{
                                    proModalUpdateRef.current?.proModalHandleOpen?.(true)
                                    setCurrentRowParams([record.id])
                                    setCurrentRow(record);
                                  }}
              >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span> },
            // @ts-ignore
            checkUserDeletePermissions(permissionsMenuRolePermissionsMenuKeys, userMenuPermissions) &&  {
            key: 'delete', name: <span style={clickExtender}
                            key="delete"
                            onClick={()=>{proTableRef.current?.deleteAction(record.id)}}
              >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span> },
          ]}
        />,
      ]
    }
  ]
  const ProTableParams: CommonTable.Params = {
    columns: columns,
    openSearch: true,
    permissionsMenuKeys: permissionsMenuRolePermissionsMenuKeys,
    // @ts-ignore
    listRequest: MenuRoleList,
    // @ts-ignore
    requestParams: [],
    requestQueryFieldOptions: ["name"],
    rowKey: "id",
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsMenuRolePermissionsMenuKeys, userMenuPermissions) &&
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
        request: MenuRoleDelete
      }
    }
  }

  const handleOnUpdateCancel = () => {
    proTableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'component.operate.edit',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: MenuRoleUpdate,
    initialValues: currentRow,
    formItems: formItems,
    params: currentRowParams,
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }
  const ProModalCreateParams: ProModal.Params = {
    title: 'component.operate.create',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: [
      formItems[0],
      formItems[1]
    ],
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: MenuRoleCreate,
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
        {...ProModalUpdateParams}
        ref={proModalUpdateRef}
      />
      <DesignProModalForm
        {...ProModalCreateParams}
        ref={proModalCreateRef}
      />
    </>
  )
}
