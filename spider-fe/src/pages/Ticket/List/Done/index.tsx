import {fetchParamsType} from "@/util/ProTableRequest/type";
import {queryTicketDoneRecordList, destroyRecord} from "@/services/Ticket/api";
import {DesignProTable} from "@/components/ProTable/typing";
import {ticketDoneList} from "@/access";
import {ColumnsRender} from '../column'
import ProTable from "@/components/ProTable";
import React, {useRef} from "react";

export default () => {
  const tableRef = useRef()
  const columns = ColumnsRender(tableRef);

  const fetchParams: fetchParamsType = {
    fetch: queryTicketDoneRecordList,
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
    permissionsMenuKeys: ticketDoneList,
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
