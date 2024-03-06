// @ts-ignore
import cookie from 'react-cookies';
import {ParserTime} from '@/util/date'

export const saveCookie = (key: string, value: any, expireTime: string) => {
  let expire = ParserTime(expireTime);
  cookie.save(key, value, { expires: expire, path: "/" });
}

export const deleteCookie = (key: string) => {
  cookie.remove(key, { path: '/' });
}

export const getCookie = (key: string) => {
  return cookie.load(key)
}
