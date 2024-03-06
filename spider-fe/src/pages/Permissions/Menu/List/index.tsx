import type { ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import React, {useRef} from 'react';
import {useAccess, useIntl, useModel, Access} from "umi";
import {MenuList, DelMenu} from "@/services/permissions/menu/menu";
import {clickExtender} from "@/components/Style/style";
import {history} from '@umijs/max'
import {PlusOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import {Button, message, Modal} from 'antd'
import CreateMenuModal from '@/pages/Permissions/Menu/List/components/MenuCreate'
import UpdateMenuModel from '@/pages/Permissions/Menu/List/components/MenuUpdate'
import {
  checkUserHavePageReadPermissions, permissionsMenuListPermissionsMenuKeys,
  checkUserCreatePermissions, checkUserUpdatePermissions, checkUserDeletePermissions
} from "@/access";
import ForbiddenPage from "@/pages/403";
const { confirm } = Modal;

export default () => {
  const intl = useIntl();
  const access = useAccess();
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const actionRef = useRef<ActionType>();
  const { setCurrentMenuRow, handleUpdateModalOpen, handleModalOpen, setMenuList } = useModel('menu');

  const deleteMenu = (id: number) => {
    confirm({
      title: intl.formatMessage({id: 'pages.permissions.menu.list.delete.title'}),
      icon: <ExclamationCircleFilled />,
      content: intl.formatMessage({id: 'pages.permissions.menu.list.delete.content'}),
      onOk() {
        return DelMenu(id).then((res=>{
          message.success("delete successfully")
          actionRef.current?.reload()
        })).catch(err=>{
          message.error("delete fail")
          console.log(err)
        })
      },
      onCancel() {},
    });
  };

  const showEditModal = (item: MenuResponse.MenuInfo) => {
    if (item.parentId > 0) {
      item.relatedParent = true
    } else {
      item.parentId = null
    }
    setCurrentMenuRow(item)
    handleUpdateModalOpen(true)
  }

  const columns: ProColumns<MenuResponse.MenuInfo>[] = [
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.column.name'}),
      dataIndex: 'name',
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.column.key'}),
      dataIndex: 'key',
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.column.createUser'}),
      dataIndex: 'createUser',
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.table.column.createTime'}),
      key: 'showTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.table.column.updateTime'}),
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.table.column.option'}),
      key: 'option',
      valueType: 'option',
      render: (dom,record) => [
        checkUserHavePageReadPermissions(permissionsMenuListPermissionsMenuKeys, access, userMenuPermissions) &&
        <span style={clickExtender}
              onClick={() => {
                history.push(`/permissions/menu/${record.id}/role/grant`)
              }}
              key="roleGrant">
            {intl.formatMessage({id: 'pages.permissions.menu.list.option.roleGrant'})}
        </span>,
        checkUserUpdatePermissions(permissionsMenuListPermissionsMenuKeys, userMenuPermissions) &&
        <span
          onClick={()=>{showEditModal(record)}}
          style={clickExtender}
          key="edit">{intl.formatMessage({id: 'pages.permissions.menu.list.option.edit'})}</span>,
        checkUserDeletePermissions(permissionsMenuListPermissionsMenuKeys, userMenuPermissions) &&
        <span
          onClick={()=>{deleteMenu(record.id)}}
          style={clickExtender}
          key="delete">{intl.formatMessage({id: 'pages.permissions.menu.list.option.delete'})}</span>
      ]
    }
  ];

  return (
    <Access
      accessible={checkUserHavePageReadPermissions(permissionsMenuListPermissionsMenuKeys, access, userMenuPermissions)}
      fallback={<ForbiddenPage/>}>
      <ProTable<MenuResponse.MenuInfo>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async () => {
          const result = await MenuList();
          setMenuList(result.data.list)
          return {
            success: result.success,
            data: result.data.list
          }
        }}
        toolBarRender={() => [
          checkUserCreatePermissions(permissionsMenuListPermissionsMenuKeys, userMenuPermissions) &&
          <Button
            key="button"
            icon={<PlusOutlined/>}
            onClick={() => {
              handleModalOpen(true);
            }}
            type="primary"
          >
            {intl.formatMessage({id: 'pages.table.toolBarRender.create'})}
          </Button>
        ]}
        rowKey="id"
        size="small"
        search={false}
        pagination={false}
      />
      <CreateMenuModal actionRef={actionRef} />
      <UpdateMenuModel actionRef={actionRef} />
    </Access>
  );
};
