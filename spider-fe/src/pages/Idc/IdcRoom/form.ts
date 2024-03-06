import { getIntl, getLocale } from 'umi';
import {ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {
  IdcRoomPduStandardFilter, IdcRoomBearerTypeFilter,
  IdcRoomBearWeightFilter, IdcRoomPowerModeFilter, IdcRoomRackSizeFilter, IdcAzStatusFilter
} from "@/util/dataConvert";
import {useState} from "react";
import {queryIdcList} from "@/services/Idc/idc";

const intl = getIntl(getLocale());

export const ProModelCreateFormItems = () => {
  const [searchIdcName, setIdcName] = useState("");
  return [
    {
      name: "roomName",
      label: intl.formatMessage({id: 'idc.room.column.roomName'}),
      placeholder: intl.formatMessage({id: 'idc.room.column.roomName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.room.column.roomName'})
      }
    },
    {
      name: "idcId",
      label: intl.formatMessage({id: 'idc.room.column.idc'}),
      placeholder: intl.formatMessage({id: 'idc.room.column.idc'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {}
          if (searchIdcName !== "") {
            params["filter"] = `name=${searchIdcName}`
          }

          const result = await queryIdcList(params)
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
            setIdcName(value)
          }
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.room.column.idc'})
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
      name: "pduStandard",
      label: intl.formatMessage({id: 'idc.room.column.pduStandard'}),
      placeholder: intl.formatMessage({id: 'idc.room.column.pduStandard'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: IdcRoomPduStandardFilter
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.room.column.pduStandard'})
      }
    },
    {
      name: "powerMode",
      label: intl.formatMessage({id: 'idc.room.column.powerMode'}),
      placeholder: intl.formatMessage({id: 'idc.room.column.powerMode'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: IdcRoomPowerModeFilter
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.room.column.powerMode'})
      }
    },
    {
      name: "rackSize",
      label: intl.formatMessage({id: 'idc.room.column.rackSize'}),
      placeholder: intl.formatMessage({id: 'idc.room.column.rackSize'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: IdcRoomRackSizeFilter
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.room.column.rackSize'})
      }
    },
    {
      name: "bearerType",
      label: intl.formatMessage({id: 'idc.room.column.bearerType'}),
      placeholder: intl.formatMessage({id: 'idc.room.column.bearerType'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: IdcRoomBearerTypeFilter,
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.room.column.bearerType'})
      }
    },
    {
      name: "bearWeight",
      label: intl.formatMessage({id: 'idc.room.column.bearWeight'}),
      placeholder: intl.formatMessage({id: 'idc.room.column.bearWeight'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: IdcRoomBearWeightFilter
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.room.column.bearWeight'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = () => {
  const initFormItems = ProModelCreateFormItems()
  for (let i = 0; i < 1; i ++) {
    initFormItems[i].options.disabled = true
  }
  return initFormItems
}
