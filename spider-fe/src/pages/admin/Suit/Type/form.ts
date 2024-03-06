import { getIntl, getLocale } from 'umi';
import {ProFormText} from "@ant-design/pro-components";

const intl = getIntl(getLocale());

export const ProModelCreateFormItems = () => {
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'idc.suit.type.column.name'}),
      placeholder: intl.formatMessage({id: 'idc.suit.type.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.suit.type.column.name'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = () => {
  return ProModelCreateFormItems()
}
