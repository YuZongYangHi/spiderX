import {ProFormDateTimeRangePicker, ProFormText} from "@ant-design/pro-form";
import {
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormRadio, ProFormSelect,
  ProFormSwitch, ProFormTextArea
} from "@ant-design/pro-components";
import {queryUserList} from '@/services/users/api'
import {queryGroupList} from '@/services/group/api'
import React, {useEffect, useState} from "react";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";
import {fetch} from '@/services/base/api'
import {ProFormInstance} from "@ant-design/pro-form/es/BaseForm/BaseForm";

export const remoteSearchRequest = (url: string) => {
  return (params: any) => {
    return fetch(url, "GET", {}, params)
  }
}

export const ProFormTextItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormText,
    options: {}
  }
}

export const ProFormDigitItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormDigit,
    options: {}
  }
}

export const ProFormDateTimeRangePickerItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormDateTimeRangePicker,
    options: {
      convertValue: (value: any) => {
        return value && typeof value === "string" ? value.split(",") : value
      }
    }
  }
}

export const ProFormSwitchItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormSwitch,
    options: {}
  }
}

export const ProFormDatePickerItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormDatePicker,
    options: {}
  }
}

export const ProFormDateTimePickerItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormDateTimePicker,
    options: {}
  }
}

export const ProFormRadioItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormRadio.Group,
    options: {
      request: () => JSON.parse(row.fieldOptions)
    }
  }
}

export const ProFormCheckboxItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormCheckbox.Group,
    options: {
      request: () => JSON.parse(row.fieldOptions),
      initialValue: row.defaultValue ? row.defaultValue.split(',') : []
    }
  }
}

export const ProFormSelectItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormSelect,
    options: {
      request: async () => JSON.parse(row.fieldOptions),
    }
  }
}

export const ProFormMultiSelectItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormSelect,
    options: {
      request: async () => JSON.parse(row.fieldOptions),
      mode: "multiple",
      convertValue: (value: any) => {
        return value && typeof value === "string" ? value.split(",") : value
      },
      initialValue: row.defaultValue ? row.defaultValue.split(',') : []
    }
  }
}

export const ProFormTextAreaItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return {
    component: ProFormTextArea,
    options: {}
  }
}

export const ProFormSelectRemote = (request: any, row: TicketResponse.WorkflowCustomFormInfo, key = "key", value = "value", filter = "key") => {
  const [content, setContent] = useState(row?.defaultValue || "");
  return {
    component: ProFormSelect,
    options: {
      dependencies: [row.fieldKey],
      convertValue: (value: any) => {
        return value && typeof value === "string" ? value.split(",") : value
      },
      request: async (p) => {
        const params: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: key,
            value: value
          },
          params: {},
          request: request || remoteSearchRequest(row.remoteURL)
        }
        let searchValue = ""
        if (p.keyWords) {
          searchValue = p.keyWords
        } else if (p[row.fieldKey] && p[row.fieldKey].length > 0) {
          searchValue = typeof p[row.fieldKey] === "string" ? p[row.fieldKey] : p[row.fieldKey].join()
        }
        if (searchValue) {
          params.params["filter"] = `${filter}=${searchValue}`
        }
        const result = await RemoteRequestSelectSearch(params)
        return result
      },
      initialValue: row.defaultValue ? row.defaultValue.split(',') : [],
      mode: "multiple",
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setContent(value)
        }
      }
    }
  }
}

export const ProFormSelectRemoteItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return ProFormSelectRemote(null, row)
}

export const ProFormSelectUserItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return ProFormSelectRemote(queryUserList, row, "username", "username",  "users")
}

export const ProFormSelectGroupItemRender = (row: TicketResponse.WorkflowCustomFormInfo) => {
  return ProFormSelectRemote(queryGroupList, row, "name", "name", "groups")
}

export const FormItemTypeRelMap = {
  1: ProFormTextItemRender,
  2: ProFormDigitItemRender,
  3: ProFormDateTimeRangePickerItemRender,
  4: ProFormSwitchItemRender,
  5: ProFormDatePickerItemRender,
  6: ProFormDateTimePickerItemRender,
  7: ProFormRadioItemRender,
  8: ProFormCheckboxItemRender,
  9: ProFormSelectItemRender,
  10: ProFormMultiSelectItemRender,
  11: ProFormTextAreaItemRender,
  12: ProFormSelectRemoteItemRender,
  13: ProFormSelectUserItemRender,
  14: ProFormSelectGroupItemRender
}

export const FormItemRender = (row: TicketResponse.WorkflowCustomFormInfo, formRef: any, options: object) => {
  const data = FormItemTypeRelMap[row.fieldType](row, formRef);
  return <data.component
          key={row.fieldKey}
          colProps={{ span: row.rowMargin }}
          label={row.fieldLabel}
          name={row.fieldKey}
          width={row.width}
          rules={[{required: row.required === 1, message: row.placeholder}]}
          placeholder={row.placeholder}
          {...row.defaultValue && {initialValue: row.defaultValue}}
          {...data.options}
          {...options}
        />
}

export const FormValueTransform = (fieldType: number, value: any): string => {
  let s: string = ""
  switch (fieldType) {
    case 3:
    case 8:
    case 10:
    case 12:
    case 13:
    case 14:
      s = value && typeof value === "object" && value.join(",") || value
      break
    default:
      s = value;
      break
  }
  return s
}
