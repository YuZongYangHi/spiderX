import { getIntl, getLocale } from 'umi';
import {ProFormText, ProFormSelect, ProFormDigit, ProFormRadio} from "@ant-design/pro-components";
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-json';

const intl = getIntl(getLocale());

const widthOptions = [
  {
    label: "xs",
    value: "xs"
  },
  {
    label: "sm",
    value: "sm"
  },
  {
    label: "md",
    value: "md"
  },
  {
    label: "lg",
    value: "lg"
  },
  {
    label: "xl",
    value: "xl"
  },
  {
    label: "xxl",
    value: "xxl"
  }
]

export const ProModelCreateFormItems = (workflow: any, formRef: any) => {

  const workflowOption = [
    {
      label: workflow.name,
      value: workflow.id
    }
  ]
  const fieldTypeOption = [
    {
      label: intl.formatMessage({id: 'ticket.workflow.form.fieldType.string'}),
      value: 1
    }, {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.int"}),
      value: 2
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.dateRange"}),
      value: 3
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.switch"}),
      value: 4
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.date"}),
      value: 5
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.datetime"}),
      value: 6
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.radio"}),
      value: 7
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.checkbox"}),
      value: 8
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.select"}),
      value: 9
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.multiSelect"}),
      value: 10
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.text"}),
      value: 11
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.remoteSearch"}),
      value: 12
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.userSearch"}),
      value: 13
    },
    {
      label: intl.formatMessage({id: "ticket.workflow.form.fieldType.groupSearch"}),
      value: 14
    },
  ]
  const requiredOption = [
    {
      label: intl.formatMessage({id: 'ticket.workflow.form.column.required.yes'}),
      value: 1
    },
    {
      label:  intl.formatMessage({id: 'ticket.workflow.form.column.required.no'}),
      value: 2
    }
  ]

  return [
    {
      name: "fieldLabel",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.fieldName'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.fieldName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.fieldName'})
      }
    },
    {
      name: "fieldKey",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.fieldValue'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.fieldValue'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.fieldValue'})
      }
    },
    {
      name: "defaultValue",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.defaultValue'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.defaultValue'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: false,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.defaultValue'})
      }
    },
    {
      name: "fieldType",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.type'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.type'}),
      component: ProFormRadio.Group,
      width: "xl",
      options: {
        request: async () => fieldTypeOption,
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.type'})
      }
    },
    {
      name: "required",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.required'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.required'}),
      component: ProFormRadio.Group,
      width: "xl",
      options: {
        request: async () => requiredOption,
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.required'})
      }
    },
    {
      name: "priority",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.priority'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.priority'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.priority'})
      }
    },
    {
      name: "categoryId",
      label: intl.formatMessage({id: 'ticket.workflow.name'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.name'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => workflowOption,
        initialValue: workflow.id,
        disabled: true
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.name'})
      }
    },
    {
      name: "placeholder",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.placeholder'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.placeholder'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.placeholder'})
      }
    },
    {
      name: "remoteURL",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.remoteURL'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.remoteURL'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: false,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.remoteURL'})
      }
    },
    {
      name: "width",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.width'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.width'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => widthOptions,
      },
      rules: {
        required: false,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.width'})
      }
    },
    {
      name: "rowMargin",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.rowMargin'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.rowMargin'}),
      component: ProFormText,
      width: "xl",
      options: {
        convertValue: (value: any) => {
          if (typeof value === 'number') {
            return `${value}`
          }
          return value && parseInt(value) || value
        },
        transform: (value: string) => {
          return {
            rowMargin: parseInt(value)
          }
        },

      },
      rules: {
        required: false,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.rowMargin'})
      }
    },
    {
      name: "fieldOptions",
      label: intl.formatMessage({id: 'ticket.workflow.form.column.fieldOptions'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.form.column.fieldOptions'}),
      component: AceEditor,
      type: "custom",
      options: {
        mode: "json",
        theme: "monokai",
        width: "auto",
        name: "fieldOptions",
        fontSize: 14,
        showPrintMargin: true,
        height: "200px",
        showGutter: true,
      },
      width: "xl",
      rules: {
        required: false,
        message: intl.formatMessage({id: 'ticket.workflow.form.column.fieldOptions'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = (workflow: any, proModalUpdateRef: any) => {
  const form =  ProModelCreateFormItems(workflow, proModalUpdateRef)
  form[0].options.disabled = true
  form[1].options.disabled = true
  form[3].options.disabled = true
  return form
}
