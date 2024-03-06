import {ProFormSelect, ProFormText, ProFormTextArea} from "@ant-design/pro-components";
import { getIntl, getLocale } from 'umi';
import {
  nodeAttributeFilter,
  nodeContractFilter,
  nodeGradeFilter,
  nodeOperatorFilter,
  nodeStatusFilter, provinceHandleFilter, regionFilter
} from '@/util/dataConvert';

const intl = getIntl(getLocale());

export const ProDrawerNodeCreateFormItems = (productLines: any) => {
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'assets.node.table.column.name'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.node.create.column.name.requiredMessage'})
      }
    },
    {
      name: "cnName",
      label: intl.formatMessage({id: 'assets.node.table.column.cnName'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.cnName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.node.create.column.cnName.requiredMessage'})
      }
    },
    {
      name: "bandwidth",
      label: intl.formatMessage({id: 'assets.node.table.column.bandwidth'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.bandwidth'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.node.create.column.bandwidth.requiredMessage'})
      }
    },
    {
      name: "attribute",
      label: intl.formatMessage({id: 'assets.node.table.column.attribute'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.attribute'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: nodeAttributeFilter,
        convertValue: (value: any) => {
          if (typeof value === 'number') {
            return `${value}`
          }
        },
        transform: (value: string) => {
          return {
            attribute: parseInt(value)
          }
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.node.create.column.attribute.requiredMessage'})
      }
    },
    {
      name: "grade",
      label: intl.formatMessage({id: 'assets.node.table.column.grade'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.grade'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: nodeGradeFilter,
        convertValue: (value: any) => {
          if (typeof value === 'number') {
            return `${value}`
          }
        },
        transform: (value: string) => {
          return {
            grade: parseInt(value)
          }
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.node.create.column.grade.requiredMessage'})
      }
    }, {
    name: "status",
    label: intl.formatMessage({id: 'assets.node.table.column.status'}),
    placeholder: intl.formatMessage({id: 'assets.node.table.column.status'}),
    component: ProFormSelect,
    width: "xl",
    options: {
      valueType: 'select',
      valueEnum: nodeStatusFilter,
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
      message: intl.formatMessage({id: 'assets.node.create.column.status.requiredMessage'})
    }
  },
    {
      name: "contract",
      label: intl.formatMessage({id: 'assets.node.table.column.contract'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.contract'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: nodeContractFilter,
        convertValue: (value: any) => {
          if (typeof value === 'number') {
            return `${value}`
          }
        },
        transform: (value: string) => {
          return {
            contract: parseInt(value)
          }
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.node.create.column.contract.requiredMessage'})
      }
    },
    {
      name: "operator",
      label: intl.formatMessage({id: 'assets.node.table.column.operator'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.operator'}),
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
        message: intl.formatMessage({id: 'assets.node.create.column.operator.requiredMessage'})
      }
    },
    {
      name: "productLines",
      label: intl.formatMessage({id: 'assets.node.table.column.productLines'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.productLines'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'treeSelect',
        convertValue: (value: any) => {
          if (!value) {
            return
          }
          return value.map((x: any) => x.id ? x.id : x)
        },
        transform: (value: any) => {
          return {
            productLines: value.map((x: any) => x.id ? x.id : x)
          }
        },
        fieldProps: {
          options: productLines,
          fieldNames: {
            children: 'children',
            label: 'name',
            value: 'id',
          },
          showSearch: true,
          filterTreeNode: true,
          multiple: true,
          treeNodeFilterProp: 'id',
          treeNodeLabelProp: 'fullNamePath'
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.node.create.column.productLines.requiredMessage'})
      }
    },
    {
      name: "region",
      label: intl.formatMessage({id: 'assets.node.table.column.region'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.region'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: regionFilter
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.node.create.column.region.requiredMessage'})
      }
    },
    {
      name: "province",
      label: intl.formatMessage({id: 'assets.node.table.column.province'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.province'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        fieldProps: {
          showSearch: true
        },
        valueEnum: provinceHandleFilter()
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.node.create.column.province.requiredMessage'})
      }
    },
    {
      name: "comment",
      label: intl.formatMessage({id: 'assets.node.table.column.comment'}),
      placeholder: intl.formatMessage({id: 'assets.node.table.column.comment'}),
      component: ProFormTextArea,
      width: "xl",
      options: {},
      rules: {
        required: false,
        message: intl.formatMessage({id: 'assets.node.create.column.comment.requiredMessage'})
      }
    }
  ]
}

export const ProDrawerNodeUpdateFormItems = (productLines: any) => {
  const initFormItems = ProDrawerNodeCreateFormItems(productLines)
  initFormItems[0].options.disabled = true
  initFormItems[1].options.disabled = true
  return initFormItems
}
