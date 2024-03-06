import {ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {getIntl, getLocale} from "@@/exports";
import {queryUserList} from "@/services/users/api";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";

const intl = getIntl(getLocale());
export const ExchangeFormItems = () => {
  return [
    {
      name: "currentUser",
      label: intl.formatMessage({id: 'dashboard.onCall.form.currentUsername'}),
      placeholder: intl.formatMessage({id: 'dashboard.onCall.form.currentUsername'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        fieldProps: {
          allowClear: true,
          showSearch: true,
        },
        dependencies: ["currentUser"],
        request: async (params) => {
          const requestParams: handlerRequest.RemoteSelectSearchParams = {
            option: {
              label: "username",
              value: "username"
            },
            params: {},
            request: queryUserList
          }

          if (params.keyWords) {
            requestParams.params.filter = `username=${params.keyWords}`
          }
          else if (params.currentUser) {
            requestParams.params.filter = `username=${params.currentUser}`
          }
          return await RemoteRequestSelectSearch(requestParams)
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'dashboard.onCall.form.currentUsername'})
      }
    },
    {
      name: "historyUser",
      label: intl.formatMessage({id: 'dashboard.onCall.form.historyUsername'}),
      placeholder: intl.formatMessage({id: 'dashboard.onCall.form.historyUsername'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        fieldProps: {
          showSearch: true,
          allowClear: true,
        },
        dependencies: ["historyUser"],
        request: async (params) => {
          const requestParams: handlerRequest.RemoteSelectSearchParams = {
            option: {
              label: "username",
              value: "username"
            },
            params: {},
            request: queryUserList
          }

          if (params.keyWords) {
            requestParams.params.filter = `username=${params.keyWords}`
          }
          else if (params.historyUser) {
            requestParams.params.filter = `username=${params.historyUser}`
          }
          return await RemoteRequestSelectSearch(requestParams)
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'dashboard.onCall.form.historyUsername'})
      }
    },
    {
      name: "datetime",
      label: intl.formatMessage({id: 'dashboard.onCall.form.datetime'}),
      placeholder: intl.formatMessage({id: 'dashboard.onCall.form.datetime'}),
      component: ProFormText,
      width: "xl",
      options: {
        disabled: true
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'dashboard.onCall.form.datetime'})
      }
    }
    ]
}
