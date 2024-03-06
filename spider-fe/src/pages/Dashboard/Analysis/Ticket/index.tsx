import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import {queryTicketSummary} from '@/services/Analysis/api'
import {LargeTitle} from '@/components/CustonizeTitle'
import {useIntl} from "@@/exports";

export default  () => {
  const intl = useIntl()
  const [data, setData] = useState<AnalysisResponse.TicketInfo[]>([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = async () => {
    const result = await queryTicketSummary();
    if (result.success) {
      setData(result.data.list)
    }
  };
  const config = {
    data,
    padding: 'auto',
    xField: 'datetime',
    yField: 'count',
    xAxis: {
      tickCount: 5,
    },
  };
  return <div style={{
    background: '#FFFFFF',
    marginTop: 14,
    padding: 45.5,
    marginBottom: 24
  }}>
      <LargeTitle title={intl.formatMessage({id: "dashboard.machine.ticket.title"})}/>
    <Line {...config} />
  </div>
};
