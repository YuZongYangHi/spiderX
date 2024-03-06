import { getIntl, getLocale } from 'umi';
import {ProFormText, ProFormSelect} from "@ant-design/pro-components";

const intl = getIntl(getLocale());

export const ProModelCreateFormItems = (workflow: any) => {
  const option = [
    {
      label: workflow.name,
      value: workflow.id
    }
  ]
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'ticket.workflow.helper.name'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.helper.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.helper.name'})
      }
    },
    {
      name: "url",
      label: intl.formatMessage({id: 'ticket.workflow.helper.url'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.helper.url'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.helper.url'})
      }
    },
    {
      name: "categoryId",
      label: intl.formatMessage({id: 'ticket.workflow.helper.workflow'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.helper.workflow'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => option,
        initialValue: workflow.id,
        disabled: true
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.helper.workflow'})
      }
    },
    {
      name: "description",
      label: intl.formatMessage({id: 'ticket.workflow.description'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.description'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.description'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = (workflow: any) => {
  return ProModelCreateFormItems(workflow)
}
