import { getIntl, getLocale } from 'umi';
import {ProFormText, ProFormSelect, ProFormRadio} from "@ant-design/pro-components";
import {useState} from "react";
import {listTicketWorkflowNodeStat} from "@/services/Ticket/api";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";


const intl = getIntl(getLocale());

export const ProModelCreateFormItems = (workflow: any, formRef: any) => {
  const [searchSrcNode, setSearchSrcNode] = useState("");
  const [searchTargetNode, setSearchTargetNode] = useState("");

  const workflowOption = [
    {
      label: workflow.name,
      value: workflow.id
    }
  ]

  const buttonTypeOptions = [
    {
      label: "同意",
      value: "agree"
    }, {
      label: "拒绝",
      value: "reject"
    },
    {
      label: "废弃",
      value: "cancel"
    }
  ]

  return [
    {
      name: "buttonName",
      label: intl.formatMessage({id: 'ticket.workflow.transition.column.buttonName'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.transition.column.buttonName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.transition.column.buttonName'})
      }
    },
    {
      name: "buttonType",
      label: intl.formatMessage({id: 'ticket.workflow.transition.column.buttonType'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.transition.column.buttonType'}),
      component: ProFormRadio.Group,
      width: "xl",
      options: {
        options: buttonTypeOptions
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.transition.column.buttonType'})
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
      name: "currentWorkflowStateId",
      label: intl.formatMessage({id: 'ticket.workflow.transition.column.src'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.transition.column.src'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const p: handlerRequest.RemoteSelectSearchParams = {
            option: {
              label: "stateName",
              value: "id"
            },
            params: {"filter": `categoryId=${workflow.id}`},
            request: listTicketWorkflowNodeStat
          }

          if (searchTargetNode !== "") {
            p.params["filter"] += `&stateName=${searchTargetNode}`
          }
          return RemoteRequestSelectSearch(p)
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setSearchSrcNode(value)
          },
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.transition.column.src'})
      }
    },
    {
      name: "targetWorkflowStateId",
      label: intl.formatMessage({id: 'ticket.workflow.transition.column.dest'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.transition.column.dest'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => {
          const p: handlerRequest.RemoteSelectSearchParams = {
            option: {
              label: "stateName",
              value: "id"
            },
            params: {"filter": `categoryId=${workflow.id}`},
            request: listTicketWorkflowNodeStat
          }

          if (searchTargetNode !== "") {
            p.params["filter"] += `&stateName=${searchTargetNode}`
          }
          return RemoteRequestSelectSearch(p)
        },
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSearch: (value: string) => {
            setSearchTargetNode(value)
          },
        }

      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.transition.column.dest'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = (workflow: any, proModalUpdateRef: any) => {
  const form =  ProModelCreateFormItems(workflow, proModalUpdateRef)
  return form
}
