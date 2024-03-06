import { getIntl, getLocale } from 'umi';
import {ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {
  regionFilter,
  provinceHandleFilter,
  IdcAzTypeFilter,
  IdcAzStatusFilter
} from "@/util/dataConvert";

const intl = getIntl(getLocale());
const provinceFilter = provinceHandleFilter()

export const ProModelCreateFormItems = () => {
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'idc.column.name'}),
      placeholder: intl.formatMessage({id: 'idc.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.column.name'})
      }
    },
    {
      name: "cnName",
      label: intl.formatMessage({id: 'idc.column.cnName'}),
      placeholder: intl.formatMessage({id: 'idc.column.cnName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.column.cnName'})
      }
    },
    {
      name: "region",
      label: intl.formatMessage({id: 'idc.column.region'}),
      placeholder: intl.formatMessage({id: 'idc.column.region'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: regionFilter,
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.column.region'})
      }
    },
    {
      name: "province",
      label: intl.formatMessage({id: 'idc.column.province'}),
      placeholder: intl.formatMessage({id: 'idc.column.province'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: provinceFilter,
        fieldProps: {
          showSearch: true
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.column.province'})
      }
    },
    {
      name: "status",
      label: intl.formatMessage({id: 'idc.column.status'}),
      placeholder: intl.formatMessage({id: 'idc.column.status'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: IdcAzStatusFilter,
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
        message: intl.formatMessage({id: 'idc.column.status'})
      }
    },
    {
      name: "type",
      label: intl.formatMessage({id: 'idc.column.type'}),
      placeholder: intl.formatMessage({id: 'idc.column.type'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: IdcAzTypeFilter,
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
        message: intl.formatMessage({id: 'idc.column.type'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = () => {
  const initFormItems = ProModelCreateFormItems()
  for (let i = 0; i <= 3; i ++) {
    initFormItems[i].options.disabled = true
  }
  return initFormItems
}
