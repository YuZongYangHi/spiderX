import { getIntl, getLocale } from 'umi';
import {ProFormText} from "@ant-design/pro-components";

const intl = getIntl(getLocale());

export const ProModelCreateFormItems = () => {
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'idc.provider.column.name'}),
      placeholder: intl.formatMessage({id: 'idc.provider.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.provider.column.name'})
      }
    },
    {
      name: "alias",
      label: intl.formatMessage({id: 'idc.provider.column.alias'}),
      placeholder: intl.formatMessage({id: 'idc.provider.column.alias'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.provider.column.alias'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = () => {
  return ProModelCreateFormItems()
}
