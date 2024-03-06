import { getIntl, getLocale } from 'umi';
import {ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea} from "@ant-design/pro-components";
import {IdcAzStatusFilter, regionFilter} from "@/util/dataConvert";
import {useState} from "react";
import {queryAzList} from "@/services/Idc/idc";

const intl = getIntl(getLocale());

export const ProModelCreateFormItems = () => {
  const [searchPhysicsName, setPhysicsName] = useState("");
  const [searchVirtualName, setVirtualName] = useState("");
  return [
    {
      name: "name",
      label: intl.formatMessage({id: 'idc.column.name'}),
      placeholder: intl.formatMessage({id: 'idc.column.name'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.column.name'})
      }
    },
    {
      name: "cnName",
      label: intl.formatMessage({id: 'idc.column.cnName'}),
      placeholder: intl.formatMessage({id: 'idc.column.cnName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.column.cnName'})
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
    },{
      name: "physicsAzId",
      label: intl.formatMessage({id: 'idc.idc.column.physicsName'}),
      placeholder: intl.formatMessage({id: 'idc.idc.column.physicsName'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {
            "filter": `type=1`
          }
          if (searchPhysicsName !== "") {
            params["filter"] = `type=1&name=${searchPhysicsName}`
          }

          const result = await queryAzList(params)
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
            setPhysicsName(value)
          }
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.idc.column.physicsName'})
      }
    },
    {
      name: "virtualAzId",
      label: intl.formatMessage({id: 'idc.idc.column.virtualName'}),
      placeholder: intl.formatMessage({id: 'idc.idc.column.virtualName'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const params = {
            "filter": `type=2`
          }
          if (searchPhysicsName !== "") {
            params["filter"] = `type=2&name=${searchVirtualName}`
          }

          const result = await queryAzList(params)
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
            setVirtualName(value)
          }
        },
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.idc.column.virtualName'})
      }
    },
    {
      name: "cabinetNum",
      label: intl.formatMessage({id: 'idc.idc.column.cabinetNum'}),
      placeholder: intl.formatMessage({id: 'idc.idc.column.cabinetNum'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.idc.column.cabinetNum'})
      }
    },
    {
      name: "region",
      label: intl.formatMessage({id: 'idc.column.region'}),
      placeholder: intl.formatMessage({id: 'idc.column.region'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        valueType: 'select',
        valueEnum: regionFilter,
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.column.region'})
      }
    },
    {
      name: "city",
      label: intl.formatMessage({id: 'idc.idc.column.city'}),
      placeholder: intl.formatMessage({id: 'idc.idc.column.city'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.idc.column.city'})
      }
    },
    {
      name: "address",
      label: intl.formatMessage({id: 'idc.idc.column.address'}),
      placeholder: intl.formatMessage({id: 'idc.idc.column.address'}),
      component: ProFormTextArea,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.idc.column.address'})
      }
    },
    {
      name: "idcPhone",
      label: intl.formatMessage({id: 'idc.idc.column.idcPhone'}),
      placeholder: intl.formatMessage({id: 'idc.idc.column.idcPhone'}),
      component: ProFormTextArea,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.idc.column.idcPhone'})
      }
    },
    {
      name: "idcMail",
      label: intl.formatMessage({id: 'idc.idc.column.idcMail'}),
      placeholder: intl.formatMessage({id: 'idc.idc.column.idcMail'}),
      component: ProFormTextArea,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'idc.idc.column.idcMail'})
      }
    },
    {
      name: "comment",
      label: intl.formatMessage({id: 'idc.idc.column.comment'}),
      placeholder: intl.formatMessage({id: 'idc.idc.column.comment'}),
      component: ProFormTextArea,
      width: "xl",
      options: {

      },
      rules: {
        required: false,
        message: intl.formatMessage({id: 'idc.idc.column.comment'})
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
