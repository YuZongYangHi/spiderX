import {fetchParamsType} from './type'

export default async (props: fetchParamsType, params: any, sort: any, filter: any) => {
  // 通用请求参数
  const combinationParams = {
    pageNum: params.current,
    pageSize: params.pageSize,
  };

  Object.keys(filter).forEach(item => {
  if (filter[item]) {
    params[item] = filter[item]
  }
  })

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
    // @ts-ignore
    combinationParams.filter = searchStr.substr(0, searchStr.lastIndexOf('&'));
  }

  if (props.requestQuery && Object.keys(props.requestQuery).length > 0) {
    // eslint-disable-next-line guard-for-in
    for (let key in props.requestQuery) {
      // @ts-ignore
      combinationParams[key] = props.requestQuery[key];
    }
  }

    try {
      let result: Promise<API.Response<any>>;
      if (!props.requestParams || props.requestParams.length === 0) {
        result = await props.fetch(combinationParams);
      } else {
        result = await props.fetch(...props.requestParams, combinationParams);
      }
      return {
        data: result.data.list || [],
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
