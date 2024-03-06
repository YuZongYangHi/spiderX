import {request} from "umi";

export type fetchParamsType = {
  requestQueryFieldOptions: string[];
  requestQuery: object;
  requestParams: string[];
  fetch: request<API.Response<any>>;
}
