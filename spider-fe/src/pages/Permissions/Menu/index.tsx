import {PageContainer} from '@ant-design/pro-components';
import {useState} from "react";
import {useIntl} from 'umi'
import MenuListComponent from './List'
import MenuRoleComponent from './Role'
import * as React from "react";

export default () => {
  const intl = useIntl();
  const [tabKey, setTabKey] = useState("menuList")

  return (
  <div>
    <PageContainer
      tabActiveKey={tabKey}
      tabList={[
        {
          tab: intl.formatMessage({id: 'pages.permissions.menu.tab.list'}),
          key: 'menuList',
          children: <MenuListComponent/>
        },
        {
          tab: intl.formatMessage({id: 'pages.permissions.menu.tab.role'}),
          key:  'roleManager',
          children: <MenuRoleComponent/>
        },
      ]}
      tabProps={{
        size: "small",
        tabBarStyle: {
          background: "#fff",
          padding: "8px 8px 16px 24px",
          border: "1px solid rgba(5, 5, 5, 0.06)",
          borderRadius: 6
        }
      }}
      onTabChange={(key: string)=> setTabKey(key)}
      header={{title: false}}
    >
    </PageContainer>
  </div>
  )
}
