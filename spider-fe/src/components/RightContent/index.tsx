import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://github.com/YuZongYangHi/spiderX');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};
