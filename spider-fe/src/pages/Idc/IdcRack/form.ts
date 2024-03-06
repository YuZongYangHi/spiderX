import { getIntl, getLocale } from 'umi';
import {ProFormDigit, ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {
  IdcAzStatusFilter
} from "@/util/dataConvert";
import {useState} from "react";
import {queryIdcRoomList} from "@/services/Idc/idc";

const intl = getIntl(getLocale());

export const ProModelCreateFormItems = () => {
  const [searchIdcRoomName, setIdcRoomName] = useState("");
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'idc.rack.column.name'}),
      placeholder: intl.formatMessage({id: 'idc.rack.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.column.name'})
      }
    },
    {
      name: "idcRoomId",
      label: intl.formatMessage({id: 'idc.room.column.roomName'}),
      placeholder: intl.formatMessage({id: 'idc.room.column.roomName'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (searchIdcRoomName !== "") {
            params["filter"] = `roomName=${searchIdcRoomName}`
          }

          const result = await queryIdcRoomList(params)
          if (!result.success) {
            return []
          }
          return result.data.list.map(item => {
            return {
              label: item.roomName,
              value: item.id
            }
          })
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setIdcRoomName(value)
          }
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.room.column.roomName'})
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
      name: "row",
      label: intl.formatMessage({id: 'idc.rack.column.row'}),
      placeholder: intl.formatMessage({id: 'idc.rack.column.row'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.column.row'})
      }
    },
    {
      name: "col",
      label: intl.formatMessage({id: 'idc.rack.column.col'}),
      placeholder: intl.formatMessage({id: 'idc.rack.column.col'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.column.col'})
      }
    },
    {
      name: "group",
      label: intl.formatMessage({id: 'idc.rack.column.group'}),
      placeholder: intl.formatMessage({id: 'idc.rack.column.group'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.column.group'})
      }
    },
    {
      name: "uNum",
      label: intl.formatMessage({id: 'idc.rack.column.uNum'}),
      placeholder: intl.formatMessage({id: 'idc.rack.column.uNum'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.column.uNum'})
      }
    },
    {
      name: "ratedPower",
      label: intl.formatMessage({id: 'idc.rack.column.ratedPower'}),
      placeholder: intl.formatMessage({id: 'idc.rack.column.ratedPower'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.column.ratedPower'})
      }
    },
    {
      name: "netUNum",
      label: intl.formatMessage({id: 'idc.rack.column.netUNum'}),
      placeholder: intl.formatMessage({id: 'idc.rack.column.netUNum'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.column.netUNum'})
      }
    },
    {
      name: "current",
      label: intl.formatMessage({id: 'idc.rack.column.current'}),
      placeholder: intl.formatMessage({id: 'idc.rack.column.current'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.column.current'})
      }
    }
  ]
}

export const ProModelUpdateFormItems = () => {
  const initFormItems = ProModelCreateFormItems()
  for (let i = 0; i < 1; i ++) {
    initFormItems[i].options.disabled = true
  }
  return initFormItems
}
