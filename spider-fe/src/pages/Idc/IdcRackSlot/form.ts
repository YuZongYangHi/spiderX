import { getIntl, getLocale } from 'umi';
import {ProFormDigit, ProFormSelect} from "@ant-design/pro-components";
import {
  IdcAzStatusFilter, IdcRackSlotTypeFilter
} from "@/util/dataConvert";
import {useState} from "react";
import {queryIdcRackList} from "@/services/Idc/idc";

const intl = getIntl(getLocale());

export const ProModelCreateFormItems = () => {
  const [searchIdcRackName, setIdcRackName] = useState("");
  return [
    {
      name: "idcRackId",
      label: intl.formatMessage({id: 'idc.room.column.roomName'}),
      placeholder: intl.formatMessage({id: 'idc.room.column.roomName'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (searchIdcRackName !== "") {
            params["filter"] = `name=${searchIdcRackName}`
          }

          const result = await queryIdcRackList(params)
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
            setIdcRackName(value)
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
      name: "type",
      label: intl.formatMessage({id: 'idc.rack.slot.column.type'}),
      placeholder: intl.formatMessage({id: 'idc.rack.slot.column.type'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: IdcRackSlotTypeFilter,
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
        message: intl.formatMessage({id: 'idc.rack.slot.column.type'})
      }
    },
    {
      name: "uNum",
      label: intl.formatMessage({id: 'idc.rack.slot.column.uNum'}),
      placeholder: intl.formatMessage({id: 'idc.rack.slot.column.uNum'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.slot.column.uNum'})
      }
    },
    {
      name: "slot",
      label: intl.formatMessage({id: 'idc.rack.slot.column.slot'}),
      placeholder: intl.formatMessage({id: 'idc.rack.slot.column.slot'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.slot.column.slot'})
      }
    },
    {
      name: "port",
      label: intl.formatMessage({id: 'idc.rack.slot.column.port'}),
      placeholder: intl.formatMessage({id: 'idc.rack.slot.column.port'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.rack.slot.column.port'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = () => {
  return ProModelCreateFormItems()
}
