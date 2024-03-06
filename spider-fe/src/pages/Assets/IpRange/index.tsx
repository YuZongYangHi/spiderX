import {useIntl, useModel} from "@@/exports";
import React, {useRef, useState} from "react";
import {ColumnsState, ProColumns} from "@ant-design/pro-components";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  queryIpRangeList,
  createIpRange,
  updateIpRange,
  deleteIpRange,
} from "@/services/Assets/IpRange/api";
import {queryNodeList} from '@/services/Assets/Node/api'
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  assetsIpRangePermissionsMenuKeys
} from "@/access";
import {Button, Tag} from "antd";
import ProTable from "@/components/ProTable";
import {clickExtender} from "@/components/Style/style";
import {ProModelCreateFormItems, ProModelUpdateFormItems} from "./form";
import DesignProModalForm from "@/components/ProModal";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";
import ColumnConvert from '@/util/ProTableColumnConvert'
import {nodeOperatorFilter} from "@/util/dataConvert";

export default () => {
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const proModalUpdateRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const [searchNode, setSearchNode] = useState("");
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "assets.ip.range.column.cidr"}),
      dataIndex: "cidr",
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.gateway"}),
      dataIndex: "gateway",
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.nodeName"}),
      dataIndex: "nodeId",
      valueType: 'select',
      choices: (value: number, record: any) => {return record.node.name},
      request: () => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: queryNodeList
        }

        if (searchNode !== "") {
          params.params["filter"] = `name=${searchNode}`
        }
        return RemoteRequestSelectSearch(params)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setSearchNode(value)
        }
      },
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.ipCount"}),
      dataIndex: "ipCount",
      hideInSearch: true,
      choices: (value: number, record: any) => record.ip.length,
      render: (_, record) => {
        return record.ip.length;
      }
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.env"}),
      dataIndex: "env",
      valueType: 'select',
      valueEnum: ColumnConvert["assets.ip.env"],
      choices: (value: number, record: any) => ColumnConvert["assets.ip.env"][record.env].text,
      render: (_, record) => <Tag color={ColumnConvert["assets.ip.env"][record.env].color}>{ColumnConvert["assets.ip.env"][record.env].text}</Tag>
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.type"}),
      dataIndex: "type",
      valueType: 'select',
      valueEnum: ColumnConvert["assets.ip.type"],
      choices: (value: number, record: any) => ColumnConvert["assets.ip.type"][record.type].text,
      render: (_, record) => <Tag color={ColumnConvert["assets.ip.type"][record.type].color}>{ColumnConvert["assets.ip.type"][record.type].text}</Tag>
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.version"}),
      dataIndex: "version",
      valueType: 'select',
      valueEnum: ColumnConvert["assets.ip.version"],
      choices: (value: number, record: any) => ColumnConvert["assets.ip.version"][record.version].text,
      render: (_, record) => <Tag color={ColumnConvert["assets.ip.version"][record.version].color}>{ColumnConvert["assets.ip.version"][record.version].text}</Tag>
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.operator"}),
      dataIndex: "operator",
      valueType: 'select',
      choices: (value: number, record: any) => nodeOperatorFilter[record.operator].text,
      valueEnum: nodeOperatorFilter
    },

    {
      title: intl.formatMessage({id: "assets.ip.column.status"}),
      dataIndex: "status",
      valueType: 'select',
      valueEnum: ColumnConvert["assets.ip.status"],
      choices: (value: number, record: any) => ColumnConvert["assets.ip.status"][record.status].text,
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.creator"}),
      dataIndex: "creator",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "assets.ip.column.description"}),
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
        checkUserUpdatePermissions(assetsIpRangePermissionsMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                const value = record
                setCurrentRow(value)
                proModalUpdateRef.current?.proModalHandleOpen?.(true)}}
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(assetsIpRangePermissionsMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{tableRef.current?.deleteAction(record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]
  const handleOnUpdateCancel = () => {
    tableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const fetchParams: fetchParamsType = {
    fetch: queryIpRangeList,
    requestQueryFieldOptions: ["cidr", "env", "version", "status", "operator", "nodeId"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue:  {description: {show: false}}
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(assetsIpRangePermissionsMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "assets.ip.range.export.filename",
    sheetName: "assets.ip.range.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: assetsIpRangePermissionsMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: deleteIpRange,
    defaultSize: 'small'
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'assets.ip.range.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateIpRange,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'assets.ip.range.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createIpRange,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail'
  }

  return (
    <>
      <ProTable {...TableProps} ref={tableRef} />
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
