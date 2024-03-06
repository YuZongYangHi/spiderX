import { getIntl, getLocale } from 'umi';
import {ProFormText, ProFormTextArea} from "@ant-design/pro-components";

const intl = getIntl(getLocale());

export const ProModelCreateFormItems = () => {
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'idc.factory.column.name'}),
      placeholder: intl.formatMessage({id: 'idc.factory.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.factory.column.name'})
      }
    },
    {
      name: "enName",
      label: intl.formatMessage({id: 'idc.factory.column.enName'}),
      placeholder: intl.formatMessage({id: 'idc.factory.column.enName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.factory.column.enName'})
      }
    },
    {
      name: "cnName",
      label: intl.formatMessage({id: 'idc.factory.column.cnName'}),
      placeholder: intl.formatMessage({id: 'idc.factory.column.cnName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.factory.column.cnName'})
      }
    },
    {
      name: "modeName",
      label: intl.formatMessage({id: 'idc.factory.column.modeName'}),
      placeholder: intl.formatMessage({id: 'idc.factory.column.modeName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.factory.column.modeName'})
      }
    },
    {
      name: "description",
      label: intl.formatMessage({id: 'idc.factory.column.description'}),
      placeholder: intl.formatMessage({id: 'idc.factory.column.description'}),
      component: ProFormTextArea,
      width: "xl",
      options: {},
      rules: {
        required: false,
        message: intl.formatMessage({id: 'idc.factory.column.description'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = () => {
  return ProModelCreateFormItems()
}
