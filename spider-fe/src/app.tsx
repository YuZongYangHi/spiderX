import Footer from '@/components/Footer';
import { Question } from '@/components/RightContent';
import SelectLang from '@/components/SelectLang'
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { queryUserInfo } from './services/users/api';
import React from 'react';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import {fetchAllMenuKeysList, fetchUserMenuList, fetchUserMenuPermissions} from "@/services/rbac/menu/api";
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  // 当前用户信息
  currentUser?: UserResponse.UserInfo;
  // 当前用户拥有菜单
  userMenuKeys?: RbacMenuResponse.Keys;
  // 所有菜单keys
  allMenuKeys?: RbacMenuResponse.Keys;
  // 用户菜单权限
  userMenuPermissions?: RbacMenuResponse.UserPermissions;
  // 全局加载
  loading?: boolean;
  // 获取用户信息
  fetchUserInfo?: () => Promise<UserResponse.UserInfo | undefined>;
  // 获取用户菜单
  fetchUserMenuKeys?: ()=> Promise<API.Response<RbacMenuResponse.Keys> | undefined>;
  // 获取用户菜单权限
  fetchUserMenuPermissions?:  ()=> Promise<API.Response<RbacMenuResponse.UserPermissions> | undefined>;
  // 获取所有菜单keys
  fetchAllMenuKeys?:  ()=> Promise<API.Response<RbacMenuResponse.Keys> | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryUserInfo();
      return msg.data.list;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    const userMenuKeys = await fetchUserMenuList();
    const userMenuPermissions = await fetchUserMenuPermissions();
    const allMenuKeys = await fetchAllMenuKeysList();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
      userMenuKeys: userMenuKeys.data.list,
      allMenuKeys: allMenuKeys.data.list,
      userMenuPermissions: userMenuPermissions.data.list,
      fetchUserMenuKeys: fetchUserMenuList,
      fetchUserMenuPermissions: fetchUserMenuPermissions,
      fetchAllMenuKeys: fetchAllMenuKeysList
    };
  }
  return {
    fetchUserInfo,
    fetchUserMenuKeys: fetchUserMenuList,
    fetchUserMenuPermissions: fetchUserMenuPermissions,
    fetchAllMenuKeys: fetchAllMenuKeysList,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    //loading: true,
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.photo,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content:  initialState?.currentUser?.email,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    defaultCollapsed: true,
    breakpoint: true,
    childrenRender: (children) => {
      return (
        <>
          {children}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
