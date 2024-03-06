import {queryOnCallDrawLotsList, DestroyOnCallDrawLots, UpdateOnCallDrawLots, CreateOnCallDrawLots} from '@/services/OnCall/api'
import {DesignProTable} from "@/components/ProTable/typing";
import {ProColumns} from "@ant-design/pro-components";
import React, {useRef, useState} from "react";
import {useIntl} from "umi";
import ProTable from "@/components/ProTable";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  adminOnCallDrawLots,
  checkUserCreatePermissions,
  checkUserDeletePermissions,
  checkUserUpdatePermissions
} from "@/access";
import {Space, Tag, Button} from 'antd'
import {useModel} from "@@/exports";
import {clickExtender} from "@/components/Style/style";
import {CreateFormItemFunc, UpdateFormItemFunc} from "@/pages/admin/OnCall/DrawLots/form";
import ProDrawerForm from "@/components/ProDrawerForm";

export default () => {
  const tableRef = useRef()
  const intl = useIntl()
  const { initialState } = useModel('@@initialState');
  const {userMenuPermissions} = initialState ?? {};
  const [currentRow, setCurrentRow] = useState<OnCallResponse.DrawLotsInfo>();
  const proModalUpdateRef = useRef(null);
  const proModalCreateRef = useRef(null);

  const columns: ProColumns<OnCallResponse.DrawLotsInfo>[] = [
    {
      title: intl.formatMessage({id: "admin.onCall.column.userIds"}),
      dataIndex: "userIds",
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
      fixed: 'left',
      width: 180
    },
    {
      title: intl.formatMessage({id: "admin.onCall.column.users"}),
      dataIndex: "users",
      copyable: true,
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => {
        return <Space>{record.users.map((item, index) => <Tag key={index}>{item}</Tag> )}</Space>
      }
    },{

      title: intl.formatMessage({id: "admin.onCall.column.dutyType"}),
      dataIndex: "dutyType",
      copyable: true,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({id: "admin.onCall.column.effectiveTime"}),
      dataIndex: "effectiveTime",
      copyable: true,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "admin.onCall.column.createTime"}),
      dataIndex: "createTime",
      copyable: true,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "admin.onCall.column.updateTime"}),
      dataIndex: "updateTime",
      copyable: true,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (dom, record) => [
        checkUserUpdatePermissions(adminOnCallDrawLots, userMenuPermissions) && <span
          onClick={() => {
            setCurrentRow(record)
            proModalUpdateRef.current?.proDrawerRefHandleOpen?.(true)
          }}
          key="edit"
          style={clickExtender}>{intl.formatMessage({id: 'admin.onCall.column.option.edit'})}</span>,
        checkUserDeletePermissions(adminOnCallDrawLots, userMenuPermissions) && <span
          onClick={()=>{tableRef?.current?.deleteAction(record.id)}}
          key="delete"
          style={clickExtender}>{intl.formatMessage({id: 'admin.onCall.column.option.delete'})}</span>,
      ]
    }
    ]

  const fetchParams: fetchParamsType = {
    fetch: queryOnCallDrawLotsList,
    requestQueryFieldOptions: [],
    requestParams: []
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: adminOnCallDrawLots,
    fetchParams: fetchParams,
    openSearch: false,
    defaultSize: 'small',
    toolBarRender: [
      checkUserCreatePermissions(adminOnCallDrawLots, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proDrawerRefHandleOpen?.(true)}} >{intl.formatMessage({id: 'admin.onCall.column.option.add'})}</Button>,

    ],
    deleteRequest: DestroyOnCallDrawLots,
  }

  const handleOnUpdateCancel = () => {
    tableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'admin.onCall.create.title',
    width: "600px",
    layout: "vertical",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: CreateFormItemFunc(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: CreateOnCallDrawLots,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail',
    action: "create",
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'admin.onCall.update.title',
    width: "600px",
    layout: "vertical",
    // @ts-ignore
    params: [currentRow && currentRow.id],
    initialValues: currentRow,
    formItems: UpdateFormItemFunc(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: UpdateOnCallDrawLots,
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail',
    action: "update",
  }

  return (
    <div>
      <ProTable {...TableProps} ref={tableRef} />
      <ProDrawerForm {...ProModalCreateParams} ref={proModalCreateRef}/>
      <ProDrawerForm {...ProModalUpdateParams} ref={proModalUpdateRef}/>
    </div>
  )
}
