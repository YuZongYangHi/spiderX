import React from 'react';
import {ProCard, PageContainer} from '@ant-design/pro-components'
import ServiceTree from './Tree'
import routeList from './routes'
import {useRoutes} from 'react-router-dom'

const App: React.FC = () => {
  const element = useRoutes(routeList);
  return (
    <PageContainer ghost title={false}>
    <ProCard ghost gutter={72}>
      <ServiceTree/>
      <ProCard ghost style={{borderRadius: 6}}>
      {element}
      </ProCard>
    </ProCard>
    </PageContainer>
  )
};

export default App;
