import {PageContainer} from '@ant-design/pro-components';
import {Spin, Space, Alert, Calendar, Badge, message, Flex} from 'antd';
import React, {useEffect, useRef, useState} from "react";
import {useIntl} from "umi";
import dayjs, {Dayjs} from "dayjs";
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
import {queryOnCallList, exchangeOnCall} from '@/services/OnCall/api'
import {CalendarMode} from "antd/lib/calendar/generateCalendar";
import Loading from "@/components/Loading";
import {ClockCircleTwoTone} from '@ant-design/icons'
import {ExchangeFormItems} from './form'
import DesignProModalForm from "@/components/ProModal";
import {useModel} from "@@/exports";

export default () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [currentSelectedMonthFormat, setCurrentSelectedMonthFormat] = useState(dayjs().format('YYYY-MM'))
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const [currentOnCallUser, setCurrentOnCallUser] = useState("");
  const [onCallList, setOnCallList] = useState<OnCallResponse.OnCallInfo[]>([]);
  const [currentRow, setCurrentRow] = useState<OnCallResponse.OnCallInfo>({})
  const proModalCreateRef = useRef(null);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const getOnCallDutyTypeText = (text: string) => {
    let localeText = ""
    switch (text) {
      case "weekly":
        localeText = "dashboard.onCall.type.week"
        break;
      case "daily":
        localeText = "dashboard.onCall.type.day"
        break;
    }
    return localeText
  }
  const fetch = async (month: string) => {
    setLoading(true)
    const result = await queryOnCallList(month)
    if (!result.success) {
      message.error(result.errorMessage)
      setLoading(false)
      return
    }
    const current = result.data.list.filter(item => item.datetime === dayjs().format('YYYY-MM-DD'))
    current && current.length > 0 && setCurrentOnCallUser(current[0].currentUser)
    setOnCallList(result.data.list)
    setCurrentSelectedMonthFormat(month)
    setLoading(false)
  }

  const onPanelChange = async (value: Dayjs, mode: CalendarMode) => {
    return await fetch(value.format("YYYY-MM"))
  };

  const getItemByDatetime = (value: string) => {
    const items = onCallList.filter(item => value === item.datetime)
    if (items.length === 0) {
      return []
    }
    const current = items[0]
    const data = [
      {
        scheduleType: current.schedulingType,
        type: "success",
        username: current.currentUser
      }
    ]

    if (current.historyUser !== "") {
      data.push({
        scheduleType: current.schedulingType,
        type: "warning",
        username: current.historyUser
      })
    }
    return data
  }

  const getText = (item) => {
    if (item.type === "warning") {
      return <del>{item.username}</del>
    } else if (item.type === "success") {
      return item.username
    }
  }

  const dateCellRender = (current: Dayjs) => {
    const currentDate = current.format("YYYY-MM-DD")
    if (onCallList.length > 0) {
      if (currentDate === onCallList[onCallList.length - 1].datetime) {
        setLoading(false)
      }
    }
    const data = getItemByDatetime(currentDate)
    return (
        <Flex vertical align="flex-start">
            {data.map((item: any, index) => (
              <Badge key={index} status={item.type} text={getText(item)} />
            ))}
          {
            data.length > 0 &&
            <Space>
              <ClockCircleTwoTone />
              <span>{intl.formatMessage({id: getOnCallDutyTypeText(data.length > 0 && data[0].scheduleType) || "daily"})}</span>
            </Space>
          }
        </Flex>
    )
  }

  useEffect( ()=>{
    (async function init() {
      setSelectedValue(dayjs())
      await fetch(dayjs().format("YYYY-MM"))
    })()
  }, [])

  const disabledDate = (currentDate: Dayjs):boolean => {
    const today = dayjs();
    return currentDate.isBefore(today);
  }

  const onSelect = (newValue: Dayjs, info) => {
    setCurrentSelectedMonthFormat(newValue.format("YYYY-MM"))
    if (info.source === "date" && currentUser && currentUser.isAdmin) {
      setLoading(true)
      const rows = onCallList.filter(item=> item.datetime === newValue.format("YYYY-MM-DD"))
      setCurrentRow(rows[0])
      proModalCreateRef.current?.proModalHandleOpen?.(true)
      setLoading(false)
    } else {
      setSelectedValue(newValue);
    }
  };

  const handleOnUpdateCancel = async () => {
    await fetch(currentSelectedMonthFormat)
    setCurrentRow({})
  }

  const ProModalCreateParams: ProModal.Params = {
    title: 'dashboard.onCall.form.title',
    width: "510px",
    // @ts-ignore
    params: [],
    initialValues: currentRow,
    formItems: ExchangeFormItems(),
    handleOnCancel :handleOnUpdateCancel,
    // @ts-ignore
    request: exchangeOnCall,
    successMessage: 'component.form.create.success',
    errorMessage: 'component.form.create.fail'
  }

  return (
    <PageContainer title={false}>
      <div
        style={{
          backgroundPosition: '100% -30%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '274px auto',
          backgroundImage:
            "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
        }}
      >
        <Spin tip="Loading..." spinning={loading}>
          <Alert message={<>
            <Space  direction="vertical">
              <span>{intl.formatMessage({id: 'dashboard.onCall.today.username'})}: {currentOnCallUser}</span>
              <span>{intl.formatMessage({id: 'dashboard.onCall.today.datetime'})}: {dayjs().format("YYYY-MM-DD")}</span>
            </Space>
          </>}/>
        </Spin>
        <div style={{marginTop: 12}}>
          {loading ? <Loading/> :
            <Calendar
              value={selectedValue}
              onSelect={onSelect}
              onPanelChange={async (value, mode) => {await onPanelChange(value, mode)}}
              cellRender={dateCellRender}
              mode="month"
              disabledDate={disabledDate}
              validRange={[dayjs().subtract(2, 'year').startOf('year'), dayjs().add(1, 'year').endOf('year')]}
            />
          }
        </div>
      </div>

      <DesignProModalForm
        {...ProModalCreateParams}
        ref={proModalCreateRef}
      />
    </PageContainer>
  )
}
