import {PageContainer} from '@ant-design/pro-components';
import {useState} from "react";
import {useIntl} from 'umi'
import * as React from "react";
import Group from './Group'
import User from './User'

export default () => {
  const intl = useIntl();
  const [tabKey, setTabKey] = useState("group")

  return (
    <div>
      <PageContainer
        tabActiveKey={tabKey}
        tabList={[
          {
            tab: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.tab.group'}),
            key: 'group',
            children: <Group/>
          },
          {
            tab: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.tab.user'}),
            key:  'user',
            children: <User/>
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
