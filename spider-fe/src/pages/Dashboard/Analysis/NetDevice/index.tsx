import { StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import {useEffect, useState} from 'react';
import {queryNetSwitchSummary} from '@/services/Analysis/api'
import {useIntl} from "umi";

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};

export default () => {
  const intl = useIntl()
  const [responsive, setResponsive] = useState(false);
  const [data, setData] = useState<AnalysisResponse.NetDeviceInfo>({})

  useEffect(() => {
    queryNetSwitchSummary().then(res=> {
      setData(res.data.list)
    })
  }, [])
  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
        <StatisticCard
          statistic={{
            title: intl.formatMessage({id: "dashboard.machine.switch"}),
            value: data.switch,
            icon: (
              <img
                style={imgStyle}
                src="/img/switch.svg"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: intl.formatMessage({id: "dashboard.machine.router"}),
            value: data.router,
            icon: (
              <img
                style={imgStyle}
                src="/img/router.svg"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: intl.formatMessage({id: "dashboard.machine.cidr"}),
            value: data.cidr,
            icon: (
              <img
                style={imgStyle}
                src="/img/cidr.svg"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: intl.formatMessage({id: "dashboard.machine.ip"}),
            value: data.ip,
            icon: (
              <img
                style={imgStyle}
                src="/img/ip.svg"
                alt="icon"
              />
            ),
          }}
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  );
};
