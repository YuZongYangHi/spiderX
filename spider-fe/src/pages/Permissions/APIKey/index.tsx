import React, {useRef, useState} from "react";
import DesignProTable from '@/components/Table'
import DesignProModalForm from '@/components/ProModal'
import {
  ProColumns,
  PageContainer,
  ProFormSelect, ProFormText, ProFormDigit, ProFormTextArea
} from "@ant-design/pro-components";
import {useIntl, useModel} from "umi";
import {CommonTable} from "@/components/Table/typings";
import {
  checkUserCreatePermissions,
  checkUserDeletePermissions, checkUserHavePageReadPermissions, permissionsAPIKeyMenuKeys
} from "@/access";
import {
  queryAPIKeyList, createAPIKey, deleteAPIKey
} from "@/services/permissions/rbac/apiKey";
import {Button, message, Tag, Modal} from "antd";
import {clickExtender} from "@/components/Style/style";
import moment from 'moment'
import {queryAPIRoleList} from "@/services/permissions/rbac/role";
import {useAccess} from "@@/exports";

export default () => {
  const proTableRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const [currentRow, setCurrentRow] = useState({});
  const [open, setOpen] = useState(false)
  const access = useAccess();
  const intl = useIntl();

  const columns: ProColumns<rbacAPIResponse.APIKeyInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.apiKey.column.name'}),
      dataIndex: "name",
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.apiKey.column.roleName'}),
      dataIndex: "role",
      hideInSearch: true,
      render: (dom, record) => {
        const tags = []
        record.roles.forEach((item, index) =>
          tags.push(<Tag key={index}>{item.name}</Tag>)
        )
        return tags
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.apiKey.column.expireIn'}),
      dataIndex: "expireIn",
      hideInSearch: true,
      render: (dom, record) => {
        return moment(record.createTime).add(record.expireIn, 's').format("YYYY-MM-DD hh:mm:ss")
      }
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.apiKey.column.owner'}),
      dataIndex: "owner",
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.role.column.createTime'}),
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
        checkUserHavePageReadPermissions(permissionsAPIKeyMenuKeys, access, userMenuPermissions) &&
        <span style={clickExtender}
              key="look"
              onClick={()=>{queryTokenHandle(record)}}
        >
            {intl.formatMessage({id: 'pages.permissions.apiKey.option.apiKey'})}
        </span>,
        checkUserDeletePermissions(permissionsAPIKeyMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{proTableRef.current?.deleteAction(record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]

  const queryTokenHandle = (record: rbacAPIResponse.APIKeyInfo) => {
    setCurrentRow(record)
    setOpen(true)
  }
  const ProTableParams: CommonTable.Params = {
    columns: columns,
    permissionsMenuKeys: permissionsAPIKeyMenuKeys,
    // @ts-ignore
    listRequest: queryAPIKeyList,
    // @ts-ignore
    requestParams: [],
    rowKey: "id",
    requestQueryFieldOptions: ["name"],
    openSearch: true,
    // @ts-ignore
    toolBarRender: [
      checkUserCreatePermissions(permissionsAPIKeyMenuKeys, userMenuPermissions) &&
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
        request: deleteAPIKey
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
    params: [],
    initialValues: {},
    formItems: [
      {
        name: "name",
        label: intl.formatMessage({id: 'pages.permissions.apiKey.column.name'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.apiKey.column.name'}),
        component: ProFormText,
        width: "xl",
        options: {},
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.apiKey.column.name'})
        }
      },
      {
        name: "expireIn",
        label: intl.formatMessage({id: 'pages.permissions.apiKey.column.expireIn'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.apiKey.column.expireIn'}),
        component: ProFormDigit,
        width: "xl",
        options: {
          fieldProps: {
            min: 0,
            max: 94608000
          },
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'pages.permissions.apiKey.column.expireIn'})
        }
      },
      {
        name: "roleIds",
        label: intl.formatMessage({id: 'pages.permissions.apiKey.column.roleName'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.apiKey.column.roleName'}),
        component: ProFormSelect,
        width: "xl",
        options: {
          fieldProps: {
            mode: "multiple",
            allowClear: false
          },
          request: async () => {
            // @ts-ignore
            const params = {
              "pageNum": 10000,
            }
            const result = await queryAPIRoleList(params)
            if (!result.success) {
              message.error("get role list fail")
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
          message: intl.formatMessage({id: 'pages.permissions.apiKey.column.roleName'})
        }
      },
      {
        name: "description",
        label: intl.formatMessage({id: 'pages.permissions.apiKey.column.description'}),
        placeholder: intl.formatMessage({id: 'pages.permissions.apiKey.column.description'}),
        component: ProFormTextArea,
        width: "xl",
        options: {},
        rules: {
          required: false,
          message: intl.formatMessage({id: 'pages.permissions.apiKey.column.description'})
        }
      },
    ],
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createAPIKey,
    successMessage: 'pages.permissions.menu.list.role.grant.group.form.create.success',
    errorMessage: 'pages.permissions.menu.list.role.grant.group.form.create.fail'
  }
  return (
    <PageContainer title={false}>
      <DesignProTable
        {...ProTableParams}
        ref={proTableRef}
      />
      <DesignProModalForm
        {...ProModalCreateParams}
        ref={proModalCreateRef}
      />
      <Modal
        open={open}
        title={currentRow.name}
        destroyOnClose={true}
        onCancel={()=>{setOpen(false)}}
      >
        <span>{currentRow.token}</span>
      </Modal>
    </PageContainer>
  )
}
