
import React, {useRef, useState} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {ProColumns, ProFormText, ProFormRadio, ProFormSelect, PageContainer} from "@ant-design/pro-components";
import {useIntl, useModel} from "@@/exports";
import {CommonTable} from "@/components/Table/typings";
import {
  queryUserList, deleteUser, updateUser, createUser
} from "@/services/users/api";
import {queryGroupAll} from '@/services/group/api'
import {
  checkUserCreatePermissions, checkUserDeletePermissions, checkUserUpdatePermissions,
  permissionsUserMenuKeys
} from "@/access";
import {clickExtender} from "@/components/Style/style";
import {Button, message} from "antd";
import {permissionsValueRender, userStatusValueRender} from "@/util/options";

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
      name: "username",
      label: intl.formatMessage({id: 'pages.permissions.user.column.username'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.user.column.username'}),
      component: ProFormText,
      width: "xl",
      options: {
        disabled: true
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.permissions.user.column.username'})
      }
    },
    {
      name: "name",
      label: intl.formatMessage({id: 'pages.permissions.user.column.name'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.user.column.name'}),
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
      name: "email",
      label: intl.formatMessage({id: 'pages.permissions.user.column.email'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.user.column.email'}),
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
      name: "password",
      label: intl.formatMessage({id: 'pages.permissions.user.column.password'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.user.column.password'}),
      component: ProFormText.Password,
      width: "xl",
      options: {
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.form.create.columns.create.rule'})
      }
    },
    {
      name: "groupId",
      label: intl.formatMessage({id: 'pages.permissions.user.column.group'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.user.column.group'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          // @ts-ignore
          const result = await queryGroupAll()
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
        message: intl.formatMessage({id: 'pages.permissions.user.column.group'})
      }
    },
    {
      name: "isActive",
      label: intl.formatMessage({id: 'pages.permissions.user.column.isActive'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.user.column.isActive'}),
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
        message: intl.formatMessage({id: 'pages.permissions.user.column.isActive'})
      }
    },
    {
      name: "isAdmin",
      label: intl.formatMessage({id: 'pages.permissions.user.column.isAdmin'}),
      placeholder: intl.formatMessage({id: 'pages.permissions.user.column.isAdmin'}),
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
        message: intl.formatMessage({id: 'pages.permissions.user.column.isAdmin'})
      }
    },

  ]
  const columns: ProColumns<UserResponse.UserInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.user.column.username'}),
      dataIndex: "username",
      render: (dom, record) => {
        return record.username
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.user.column.name'}),
      dataIndex: "name",
      render: (dom, record) => {
        return record.name
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.user.column.email'}),
      dataIndex: "email",
    }, {
      title: intl.formatMessage({id: 'pages.permissions.user.column.group'}),
      dataIndex: "groupId",
      request: async () => {
      // @ts-ignore
      const result = await queryGroupAll()
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
    },
      render: (dom, record) => {
        return record.group.name
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.user.column.isActive'}),
      dataIndex: "isActive",
      valueType: 'select',
      valueEnum: {
        1: {
          text: "是"
        },
        0: {
          text: "否"
        },
      },
      render: (dom, record) => {
        return userStatusValueRender(record.isActive)
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.user.column.isAdmin'}),
      dataIndex: "isAdmin",
      valueType: 'select',
      valueEnum: {
        1: {
          text: "是"
        },
        0: {
          text: "否"
        }
      },
      render: (dom, record) => {
        return permissionsValueRender(record.isAdmin)
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.user.column.createTime'}),
      dataIndex: "createTime",
      hideInSearch: true,
      valueType: "dateTime"
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.user.column.updateTime'}),
      dataIndex: "updateTime",
      hideInSearch: true,
      valueType: "dateTime"
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        checkUserUpdatePermissions(permissionsUserMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="edit"
              onClick={()=>{
                proModalUpdateRef.current?.proModalHandleOpen?.(true)
                const value = {
                  username: record.username,
                  name: record.name,
                  email: record.email,
                  password: record.password,
                  groupId: record.group.id,
                  isActive: record.isActive,
                  isAdmin: record.isAdmin
                }
                setCurrentRowParams([record.userId])
                setCurrentRow(value);
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(permissionsUserMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{proTableRef.current?.deleteAction(record.userId)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  const ProTableParams: CommonTable.Params = {
    columns: columns,
    permissionsMenuKeys: permissionsUserMenuKeys,
    // @ts-ignore
    listRequest: queryUserList,
    // @ts-ignore
    requestParams: [],
    rowKey: "id",
    requestQueryFieldOptions: ["username", "name", "email", "isActive", "isAdmin", "groupId"],
    openSearch: true,
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsUserMenuKeys, userMenuPermissions) &&
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
        request: deleteUser
      }
    }
  }

  const handleOnUpdateCancel = () => {
    proTableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'pages.permissions.user.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateUser,
    initialValues: currentRow,
    formItems: formItems,
    params: currentRowParams,
    successMessage: 'pages.permissions.user.update.success',
    errorMessage: 'pages.permissions.user.update.error'
  }
  const ProModalCreateParams: ProModal.Params = {
    title: 'pages.permissions.user.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: [
      {
        name: "username",
        label: intl.formatMessage({id: 'pages.permissions.user.column.username'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.user.column.username'}),
        component: ProFormText,
        width: "xl",
        options: {},
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.user.column.username'})
        }
      },
      {
        name: "name",
        label: intl.formatMessage({id: 'pages.permissions.user.column.name'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.user.column.name'}),
        component: ProFormText,
        width: "xl",
        options: {},
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.user.column.name'})
        }
      },
      {
        name: "email",
        label: intl.formatMessage({id: 'pages.permissions.user.column.email'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.user.column.email'}),
        component: ProFormText,
        width: "xl",
        options: {},
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.user.column.email'})
        }
      },
      {
        name: "password",
        label: intl.formatMessage({id: 'pages.permissions.user.column.password'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.user.column.password'}),
        component: ProFormText.Password,
        width: "xl",
        options: {},
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.user.column.password'})
        }
      },
      {
        name: "groupId",
        label: intl.formatMessage({id: 'pages.permissions.user.column.group'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.user.column.group'}),
        component: ProFormText,
        width: "xl",
        options: {
          request: async () => {
            // @ts-ignore
            const result = await queryGroupAll()
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
          message: intl.formatMessage({id: 'pages.permissions.user.column.group'})
        }
      },
      {
        name: "isActive",
        label: intl.formatMessage({id: 'pages.permissions.user.column.isActive'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.user.column.isActive'}),
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
          message: intl.formatMessage({id: 'pages.permissions.user.column.isActive'})
        }
      }, {
        name: "isAdmin",
        label: intl.formatMessage({id: 'pages.permissions.user.column.isAdmin'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.user.column.isAdmin'}),
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
          message: intl.formatMessage({id: 'pages.permissions.user.column.isAdmin'})
        }
      },
    ],
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createUser,
    successMessage: 'pages.permissions.user.create.success',
    errorMessage: 'pages.permissions.user.create.error'
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
