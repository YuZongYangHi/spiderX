import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pages from './zh-CN/pages';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import nodePage from './zh-CN/nodePage'
import hostPage from './zh-CN/hostPage'
import idc from './zh-CN/idc'
import audit from './zh-CN/audit'
import ticket from './zh-CN/ticket'
import ip from './zh-CN/ip'
import netDevice from './zh-CN/netDevice'
import onCall from './zh-CN/onCall'
import dashboard from './zh-CN/dashboard'

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.copyright.produced': 'SpiderX 一站式运维管理平台',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...nodePage,
  ...hostPage,
  ...idc,
  ...audit,
  ...ticket,
  ...ip,
  ...netDevice,
  ...onCall,
  ...dashboard
};
