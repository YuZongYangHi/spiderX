import {getIntl, getLocale} from "umi";
import {ProFormDateTimePicker, ProFormSelect} from "@ant-design/pro-components";
import {queryUserList} from "@/services/users/api";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";
import dayjs, {Dayjs} from "dayjs";

const intl = getIntl(getLocale());
const dutyTypeOption = [
  {
    label: "daily",
    value: "daily"
  },
  {
    label: "weekly",
    value: "weekly"
  },
]

export const CreateFormItemFunc = () => {
  return [
    {
      name: "userIds",
      label: intl.formatMessage({id: 'admin.onCall.column.userIds'}),
      placeholder: intl.formatMessage({id: 'admin.onCall.column.userIds'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        mode: "multiple",
        fieldProps: {
          showSearch: true,
          allowClear: true,
        },
        convertValue: (value: any) => {
          if (!value) {
            return
          }
          return typeof value === "string" ? value.split(",").map(Number) : value.map((x: any) => x.id ? x.id : x)
        },
        transform: (value: any) => {
          return {
            userIds: typeof value === "string" ? value : value.join(",")
          }
        },
        dependencies: ["userIds"],
        request: async (params) => {
          const requestParams: handlerRequest.RemoteSelectSearchParams = {
            option: {
              label: "username",
              value: "id"
            },
            params: {},
            request: queryUserList
          }

          if (params.keyWords) {
            requestParams.params.filter = `username=${params.keyWords}`
          }
          else if (params.userIds) {
            requestParams.params.filter = `userIds=${params.userIds}`
          }
          return await RemoteRequestSelectSearch(requestParams)
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'admin.onCall.column.userIds'})
      }
    },
    {
      name: "dutyType",
      label: intl.formatMessage({id: 'admin.onCall.column.dutyType'}),
      placeholder: intl.formatMessage({id: 'admin.onCall.column.dutyType'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => dutyTypeOption,
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'admin.onCall.column.dutyType'})
      }
    },
    {
      name: "effectiveTime",
      label: intl.formatMessage({id: 'admin.onCall.column.effectiveTime'}),
      placeholder: intl.formatMessage({id: 'admin.onCall.column.effectiveTime'}),
      component: ProFormDateTimePicker,
      width: "xl",
      options: {
        fieldProps: {
          disabledDate: (current: Dayjs) => current && current < dayjs().endOf('day'),
        },
        transform: (value: any) => {
          return {
            effectiveTime: dayjs(value).format("YYYY-MM-DD") + " 00:00:00"
          }
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'admin.onCall.column.effectiveTime'})
      }
    }
  ]
}

export  const UpdateFormItemFunc = () => {
  const items = CreateFormItemFunc()
  items[2].options.disabled = true
  return items
}
