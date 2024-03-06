import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "light",
  "colorPrimary": "#13C2C2",
  "layout": "mix",
  "contentWidth": "Fluid",
  "fixedHeader": true,
  "fixSiderbar": true,
  "pwa": true,
  "logo": "/img/spider-logo.jpg",
  "title": "",
  "token": {
    sider: {
      colorMenuBackground: '#fff',
      colorMenuItemDivider: '#13C2C2',
      colorTextMenu: '#595959',
      colorTextMenuSelected: '#13C2C2',
      colorTextMenuItemHover: '#13C2C2',
      colorBgMenuItemSelected: 'rgba(230,243,254,1)',
  },
    header: {
      //colorHeaderTitle: "#fff",
      //colorBgHeader: "#13C2C2",
    }
},
  "splitMenus": false,
  "siderMenuType": "sub"
}

export default Settings;
