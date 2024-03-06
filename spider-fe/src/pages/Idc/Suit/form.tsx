import { getIntl, getLocale } from 'umi';
import {ProFormText, ProFormSelect} from "@ant-design/pro-components";
import {useState} from "react";
import {queryIdcSuitSeasonList, queryIdcSuitTypeList} from "@/services/Idc/idc";
const intl = getIntl(getLocale());

export const ProModelCreateFormItems = () => {
  const [suitSeasonName, setSuitSeasonName] = useState("");
  const [suitTypeName, setSuitTypeName] = useState("");
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'idc.suit.column.name'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.suit.column.name'})
      }
    }, {
      name: "season",
      label: intl.formatMessage({id: 'idc.suit.column.season'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.season'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (suitSeasonName !== "") {
            params["filter"] = `name=${suitSeasonName}`
          }

          const result = await queryIdcSuitSeasonList(params)
          if (!result.success) {
            return []
          }
          return result.data.list.map(item => {
            return {
              label: item.name,
              value: item.name
            }
          })
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setSuitSeasonName(value)
          },
        }
        },
        rules: {
          required: true,
          message: intl.formatMessage({id: 'idc.suit.column.season'})
        }
    },
    {
      name: "type",
      label: intl.formatMessage({id: 'idc.suit.column.type'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.type'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (suitTypeName !== "") {
            params["filter"] = `name=${suitTypeName}`
          }

          const result = await queryIdcSuitTypeList(params)
          if (!result.success) {
            return []
          }
          return result.data.list.map(item => {
            return {
              label: item.name,
              value: item.name
            }
          })
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setSuitTypeName(value)
          }
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.suit.column.type'})
      }
    },
    {
      name: "cpu",
      label: intl.formatMessage({id: 'idc.suit.column.cpu'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.cpu'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.suit.column.cpu'})
      }
    },
    {
      name: "memory",
      label: intl.formatMessage({id: 'idc.suit.column.memory'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.memory'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.suit.column.memory'})
      }
    },
    {
      name: "storage",
      label: intl.formatMessage({id: 'idc.suit.column.storage'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.storage'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.suit.column.storage'})
      }
    },
    {
      name: "raid",
      label: intl.formatMessage({id: 'idc.suit.column.raid'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.raid'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: false,
        message: intl.formatMessage({id: 'idc.suit.column.raid'})
      }
    },
    {
      name: "gpu",
      label: intl.formatMessage({id: 'idc.suit.column.gpu'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.gpu'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: false,
        message: intl.formatMessage({id: 'idc.suit.column.gpu'})
      }
    },
    {
      name: "nic",
      label: intl.formatMessage({id: 'idc.suit.column.nic'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.nic'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.suit.column.nic'})
      },
    },
    {
      name: "psu",
      label: intl.formatMessage({id: 'idc.suit.column.psu'}),
      placeholder: intl.formatMessage({id: 'idc.suit.column.psu'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.suit.column.psu'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = () => {
  return ProModelCreateFormItems()
}
