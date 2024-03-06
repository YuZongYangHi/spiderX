import {useIntl, useModel} from "@@/exports";
import React, {useRef, useState} from "react";
import {ProColumns} from "@ant-design/pro-components";
import {IdcAzStatusFilter, regionFilter} from "@/util/dataConvert";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {createIdc, deleteIdc, queryAzList, queryIdcList, updateIdc} from "@/services/Idc/idc";
import {DesignProTable} from "@/components/ProTable/typing";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {Tag} from 'antd'
import {
  checkUserCreatePermissions, checkUserDeletePermissions,
  checkUserUpdatePermissions,
  permissionsIdcIdcMenuKeys
} from "@/access";
import {Button} from "antd";
import ProTable from "@/components/ProTable";
import {clickExtender} from "@/components/Style/style";
import {ProModelCreateFormItems, ProModelUpdateFormItems} from "./forms";
import DesignProModalForm from "@/components/ProModal";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";

export default () => {
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const intl = useIntl();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const proModalUpdateRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const [searchPhysicsName, setPhysicsName] = useState("");
  const [searchVirtualName, setVirtualName] = useState("");
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.name"}),
      dataIndex: "name",
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.cnName"}),
      dataIndex: "cnName",
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.status"}),
      dataIndex: "status",
      valueEnum: IdcAzStatusFilter,
      valueType: "select",
      choices: (value: number) => IdcAzStatusFilter[value].text
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.physicsName"}),
      dataIndex: "physicsAzId",
      choices: (value: number) => {
        const c = tableRef.current.data.filter(item => item.physicsAzId === value)
        return c[0].physicsAz.name
      },
      request: () => {
        const physicsAzRequestParams: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {"filter": `type=1`},
          request: queryAzList
        }

        if (searchVirtualName !== "") {
          physicsAzRequestParams.params["filter"] = `type=1&name=${searchPhysicsName}`
        }
        return RemoteRequestSelectSearch(physicsAzRequestParams)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setPhysicsName(value)
        }
      },
      render: (_, record) => {
        return <Tag color="#2db7f5">{record.physicsAz.name}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.virtualName"}),
      dataIndex: "virtualAzId",
      valueType: 'select',
      choices: (value: number) => {
        const c = tableRef.current.data.filter(item => item.virtualAzId === value)
        return c[0].virtualAz.name
      },
      request: () => {
        const virtualAzRequestParams: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {"filter": `type=2`},
          request: queryAzList
        }

        if (searchVirtualName !== "") {
          virtualAzRequestParams.params["filter"] = `type=2&name=${searchVirtualName}`
        }
        return RemoteRequestSelectSearch(virtualAzRequestParams)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setVirtualName(value)
        }
      },
      render: (_, record) => {
        return <Tag color="#2db7f5">{record.virtualAz.name}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.cabinetNum"}),
      dataIndex: "cabinetNum",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.region"}),
      dataIndex: "region",
      valueEnum: regionFilter,
      valueType: "select"
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.city"}),
      dataIndex: "city",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.address"}),
      dataIndex: "address",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.idcPhone"}),
      dataIndex: "idcPhone",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.idcMail"}),
      dataIndex: "idcMail",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.creator"}),
      dataIndex: "creator",
      hideInSearch: true
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
      title: intl.formatMessage({id: "idc.idc.column.comment"}),
      dataIndex: "comment",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (dom, record) => [
        checkUserUpdatePermissions(permissionsIdcIdcMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="update"
              onClick={()=>{
                setCurrentRow(record)
                proModalUpdateRef.current?.proModalHandleOpen?.(true)
              }
              }
        >
            {intl.formatMessage({id: 'component.operate.edit'})}
        </span>,
        checkUserDeletePermissions(permissionsIdcIdcMenuKeys, userMenuPermissions) &&
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
    fetch:queryIdcList,
    requestQueryFieldOptions: ["name", "cnName", "region", "province", "type", "status", "virtualAzId", "physicsAzId"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue: {
      "comment": {
        show: false
      },
      "idcPhone": {
        show: false
      },
      "idcMail": {
        show: false
      },
    }
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(permissionsIdcIdcMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "idc.batchExport.fileName",
    sheetName: "idc.batchExport.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: permissionsIdcIdcMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    deleteRequest: deleteIdc,
    defaultSize: 'small'
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'idc.idc.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateIdc,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(),
    params: [currentRow && currentRow.id],
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'idc.idc.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createIdc,
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
