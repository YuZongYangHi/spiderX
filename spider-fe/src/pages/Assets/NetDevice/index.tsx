import {PageContainer} from '@ant-design/pro-components';
import {useState} from "react";
import {useIntl} from 'umi'
import SwitchComponent from './Switch'
import RouterComponent from './Router'

export default () => {
  const intl = useIntl();
  const [tabKey, setTabKey] = useState("switch")

  return (
    <div>
      <PageContainer
        title={false}
        tabActiveKey={tabKey}
        tabList={[
          {
            tab: intl.formatMessage({id: 'assets.netDevice.tab.switch'}),
            key: 'switch',
            children: <SwitchComponent/>
          },
          {
            tab: intl.formatMessage({id: 'assets.netDevice.tab.router'}),
            key:  'router',
            children: <RouterComponent/>
          },
        ]}
        tabProps={{
          size: "small",
          tabBarStyle: {
            background: "#fff",
            padding: "8px 8px 16px 24px",
            marginRight: 40,
            marginLeft: 40,
            borderRadius: "6px",
            marginBottom: -5,
          }
        }}
        onTabChange={(key: string)=> setTabKey(key)}
        header={{title: false}}
      >
      </PageContainer>
    </div>
  )
}
