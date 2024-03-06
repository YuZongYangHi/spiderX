import {useIntl, useModel} from "@@/exports";
import React, { useRef, useState} from "react";
import {ProColumns, ModalForm, ProFormText, ProFormSelect, ProForm, ProFormTextArea} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  listTicketProduct,
  createTicketProducty,
  destroyTicketProduct,
  updateTicketProduct
} from "@/services/Ticket/api";
import IconStoreHouse from '@/components/IconStoreHouse'
import {StorageHouse} from '@/components/IconStoreHouse/storageHouse'
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  adminTicketProductMenuKeys
} from "@/access";
import {queryGroupList} from '@/services/group/api'
import {Button, Space, Tag, Avatar, message} from "antd";
import ProTable from "@/components/ProTable";
import {clickExtender} from "@/components/Style/style";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";
import {history} from "umi";

const icons = StorageHouse()

export default () => {
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const [searchGroup, setSearchGroup] = useState("");
  const iconRef = useRef()
  const formRef = useRef()
  const [icon, setIcon] = useState("CameraTwoTone")
  const [title, setTitle] = useState('ticket.category.create.title')
  const [submitAction, setSubmitAction] = useState("create")

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "ticket.category.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "ticket.category.name"}),
      dataIndex: "name",
      render: (_, record) => {
        return <span style={clickExtender} onClick={()=> history.push(`/admin/ticket-flow-engine/product/${record.id}/category`)}>{record.name}</span>
      }
    },
    {
      title: intl.formatMessage({id: "ticket.category.icon"}),
      dataIndex: "icon",
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: intl.formatMessage({id: "ticket.category.allowedVisibilityGroups"}),
      dataIndex: "allowedVisibilityGroups",
      valueType: 'select',
      choices: (value, record) => record.groups.map(item => item.name),
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: queryGroupList
        }

        if (searchGroup !== "") {
          params.params["filter"] = `name=${setSearchGroup}`
        }
        return RemoteRequestSelectSearch(params)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setSearchGroup(value)
        }
      },
      render: (_, record) => {
        return record.groups.length > 0 ? <Space>
          {
            record.groups.map((item, index) => <Tag key={index} color="blue">{item.name}</Tag>)
          }
        </Space> : <Tag color="blue">全员可见</Tag>
      }
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.creator"}),
      dataIndex: "creator",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.category.description"}),
      hideInSearch: true,
      dataIndex: "description",
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.createTime"}),
      dataIndex: "createTime",
      hideInSearch: true,
      valueType: 'dateTime'
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.updateTime"}),
      dataIndex: "updateTime",
      hideInSearch: true,
      valueType: 'dateTime'
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (dom, record) => [
        <span
          key="look"
          onClick={()=> history.push(`/admin/ticket-flow-engine/product/${record.id}/category`)}
          style={clickExtender}>{intl.formatMessage({id: 'component.operate.detail'})}</span>,
        checkUserUpdatePermissions(adminTicketProductMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                const value = { ...record }
                if (value.allowedVisibilityGroups === "") {
                 value.allowedVisibilityGroups = "$all"
               } else {
                 value.allowedVisibilityGroups = value.allowedVisibilityGroups.split(",").map(Number);
               }
                setCurrentRow(value)
                setTitle("ticket.category.update.title")
                setSubmitAction("update")
                setAddVisable(true)
                setIcon(value.icon)
               }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(adminTicketProductMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{tableRef.current?.deleteAction(record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  const [addVisable, setAddVisable] = useState(false);
  const [searchFormGroup, setSearchFormGroup] = useState("")

  const fetchParams: fetchParamsType = {
    fetch: listTicketProduct,
    requestQueryFieldOptions: ["name", "allowedVisibilityGroups"],
    requestParams: []
  }

  const columnsState = {
    status: true,
    defaultValue:  {}
  }

  const toolBarRender = [
    checkUserCreatePermissions(adminTicketProductMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{
      setTitle("ticket.category.create.title")
      setSubmitAction("create")
      setAddVisable(true)
    }} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport = {
    status: true,
    fileName: "ticket.category.export.fileName",
    sheetName: "ticket.category.export.sheetName"
  }

  const TableProps = {
    columns: columns,
    permissionsMenuKeys: adminTicketProductMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: destroyTicketProduct,
    defaultSize: 'small'
  }

  const handleOnCreate = async (values) => {
     if (values.allowedVisibilityGroups.indexOf("$all") !== -1) {
       values.allowedVisibilityGroups = ''
     } else {
       values.allowedVisibilityGroups = values.allowedVisibilityGroups.join(",")
     }
     values.icon = icon

    let request: any
    let msg = ""
    switch (submitAction) {
      case "create":
        msg = "ticket.category.create.message"
        request = createTicketProducty(values)
        break
      case "update":
        msg = "ticket.category.update.message"
        request = updateTicketProduct(currentRow.id, values)
        break
    }

     const result = await request
      if (result.success) {
        message.success(intl.formatMessage({id: msg}))
        tableRef?.current?.actionRef?.current?.reload?.()
        setAddVisable(false)
        setCurrentRow({})
        setIcon("")
    }
  }

  const handleSetIcon = (icon) => {
    setIcon(icon)
  }

  return (
    <>
      <ProTable {...TableProps} ref={tableRef} />
      <ModalForm
        initialValues={currentRow}
        formRef={formRef}
        width={600}
        open={addVisable}
        title={intl.formatMessage({id: title})}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setCurrentRow({})
            setIcon("CameraTwoTone")
            setAddVisable(false)
          }
        }}
        onFinish={handleOnCreate}
      >
        <ProForm.Item
            name="icon"
            label={intl.formatMessage({id: 'ticket.category.icon'})}>
            <Avatar
              onClick={()=>iconRef.current.handleOpen(true)}
              shape="square"
              size={40}
              style={{ backgroundColor: '#068DEC', cursor: "pointer", marginLeft: 5 }}
              icon={icons[icon]}
            />
        </ProForm.Item>

        <ProFormText
          name="name"
          rules={[{ required: true, message: intl.formatMessage({id: 'ticket.category.name'}) }]}
          placeholder={intl.formatMessage({id: 'ticket.category.name'})}
          label={intl.formatMessage({id: 'ticket.category.name'})}
        />

        <ProFormSelect
          name="allowedVisibilityGroups"
          label={intl.formatMessage({id: "ticket.category.allowedVisibilityGroups"})}
          rules={[{ required: true, message: intl.formatMessage({id: 'ticket.category.allowedVisibilityGroups'}) }]}
          placeholder={intl.formatMessage({id: 'ticket.category.allowedVisibilityGroups'})}
          request={async () => {
            const params: handlerRequest.RemoteSelectSearchParams = {
              option: {
                label: "name",
                value: "id"
              },
              params: {},
              request: queryGroupList
            }

            if (searchFormGroup !== "") {
              params.params["filter"] = `name=${searchFormGroup}`
            }
            const result = await RemoteRequestSelectSearch(params)
            if (searchFormGroup === "") {
              result.unshift({
                label: "全员可见",
                value: "$all"
              })
            }
            return result
          }}
          mode="multiple"
          fieldProps={{
            allowClear: true,
            showSearch: true,
            onSearch: (value: string) => {
              setSearchFormGroup(value)
            }
          }}
        />

        <ProFormTextArea
          name="description"
          label={intl.formatMessage({id: "ticket.category.description"})}
          rules={[{ required: true, message: intl.formatMessage({id: 'ticket.category.description'}) }]}
          placeholder={intl.formatMessage({id: 'ticket.category.description'})}
        />
      </ModalForm>

      <IconStoreHouse setIcon={handleSetIcon} ref={iconRef}/>
    </>
  )
}
