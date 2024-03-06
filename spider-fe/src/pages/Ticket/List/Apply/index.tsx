import {fetchParamsType} from "@/util/ProTableRequest/type";
import {queryTicketApplyRecordList, destroyRecord} from "@/services/Ticket/api";
import {DesignProTable} from "@/components/ProTable/typing";
import {ticketApplyList} from "@/access";
import {ColumnsRender} from '../column'
import ProTable from "@/components/ProTable";
import React, {useRef} from "react";

export default () => {
  const tableRef = useRef()
  const columns = ColumnsRender(tableRef);

  const fetchParams: fetchParamsType = {
    fetch: queryTicketApplyRecordList,
    requestQueryFieldOptions: ["sn", "stateId", "categoryId", "status", "creator"],
    requestParams: []
  }

  const batchExport: DesignProTable.batchExportT = {
    status: true,
    fileName: "ticket.record.export.fileName",
    sheetName: "ticket.record.export.sheetName"
  }

  const TableProps: DesignProTable.T = {
    columns: columns,
    permissionsMenuKeys: ticketApplyList,
    fetchParams: fetchParams,
    batchExport: batchExport,
    defaultSize: 'small',
    toolBarRender: [],
    deleteRequest: destroyRecord,
  }

  return (
    <ProTable {...TableProps} ref={tableRef} />
  )
}
