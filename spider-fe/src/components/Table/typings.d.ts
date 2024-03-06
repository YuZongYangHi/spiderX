import {ProColumns, SearchConfig} from "@ant-design/pro-components";
import {TablePaginationConfig} from "antd/es/table/interface";
import React from "react";
import {ToolBarProps} from "@ant-design/pro-table/es/components/ToolBar";

declare namespace CommonTable {
  type Params = {
    // 表格相关
    // 表格字段
    columns: ProColumns[];
    // 是否开启搜索
    openSearch: boolean | SearchConfig;
    // 是否开启分页
    openPagination: false | TablePaginationConfig;
    // 记录key，唯一值
    rowKey: "id" | string;
    // 表格大小
    size: "small";
    // 表格渲染的动作
    toolBarRender: ToolBarProps<T>['toolBarRender'] | false;
    // 权限相关
    permissionsMenuKeys: string[];
    // 请求相关
    // 路径参数
    requestParams: string[];
    // 请求定制参数
    requestQuery: Map<string, any>;
    // 可查询的字段过滤
    requestQueryFieldOptions: string[];
    // 请求数据列表
    listRequest: Promise<API.Response<T[]>>;

    operate: Operator ;
  }

  type Operator = {
    delete: DeleteOperator
  }

  type DeleteOperator = {
    title: string;
    content: string;
    successMessage: string;
    errorMessage: string;
    request: Promise<API.Response<null>>;
  }
}
