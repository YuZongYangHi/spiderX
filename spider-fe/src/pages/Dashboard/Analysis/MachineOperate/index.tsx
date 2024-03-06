import { StatisticCard } from '@ant-design/pro-components';
import {useIntl} from "umi";
import {queryMachineSummary} from '@/services/Analysis/api'
import {useEffect, useState} from "react";

const { Operation } = StatisticCard;

export default () => {
  const intl = useIntl()
  const [data, setData] = useState<AnalysisResponse.MachineInfo>({})

  useEffect(() => {
    queryMachineSummary().then(res=>{
      setData(res.data.list)
    })
  }, [])

  return (
    <div style={{marginBottom: 12, marginTop: 12}}>
    <StatisticCard.Group>
      <StatisticCard
        statistic={{
          title: intl.formatMessage({id: 'dashboard.machine.count'}),
          value: data.all,
        }}
      />
      <Operation>=</Operation>
      <StatisticCard
        statistic={{
          title: intl.formatMessage({id: 'dashboard.machine.init'}),
          value: data.init,
          status: 'default',
        }}
      />
      <Operation>+</Operation>
      <StatisticCard
        statistic={{
          title: intl.formatMessage({id: 'dashboard.machine.maintain'}),
          value: data.maintain,
          status: 'warning',
        }}
      />
      <Operation>+</Operation>
      <StatisticCard
        statistic={{
          title: intl.formatMessage({id: 'dashboard.machine.onLine'}),
          value: data.online,
          status: 'success',
        }}
      />
    </StatisticCard.Group>
    </div>
  );
};
