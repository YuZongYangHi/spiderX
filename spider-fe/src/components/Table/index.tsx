import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {ProTable} from "@ant-design/pro-table";
import {CommonTable} from "@/components/Table/typings";
import {ActionType} from "@ant-design/pro-components";
import {Access, useAccess, useIntl, useModel} from 'umi';
import {checkUserHavePageReadPermissions} from "@/access";
import ForbiddenPage from "@/pages/403";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {message, Modal} from "antd";

const { confirm } = Modal;

export default forwardRef((props: CommonTable.Params, ref)=>{
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const [data, setData] = useState([]);
  const intl = useIntl()

  const asyncTableSearchRequest = async (params: any, sort: any, filter: any) => {
    // 通用请求参数
    const combinationParams = {
      pageNum: params.current,
      pageSize: params.pageSize,
    };

    // 查询参数
    const searchParams = {};
    for (let key in params) {
      // @ts-ignore
      if (props.requestQueryFieldOptions && props.requestQueryFieldOptions.indexOf(key) === -1) {
        continue;
      }
      // @ts-ignore
      searchParams[key] = params[key];
    }
    if (Object.keys(searchParams).length > 0) {
      // 声明查询条件
      // 用于后端搜索使用
      let searchStr = '';

      // 循环遍历字符串
      // eslint-disable-next-line guard-for-in
      for (let key in searchParams) {
        // @ts-ignore
        searchStr += `${key}=${searchParams[key]}&`;
      }

      if (props.requestQuery && Object.keys(props.requestQuery).length > 0) {
        // eslint-disable-next-line guard-for-in
        for (let key in props.requestQuery) {
          // @ts-ignore
          searchStr += `${key}=${props.requestQuery[key]},`;
        }
      }
      // @ts-ignore
      combinationParams.filter = searchStr.substr(0, searchStr.lastIndexOf('&'));
    }
    try {
      let result: Promise<API.Response<any>>;
      if (props.requestParams.length === 0) {
        result = await props.listRequest(combinationParams);
      } else {
        result = await props.listRequest(...props.requestParams, combinationParams);
      }
      setData(result.data.list? result.data.list : [] )
      return {
        data: result.data.list,
        // success 请返回 true，
        // 不然 table 会停止解析数据，即使有数据
        success: result.success,
        // 不传会使用 data 的长度，如果是分页一定要传
        total: result.data.total,
      };
    }catch (err) {
      console.log("request error: ", err)
      return {}
    }
  };

  const deleteAction = (...params: any) => {
    confirm({
      title: intl.formatMessage({id: props.operate?.delete?.title}),
      icon: <ExclamationCircleFilled />,
      content: intl.formatMessage({id: props.operate?.delete?.content}),
      onOk() {
        return props.operate.delete.request(...params).then((res=>{
          message.success(intl.formatMessage({id: props.operate.delete.successMessage}))
          actionRef.current?.reload()
        })).catch(err=>{
          message.error(intl.formatMessage({id: props.operate.delete.errorMessage}))
          console.log(err)
        })
      },
      onCancel() {},
    });
  };

  useImperativeHandle(ref, () => {
    return {
      actionRef,
      data: data,
      deleteAction
    };
  }, []);
  return (
    <Access
      accessible={checkUserHavePageReadPermissions(props.permissionsMenuKeys, access, userMenuPermissions)}
      fallback={<ForbiddenPage/>}>
      <ProTable
        cardBordered
        columns={props.columns}
        actionRef={actionRef}
        rowKey={props.rowKey}
        size={props.size}
        search={props.openSearch}
        pagination={props.openPagination}
        request={asyncTableSearchRequest}
        toolBarRender={() => [
          props.toolBarRender && props.toolBarRender || []
        ]}
      />
    </Access>
  )
})
