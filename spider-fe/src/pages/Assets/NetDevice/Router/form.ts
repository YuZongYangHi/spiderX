import { getIntl, getLocale } from 'umi';
import {ProFormText, ProFormSelect, ProFormTextArea} from "@ant-design/pro-components";
import {useState} from "react";
import {queryNodeList} from '@/services/Assets/Node/api'
import {queryIpList} from '@/services/Assets/Ip/api'
import {queryFullNameIdcRackSlot, queryIdcFactoryList, queryIdcRackSlotList} from '@/services/Idc/idc'
import columnConvert from '@/util/ProTableColumnConvert'
const intl = getIntl(getLocale());


export const ProModelCreateFormItems = () => {
  const [searchNodeName, setSearchNodeName] = useState("");
  const [searchFactory, setFactory] = useState("");
  const [searchIp, setIp] = useState("");
  const [searchRackSlot, setRackSlot] = useState("");
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'assets.netDevice.column.name'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.netDevice.column.name'})
      }
    },
    {
      name: "sn",
      label: intl.formatMessage({id: 'assets.netDevice.column.sn'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.sn'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.netDevice.column.sn'})
      }
    },
    {
      name: "status",
      label: intl.formatMessage({id: 'assets.netDevice.column.status'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.status'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: columnConvert["assets.netDevice.status"],
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
        message: intl.formatMessage({id: 'assets.netDevice.column.status'})
      }
    },
    {
      name: "ipNetId",
      label: intl.formatMessage({id: 'assets.netDevice.column.ip'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.ip'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (searchIp !== "") {
            params["filter"] = `ip=${searchIp}`
          }

          const result = await queryIpList(params)
          if (!result.success) {
            return []
          }
          return result.data.list.map(item => {
            return {
              label: item.ip,
              value: item.id
            }
          })
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setIp(value)
          },
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.netDevice.column.nodeName'})
      }
    },
    {
      name: "nodeId",
      label: intl.formatMessage({id: 'assets.netDevice.column.nodeName'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.nodeName'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (searchNodeName !== "") {
            params["filter"] = `name=${searchNodeName}`
          }

          const result = await queryNodeList(params)
          if (!result.success) {
            return []
          }
          return result.data.list.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setSearchNodeName(value)
          },
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.netDevice.column.nodeName'})
      }
    },
    {
      name: "factoryId",
      label: intl.formatMessage({id: 'assets.netDevice.column.factory'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.factory'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (searchFactory !== "") {
            params["filter"] = `name=${searchFactory}`
          }

          const result = await queryIdcFactoryList(params)
          if (!result.success) {
            return []
          }
          return result.data.list.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setFactory(value)
          },
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.netDevice.column.factory'})
      }
    },
    {
      name: "rackSlotId",
      label: intl.formatMessage({id: 'assets.netDevice.column.rackSlot'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.rackSlot'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (searchRackSlot !== "") {
            const result = await queryFullNameIdcRackSlot(searchRackSlot)
            return result.data.list.map(item => {
              return {
                label: item.name,
                value: item.id
              }
            })
          }
          const result = await queryIdcRackSlotList(params)
          return result.data.list.map(item => {
            return {
              label: `${item.idcRack.idcRoom.idc.name}_${item.idcRack.idcRoom.roomName}_${item.idcRack.name}_${item.slot}`,
              value: item.id
            }
          })
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setRackSlot(value)
          },
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.netDevice.column.rackSlot'})
      }
    },
    {
      name: "username",
      label: intl.formatMessage({id: 'assets.netDevice.column.username'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.username'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.netDevice.column.username'})
      }
    },
    {
      name: "password",
      label: intl.formatMessage({id: 'assets.netDevice.column.password'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.password'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'assets.netDevice.column.password'})
      }
    },
    {
      name: "description",
      label: intl.formatMessage({id: 'assets.netDevice.column.description'}),
      placeholder: intl.formatMessage({id: 'assets.netDevice.column.description'}),
      component: ProFormTextArea,
      width: "xl",
      options: {},
      rules: {
        required: false,
        message: intl.formatMessage({id: 'assets.netDevice.column.description'})
      }
    }
  ]
}

export const ProModelUpdateFormItems = () => {
  return ProModelCreateFormItems()
}
