import {TablePaginationConfig} from "antd/es/table/interface";
import {ProColumns, SearchConfig} from "@ant-design/pro-components";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";
import {fetchParamsType} from "@/util/ProTableRequest/type";

declare namespace DesignProTable {

  type rowSelectionT = {
    status: boolean;
    handleCustomRowKeys: (selectRowValues: any[]) => any[];
    multiDeleteRequest: any;
    exportFileName: string;
    exportSheetName: string;
  }

  type columnsStateT = {
    defaultValue: object;
    status: boolean;
  }

  type batchExportT = {
    status: boolean;
    fileName: string;
    sheetName: string;
  }

  type batchImportT = {
    status: boolean;
    // 批量导入的请求
    importRequest: any;
    // 导入模版的路径(前端)
    importTemplatePath: string;
  }

  type multiSearchOptionT = {
    field: string;
    label: string;
  }

  type multiSearchT = {
    status: boolean;
    options: multiSearchOptionT[]
  }

  type T = {
    bread: boolean;
    columns: ProColumns[];
    columnsState: columnsStateT;
    defaultSize: "small" | string;
    form: false;
    rowSelection: rowSelectionT;
    tableAlertOptionRender: false | any;
    tableActionRef: any;
    pagination: false | TablePaginationConfig;
    // 权限相关
    permissionsMenuKeys: string[];
    // 是否开启搜索
    openSearch: boolean | SearchConfig;
    // 表格渲染的动作
    toolBarRender: ToolBarProps<T>['toolBarRender'] | [];
    // 获取后端服务列表的通用参数
    fetchParams: fetchParamsType

    // 批量导出
    batchExport: batchExportT;
    // 批量导入
    batchImport: batchImportT;

    // 删除请求
    deleteRequest: any

    // 批量搜索
    multiSearch: multiSearchT;
  }
}
