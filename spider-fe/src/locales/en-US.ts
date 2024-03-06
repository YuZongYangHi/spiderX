import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pages from './en-US/pages';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import nodePage from './en-US/nodePage'
import hostPage from './en-US/hostPage'
import idc from './en-US/idc'
import audit from './en-US/audit'
import ticket from './en-US/ticket'
import ip from './en-US/ip'
import netDevice from './en-US/netDevice'
import onCall from './en-US/onCall'
import dashboard from './en-US/dashboard'

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.copyright.produced': 'SpiderX one-stop operation and maintenance management platform',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
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
