import { StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import {useEffect, useState} from 'react';
import {queryIdcSummary} from '@/services/Analysis/api'
import {useIntl} from "umi";

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};

export default () => {
  const intl = useIntl()
  const [responsive, setResponsive] = useState(false);
  const [data, setData] = useState<AnalysisResponse.IdcInfo>({})

  useEffect(() => {
    queryIdcSummary().then(res=> {
      setData(res.data.list)
    })
  }, [])
  return (
    <div style={{marginBottom: 12, marginTop: 12}}>
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
        <StatisticCard
          statistic={{
            title: intl.formatMessage({id: "dashboard.machine.az"}),
            value: data.az,
            icon: (
              <img
                style={imgStyle}
                src="/img/region.svg"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: intl.formatMessage({id: "dashboard.machine.idc"}),
            value: data.idc,
            icon: (
              <img
                style={imgStyle}
                src="/img/machine.svg"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: intl.formatMessage({id: "dashboard.machine.room"}),
            value: data.room,
            icon: (
              <img
                style={imgStyle}
                src="/img/room.svg"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: intl.formatMessage({id: "dashboard.machine.rack"}),
            value: data.rack,
            icon: (
              <img
                style={imgStyle}
                src="/img/rack.svg"
                alt="icon"
              />
            ),
          }}
        />
      </StatisticCard.Group>
    </RcResizeObserver>
    </div>
  );
};
