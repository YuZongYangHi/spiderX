import {PageContainer} from '@ant-design/pro-components';
import {useState} from "react";
import {useIntl} from 'umi'
import NodeState from './NodeState'
import NodeTransition from './NodeTransition'
import WorkflowForm from './WorkflowForm'
import WorkflowHelper from './WorkflowHelper'

export default () => {
  const intl = useIntl();
  const [tabKey, setTabKey] = useState("helper")

  return (
    <div>
      <PageContainer
        title={false}
        tabActiveKey={tabKey}
        tabList={[
          {
            tab: intl.formatMessage({id: 'ticket.workflow.helper.page.name'}),
            key: 'helper',
            children: <WorkflowHelper/>
          },
          {
            tab: intl.formatMessage({id: 'ticket.workflow.form.page.name'}),
            key:  'form',
            children: <WorkflowForm/>
          },
          {
            tab: intl.formatMessage({id: 'ticket.workflow.state.page.name'}),
            key: 'state',
            children: tabKey === "state" && <NodeState/> || <></>
          },
          {
            tab: intl.formatMessage({id: 'ticket.workflow.transition.page.name'}),
            key:  'transition',
            children: tabKey === "transition" && <NodeTransition/> || <></>
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
