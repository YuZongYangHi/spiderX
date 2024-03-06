import {request} from 'umi';

export const fetch = (url, method, data, params) => {
  return request(url, {
    method,
    data,
    params
  })
}
