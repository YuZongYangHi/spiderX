import React, {useRef, useState} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {ProColumns, ProFormText, ProFormRadio} from "@ant-design/pro-components";
import {useIntl, useModel, useParams} from "@@/exports";
import {permissionsValueRender} from '@/util/options'
import {CommonTable} from "@/components/Table/typings";
import {
  MenuGrantGroupList,
  MenuGrantGroupPermissionsCreate,
  MenuGrantGroupPermissionsDelete, MenuGrantGroupPermissionsList, MenuGrantGroupPermissionsUpdate
} from "@/services/permissions/menu/menu";
import {
  checkUserCreatePermissions,
  checkUserDeletePermissions,
  checkUserUpdatePermissions,
  permissionsMenuGrantGroupPermissionsMenuKeys
} from "@/access";
import {clickExtender} from "@/components/Style/style";
import {Button, message} from "antd";

export default () => {
  const proTableRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const proModalUpdateRef = useRef(null);
  const intl = useIntl();
  const p = useParams()
  const [currentRow, setCurrentRow] = useState<MenuPermissionsForm.GrantGroupUpdate>();
  const [currentRowParams, setCurrentRowParams] = useState<any[]>();
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const formItems =  [
      {
        name: "groupName",
        label: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.groupName'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.groupName'}),
        component: ProFormText,
        width: "xl",
        options: {
          disabled: true
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.groupName.rule'})
        }
      },
      {
        name: "menuName",
        label: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.menuName'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.menuName'}),
        component: ProFormText,
        width: "xl",
        options: {
          disabled: true
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.create.rule'})
        }
      },
      {
        name: "menuKey",
        label: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.menuKey'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.menuKey'}),
        component: ProFormText,
        width: "xl",
        options: {
          disabled: true
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.create.rule'})
        }
      },
      {
        name: "create",
        label: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.create'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.create'}),
        component: ProFormRadio.Group,
        width: "xl",
        options: {
          options: [
            {
              label: '是',
              value: true,
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.create.rule'})
        }
      },
      {
        name: "delete",
        label: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.delete'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.delete'}),
        component: ProFormRadio.Group,
        width: "xl",
        options: {
          options: [
            {
              label: '是',
              value: true,
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.delete.rule'})
        }
      },
      {
        name: "update",
        label: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.update'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.update'}),
        component: ProFormRadio.Group,
        width: "xl",
        options: {
          options: [
            {
              label: '是',
              value: true,
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.update.rule'})
        }
      },
      {
        name: "read",
        label: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.read'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.read'}),
        component: ProFormRadio.Group,
        width: "xl",
        options: {
          options: [
            {
              label: '是',
              value: true,
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.read.rule'})
        }
      }
    ]
  const columns: ProColumns<MenuResponse.MenuGrantGroupInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.groupName'}),
      dataIndex: "group",
      hideInSearch: true,
      render: (dom, record) => {
        return record.group.name;
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.menuName'}),
      dataIndex: "menu",
      hideInSearch: true,
      render: (dom, record) => {
        return record.menu.name
      }
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.menuKey'}),
      dataIndex: "menuKey",
      hideInSearch: true,
      render: (dom, record) => {
        return record.menu.key
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.create'}),
      dataIndex: "create",
      hideInSearch: true,
      render: (dom, record) => {
        return permissionsValueRender(record.create)
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.delete'}),
      dataIndex: "delete",
      hideInSearch: true,
      render: (dom, record) => {
        return permissionsValueRender(record.delete)
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.update'}),
      dataIndex: "update",
      hideInSearch: true,
      render: (dom, record) => {
        return permissionsValueRender(record.update)
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.read'}),
      dataIndex: "read",
      hideInSearch: true,
      render: (dom, record) => {
        return permissionsValueRender(record.read)
      }
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        checkUserUpdatePermissions(permissionsMenuGrantGroupPermissionsMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="edit"
              onClick={()=>{
                proModalUpdateRef.current?.proModalHandleOpen?.(true)
                const value = {
                  read: record.read,
                  update: record.update,
                  delete: record.delete,
                  create: record.create,
                  menuName: record.menu.name,
                  groupName: record.group.name,
                  menuKey: record.menu.key
                }
                setCurrentRowParams([record.menuId, record.id])
                setCurrentRow(value);
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,

        checkUserDeletePermissions(permissionsMenuGrantGroupPermissionsMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{proTableRef.current?.deleteAction(record.menuId, record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  const ProTableParams: CommonTable.Params = {
    columns: columns,
    permissionsMenuKeys: permissionsMenuGrantGroupPermissionsMenuKeys,
    // @ts-ignore
    listRequest: MenuGrantGroupPermissionsList,
    // @ts-ignore
    requestParams: [p?.menuId.toString()],
    rowKey: "id",
    requestQueryFieldOptions: ["menu"],
    openSearch: false,
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsMenuGrantGroupPermissionsMenuKeys, userMenuPermissions) &&
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
        request: MenuGrantGroupPermissionsDelete
      }
    }
  }

  const handleOnUpdateCancel = () => {
    proTableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'pages.permissions.menu.list.role.grant.group.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: MenuGrantGroupPermissionsUpdate,
    initialValues: currentRow,
    formItems: formItems,
    params: currentRowParams,
    successMessage: 'pages.permissions.menu.list.role.grant.group.form.update.success',
    errorMessage: 'pages.permissions.menu.list.role.grant.group.form.update.fail'
  }
  const ProModalCreateParams: ProModal.Params = {
    title: 'pages.permissions.menu.list.role.grant.group.create.title',
    width: "510px",
    // @ts-ignore
    params: [p?.menuId.toString()],
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
            const result = await MenuGrantGroupList(p?.menuId)
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
      formItems[3],
      formItems[4],
      formItems[5],
      formItems[6]
    ],
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: MenuGrantGroupPermissionsCreate,
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
