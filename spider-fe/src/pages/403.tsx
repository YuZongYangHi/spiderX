import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const ForbiddenPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you do not have permission to access this page."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back Home
      </Button>
    }
  />
);

export default ForbiddenPage;
