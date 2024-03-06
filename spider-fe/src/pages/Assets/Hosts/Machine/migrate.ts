import {ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {getIntl, getLocale} from "umi";

const intl = getIntl(getLocale());

export const ServerTreeMigrateForm = (productLines: any, currentRow: any, data: ServerResponse.ServerInfo[], treeList: any) => {
  const serverOption = []
  currentRow?.serverIds?.forEach(serverId => {
    const current = data?.filter(server => server.id === serverId)
    serverOption.push({
      label: current[0].hostname,
      value: serverId
    })
  })
  return [
    {
      name: "serverIds",
      label: intl.formatMessage({id: 'assets.hosts.migrate.form.serverIds'}),
      placeholder: intl.formatMessage({id: 'assets.hosts.migrate.form.serverIds'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        disabled: true,
        request: async => serverOption,
        fieldProps: {
          mode: "multiple",
        },

      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.hosts.migrate.form.serverIds'})
      }
    },
    {
      name: "srcTreeId",
      label: intl.formatMessage({id: 'assets.hosts.migrate.form.srcTree'}),
      placeholder: intl.formatMessage({id: 'assets.hosts.migrate.form.srcTree'}),
      component: ProFormText,
      width: "xl",
      options: {
        disabled: true,
        convertValue: (value: any) => {
          if (!value) {
            return
          }
          let label:string
          treeList.map(item => {
           if (item.id === parseInt(value)) {
             label = item.fullNamePath
           }})
          return label
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.hosts.migrate.form.srcTree'})
      }
    },
    {
      name: "targetIds",
      label: intl.formatMessage({id: 'assets.hosts.migrate.form.targetTree'}),
      placeholder: intl.formatMessage({id: 'assets.hosts.migrate.form.targetTree'}),
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
            targetIds: value.map((x: any) => x.id ? x.id : x)
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
        message: intl.formatMessage({id: 'assets.hosts.migrate.form.targetTree'})
      }
    }
  ]
}
