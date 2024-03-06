import { getIntl, getLocale } from 'umi';
import {ProFormText, ProFormSelect, ProFormTextArea} from "@ant-design/pro-components";
import {useState} from "react";
import {queryIpRangeList} from '@/services/Assets/IpRange/api'
import columnConvert from '@/util/ProTableColumnConvert'
import {nodeOperatorFilter} from "@/util/dataConvert";
const intl = getIntl(getLocale());

export const ProModelCreateFormItems = () => {
  const [searchIpRange, setIpRange] = useState("");
  return [
    {
      name: "ip",
      label: intl.formatMessage({id: 'assets.ip.column.ip'}),
      placeholder: intl.formatMessage({id: 'assets.ip.column.ip'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.ip.column.ip'})
      }
    },
    {
      name: "netmask",
      label: intl.formatMessage({id: 'assets.ip.column.netmask'}),
      placeholder: intl.formatMessage({id: 'assets.ip.column.netmask'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.ip.column.netmask'})
      }
    },
    {
      name: "gateway",
      label: intl.formatMessage({id: 'assets.ip.column.gateway'}),
      placeholder: intl.formatMessage({id: 'assets.ip.column.gateway'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.ip.column.gateway'})
      }
    },
    {
      name: "ipRangeId",
      label: intl.formatMessage({id: 'assets.ip.range.column.cidr'}),
      placeholder: intl.formatMessage({id: 'assets.ip.range.column.cidr'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (searchIpRange !== "") {
            params["filter"] = `cidr=${searchIpRange}`
          }

          const result = await queryIpRangeList(params)
          if (!result.success) {
            return []
          }
          return result.data.list.map(item => {
            return {
              label: item.cidr,
              value: item.id
            }
          })
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setIpRange(value)
          },
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.ip.range.column.cidr'})
      }
    },
    {
      name: "env",
      label: intl.formatMessage({id: 'assets.ip.column.env'}),
      placeholder: intl.formatMessage({id: 'assets.ip.column.env'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: columnConvert["assets.ip.env"],
        convertValue: (value: any) => {
          if (typeof value === 'number') {
            return `${value}`
          }
        },
        transform: (value: string) => {
          return {
            env: parseInt(value)
          }
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.ip.column.env'})
      }
    },
    {
      name: "status",
      label: intl.formatMessage({id: 'assets.ip.column.status'}),
      placeholder: intl.formatMessage({id: 'assets.ip.column.status'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: columnConvert["assets.ip.status"],
        convertValue: (value: any) => {
          if (typeof value === 'number') {
            return `${value}`
          }
        },
        transform: (value: string) => {
          return {
            status: parseInt(value)
          }
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.ip.column.status'})
      }
    },
    {
      name: "version",
      label: intl.formatMessage({id: 'assets.ip.column.version'}),
      placeholder: intl.formatMessage({id: 'assets.ip.column.version'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: columnConvert["assets.ip.version"],
        convertValue: (value: any) => {
          if (typeof value === 'number') {
            return `${value}`
          }
        },
        transform: (value: string) => {
          return {
            version: parseInt(value)
          }
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.ip.column.version'})
      }
    },
    {
      name: "operator",
      label: intl.formatMessage({id: 'assets.ip.column.operator'}),
      placeholder: intl.formatMessage({id: 'assets.ip.column.operator'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: nodeOperatorFilter,
        convertValue: (value: any) => {
          if (typeof value === 'number') {
            return `${value}`
          }
        },
        transform: (value: string) => {
          return {
            operator: parseInt(value)
          }
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.ip.column.operator'})
      }
    },
    {
      name: "type",
      label: intl.formatMessage({id: 'assets.ip.column.type'}),
      placeholder: intl.formatMessage({id: 'assets.ip.column.type'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: columnConvert["assets.ip.type"],
        convertValue: (value: any) => {
          if (typeof value === 'number') {
            return `${value}`
          }
        },
        transform: (value: string) => {
          return {
            type: parseInt(value)
          }
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.ip.column.type'})
      }
    },
    {
      name: "description",
      label: intl.formatMessage({id: 'assets.ip.column.description'}),
      placeholder: intl.formatMessage({id: 'assets.ip.column.description'}),
      component: ProFormTextArea,
      width: "xl",
      options: {},
      rules: {
        required: false,
        message: intl.formatMessage({id: 'assets.ip.column.description'})
      }
    },
  ]
}


export const ProModelUpdateFormItems = () => {
  const form = ProModelCreateFormItems()
  form[0].options.disabled = true
  return form
}
