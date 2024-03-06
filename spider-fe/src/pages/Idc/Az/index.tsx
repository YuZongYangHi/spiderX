import ProTable from '@/components/ProTable'
import {
  permissionsIdcAzMenuKeys,
  checkUserCreatePermissions,
  checkUserDeletePermissions, checkUserUpdatePermissions
} from '@/access'
import {ProColumns} from "@ant-design/pro-components";
import {useIntl} from "umi";
import {Button, Tag} from 'antd'
import {
  queryAzList, multiDeleteAz, multiImportAz,
  deleteAz, updateAz, createAz
} from '@/services/Idc/idc'
import DesignProModalForm from '@/components/ProModal'
import {ProModelCreateFormItems, ProModelUpdateFormItems} from './form'
import {DesignProTable} from "@/components/ProTable/typing";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {
  IdcAzTypeFilter, IdcAzStatusFilter, provinceHandleFilter, regionFilter
} from '@/util/dataConvert'
import React, {useRef, useState} from "react";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {useModel} from "@@/exports";
import {clickExtender} from "@/components/Style/style";

const provinceFilter = provinceHandleFilter()

export default () => {
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const intl = useIntl();
  const tableRef = useRef();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const proModalUpdateRef = useRef(null);
  const proModalCreateRef = useRef(null);
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "idc.column.id"}),
      dataIndex: "id",
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.column.name"}),
      dataIndex: "name",
    },
    {
      title: intl.formatMessage({id: "idc.column.cnName"}),
      dataIndex: "cnName",
    },
    {
      title: intl.formatMessage({id: "idc.column.region"}),
      dataIndex: "region",
      valueType: 'select',
      valueEnum: regionFilter
    },
    {
      title: intl.formatMessage({id: "idc.column.province"}),
      dataIndex: "province",
      valueType: 'select',
      valueEnum: provinceFilter,
    },
    {
      title: intl.formatMessage({id: "idc.column.type"}),
      dataIndex: "type",
      valueType: 'select',
      valueEnum: IdcAzTypeFilter,
      choices: (value: number) => {return IdcAzTypeFilter[value].text},
      render: (_, record) => {
        return <Tag color={IdcAzTypeFilter[record.type].color}>{IdcAzTypeFilter[record.type].text}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: "idc.column.status"}),
      dataIndex: "status",
      valueType: 'select',
      choices: (value: number) => {return IdcAzStatusFilter[value].text},
      valueEnum: IdcAzStatusFilter
    },
    {
      title: intl.formatMessage({id: "idc.column.creator"}),
      dataIndex: "creator",
    }, {
      title: intl.formatMessage({id: "idc.column.createTime"}),
      dataIndex: "createTime",
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "idc.column.updateTime"}),
      dataIndex: "updateTime",
      valueType: 'dateTime',
      hideInSearch: true
    }, {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      render: (dom, record) => [
        checkUserUpdatePermissions(permissionsIdcAzMenuKeys, userMenuPermissions) &&
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
        checkUserDeletePermissions(permissionsIdcAzMenuKeys, userMenuPermissions) &&
        <span style={clickExtender}
              key="delete"
              onClick={()=>{tableRef.current?.deleteAction(record.id)}}
        >
            {intl.formatMessage({id: 'component.operate.delete'})}
        </span>,
      ]
    }
  ]

  const handleCustomRowKeys = (selectRowValues: any[]) => {
    return selectRowValues.map(item => item.id)
  }

  const handleOnUpdateCancel = () => {
    tableRef?.current?.actionRef?.current?.reload?.()
    setCurrentRow({});
  }

  const fetchParams: fetchParamsType = {
    fetch:queryAzList,
    requestQueryFieldOptions: ["name", "cnName", "region", "province", "type", "status"],
    requestParams: []
  }

  const columnsState: DesignProTable.columnsStateT = {
    status: true,
    defaultValue: {
      "name": {
        show: true
      }
    }
  }

  const rowSelection: DesignProTable.rowSelectionT = {
    status: true,
    handleCustomRowKeys: handleCustomRowKeys,
    multiDeleteRequest: multiDeleteAz,
    exportFileName: "idc.rowSelection.export.fileName",
    exportSheetName: "idc.rowSelection.export.sheetName"
  }

  const toolBarRender: ToolBarProps<any>['toolBarRender'] = [
    checkUserCreatePermissions(permissionsIdcAzMenuKeys, userMenuPermissions) && <Button type='primary' onClick={()=>{proModalCreateRef.current?.proModalHandleOpen?.(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
  ]

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "idc.rowSelection.export.fileName",
    sheetName: "idc.rowSelection.export.sheetName"
  }

  const batchImport: DesignProTable.batchImportT = {
    status: false,
    importRequest: multiImportAz,
    importTemplatePath: "/files/spider-idc-az-import-template.txt"
  }

  const multiSearchOption: DesignProTable.multiSearchOptionT[] = [
    {
      field: "multiSearchName",
      label: "idc.column.name"
    },
    {
      field: "multiSearchCnName",
      label: "idc.column.cnName"
    }
  ]
  const multiSearch: DesignProTable.multiSearchT = {
    status: true,
    options: multiSearchOption
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: permissionsIdcAzMenuKeys,
    fetchParams: fetchParams,
    columnsState: columnsState,
    defaultSize: 'small',
    rowSelection: rowSelection,
    toolBarRender: toolBarRender,
    batchExport: batchExport,
    batchImport: batchImport,
    deleteRequest: deleteAz,
    multiSearch
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'idc.update.title',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: updateAz,
    initialValues: currentRow,
    formItems: ProModelUpdateFormItems(),
    params: [currentRow && currentRow.id],
    successMessage: 'idc.update.success',
    errorMessage: 'idc.update.error'
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'idc.create.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: {},
    formItems: ProModelCreateFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: createAz,
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
