import {useIntl, useModel} from "@@/exports";
import React, { useRef, useState, useEffect} from "react";
import {ProColumns, ModalForm, ProFormText, ProFormSelect, ProForm, ProFormTextArea} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  createTicketCategory,
  destroyTicketCategory, listTicketCategoryByProductId,
  updateTicketCategory,
} from "@/services/Ticket/api";
import IconStoreHouse from '@/components/IconStoreHouse'
import {StorageHouse} from '@/components/IconStoreHouse/storageHouse'
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  adminTicketCategoryMenuKeys
} from "@/access";
import {queryGroupList} from '@/services/group/api'
import {Button, Space, Tag, Avatar, message, Input} from "antd";
import ProTable from "@/components/ProTable";
import {clickExtender} from "@/components/Style/style";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";
import {history, useParams} from "umi";
import moment from 'moment'

const icons = StorageHouse()

export default () => {
  const params = useParams()
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const [searchGroup, setSearchGroup] = useState("");
  const iconRef = useRef()
  const formRef = useRef()
  const [icon, setIcon] = useState("CameraTwoTone")
  const [title, setTitle] = useState('ticket.workflow.create.title')
  const [submitAction, setSubmitAction] = useState("create")
  const [addVisable, setAddVisable] = useState(false);
  const [searchFormGroup, setSearchFormGroup] = useState("")
  const [sn1, setSn1] = useState("")
  const [sn2, setSn2] = useState("")
  const [sn3, setSn3] = useState("")
  const [sn4, setSn4] = useState("")

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "ticket.workflow.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.name"}),
      dataIndex: "name",
      render: (_, record) => {
        return <span style={clickExtender} onClick={()=> history.push(`/admin/ticket-flow-engine/product/${params.id}/category/${record.id}/designer`)}>{record.name}</span>
      }
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.snRuleIdentifier"}),
      dataIndex: "snRuleIdentifier",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.allowedVisibilityGroups"}),
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
      title: intl.formatMessage({id: "ticket.workflow.layout"}),
      dataIndex: "layout",
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.webhook"}),
      dataIndex: "webhook",
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.creator"}),
      dataIndex: "creator",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "ticket.workflow.description"}),
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
          onClick={()=> history.push(`/admin/ticket-flow-engine/product/${params.id}/category/${record.id}/designer`)}
          style={clickExtender}>{intl.formatMessage({id: 'ticket.workflow.design'})}</span>,
        checkUserUpdatePermissions(adminTicketCategoryMenuKeys, userMenuPermissions) &&
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
                setTitle("ticket.workflow.update.title")
                setSubmitAction("update")
                setIcon(value.icon)
                setSn1(value.snRuleIdentifier[0])
                setSn2(value.snRuleIdentifier[1])
                setSn3(value.snRuleIdentifier[2])
                setSn4(value.snRuleIdentifier[3])
                setAddVisable(true)
              }}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(adminTicketCategoryMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{tableRef.current?.deleteAction(record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  const fetchParams: fetchParamsType = {
    fetch: listTicketCategoryByProductId,
    requestQueryFieldOptions: ["name", "allowedVisibilityGroups", "snRuleIdentifier"],
    requestParams: [params.id]
  }

  const toolBarRender = [
    checkUserCreatePermissions(adminTicketCategoryMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{
      setTitle("ticket.workflow.create.title")
      setSubmitAction("create")
      setAddVisable(true)
    }} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport = {
    status: true,
    fileName: "ticket.workflow.export.fileName",
    sheetName: "ticket.workflow.export.sheetName"
  }

  const TableProps = {
    columns: columns,
    permissionsMenuKeys: adminTicketCategoryMenuKeys,
    fetchParams: fetchParams,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: destroyTicketCategory,
    defaultSize: 'small'
  }

  const handleOnCreate = async (values) => {
    if (values.allowedVisibilityGroups.indexOf("$all") !== -1) {
      values.allowedVisibilityGroups = ""
    } else {
      values.allowedVisibilityGroups = values.allowedVisibilityGroups.join(",")
    }
    values.icon = icon

    if (sn1 === "" || sn2 === "" || sn3 === "" || sn4 === "") {
      message.warning("流水规则有误, 请重新输入!")
      return
    }

    values.snRuleIdentifier = `${sn1}${sn2}${sn3}${sn4}`
    let request: any
    let msg = ""
    switch (submitAction) {
      case "create":
        msg = "ticket.workflow.create.message"
        values.productId = parseInt(params.id)
        request = createTicketCategory(values)
        break
      case "update":
        msg = "ticket.workflow.update.message"
        request = updateTicketCategory(currentRow.id, values)
        break
    }

    const result = await request
    if (result.success) {
      message.success(intl.formatMessage({id: msg}))
      tableRef?.current?.actionRef?.current?.reload?.()
      setAddVisable(false)
      handleOnModalCancel()
    }
  }

  const handleSetIcon = (icon) => {
    setIcon(icon)
  }

  useEffect(() => {
   if (!params.id) {
     history.push('/404')
   }
  }, [])

  const handleOnModalCancel = () => {
    setCurrentRow({})
    setIcon("CameraTwoTone")
    setAddVisable(false)
    setSn1("")
    setSn2("")
    setSn3("")
    setSn4("")
  }

  return  <>
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
          handleOnModalCancel()
        }
      }}
      onFinish={handleOnCreate}
    >
      <ProForm.Item
        name="icon"
        label={intl.formatMessage({id: 'ticket.workflow.icon'})}>
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
        rules={[{ required: true, message: intl.formatMessage({id: 'ticket.workflow.name'}) }]}
        placeholder={intl.formatMessage({id: 'ticket.workflow.name'})}
        label={intl.formatMessage({id: 'ticket.workflow.name'})}
      />

      <ProForm.Item
        name="snRuleIdentifier"
        rules={[{ required: true, message: intl.formatMessage({id: 'ticket.workflow.snRuleIdentifier'}) }]}
        label={intl.formatMessage({id: 'ticket.workflow.snRuleIdentifier'})}>
        <Space>
          <Input disabled={submitAction === "update" } value={sn1} maxLength={1} onChange={(e)=>setSn1(e.target.value)} key={"a"} style={{width: 36}} />
          <Input disabled={submitAction === "update" } value={sn2} maxLength={1} onChange={(e)=>setSn2(e.target.value)} key={"b"} style={{width: 36}} />
          <Input disabled={submitAction === "update" } value={sn3} maxLength={1} onChange={(e)=>setSn3(e.target.value)} key={"c"} style={{width: 36}} />
          <Input disabled={submitAction === "update" } value={sn4} maxLength={1} onChange={(e)=>setSn4(e.target.value)} key={"d"} style={{width: 36}} />
          <span key={"e"}> + </span>
          <span key={"f"}>YYYYMMDD</span>
          <span key={"g"}> + </span>
          <span key={"h"}>6位编号</span>
          <span style={{color: "#e55"}} key="demo">预览: {`${sn1}${sn2}${sn3}${sn4}${moment().format("YYYYMMDD")}000001`}</span>
        </Space>
      </ProForm.Item>
      <ProFormSelect
        name="allowedVisibilityGroups"
        label={intl.formatMessage({id: "ticket.workflow.allowedVisibilityGroups"})}
        rules={[{ required: true, message: intl.formatMessage({id: 'ticket.workflow.allowedVisibilityGroups'}) }]}
        placeholder={intl.formatMessage({id: 'ticket.workflow.allowedVisibilityGroups'})}
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

      <ProFormSelect
        name="layout"
        rules={[{ required: true, message: intl.formatMessage({id: 'ticket.workflow.layout'}) }]}
        placeholder={intl.formatMessage({id: 'ticket.workflow.layout'})}
        label={intl.formatMessage({id: 'ticket.workflow.layout'})}
        request={async () => {
          return [
              {
              label: "vertical",
              value: "vertical"
            },
            {
              label: "inline",
              value: "inline"
            },
            {
              label: "horizontal",
              value: "horizontal"
            }
          ]
        }}
      />
      <ProFormText
        name="webhookURL"
        rules={[{ required: false, message: intl.formatMessage({id: 'ticket.workflow.webhook'}) }]}
        placeholder={intl.formatMessage({id: 'ticket.workflow.webhook'})}
        label={intl.formatMessage({id: 'ticket.workflow.webhook'})}
      />

      <ProFormTextArea
        name="description"
        label={intl.formatMessage({id: "ticket.workflow.description"})}
        rules={[{ required: false, message: intl.formatMessage({id: 'ticket.workflow.description'}) }]}
        placeholder={intl.formatMessage({id: 'ticket.workflow.description'})}
      />
    </ModalForm>

    <IconStoreHouse setIcon={handleSetIcon} ref={iconRef}/>
  </>
}
