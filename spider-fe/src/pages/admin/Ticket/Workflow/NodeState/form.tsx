import { getIntl, getLocale } from 'umi';
import {ProFormText, ProFormSelect, ProFormDigit, ProFormRadio} from "@ant-design/pro-components";
import {queryGroupList} from '@/services/group/api'
import {queryUserList} from '@/services/users/api'
import {useState} from "react";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";
import { Flex} from "antd";

const intl = getIntl(getLocale());
const approvalTypeOption = [
  {
    label: intl.formatMessage({id: 'ticket.workflow.state.approvalType.manual'}),
    value: 1
  }, {
    label: intl.formatMessage({id: "ticket.workflow.state.approvalType.agree"}),
    value: 2
  },
  {
    label: intl.formatMessage({id: "ticket.workflow.state.approvalType.reject"}),
    value: 3
  },
  {
    label: intl.formatMessage({id: "ticket.workflow.state.approvalType.done"}),
    value: 4
  },
]

export const ProModelCreateFormItems = (workflow: any, record: TicketResponse.WorkflowNodeStateInfo, formList: TicketResponse.WorkflowCustomFormInfo[],  formRef: any) => {
  const [searchParticipant, setParticipant] = useState("");
  const option = [
    {
      label: workflow.name,
      value: workflow.id
    }
  ]
  const formFieldStateOption = [
    {
      key: "read",
      label: intl.formatMessage({id: 'ticket.workflow.form.field.read'}),
      value: 1
    },
    {
      key: "write",
      label: intl.formatMessage({id: 'ticket.workflow.form.field.editRead'}),
      value: 2
    },
    {
      key: "hidden",
      label: intl.formatMessage({id: 'ticket.workflow.form.field.hidden'}),
      value: 3
    },
  ]
  const hiddenStateOption = [
    {
      label: intl.formatMessage({id: 'ticket.workflow.state.hiddenState.show'}),
      value: 1
    }, {
      label: intl.formatMessage({id: 'ticket.workflow.state.hiddenState.hide'}),
      value: 2
    }
  ]
  const participantTypeOption = [
    {
      label: intl.formatMessage({id: 'ticket.workflow.state.participantType.person'}),
      value: 1
    }, {
      label: intl.formatMessage({id: "ticket.workflow.state.participantType.group"}),
      value: 2
    },
    {
      label: intl.formatMessage({id: 'ticket.workflow.state.participantType.done'}),
      value: 3
    },
    {
      label: intl.formatMessage({id: 'ticket.workflow.state.participantType.applicant'}),
      value: 4
    }
  ]

  const onParticipantTypeChange = (e: any) => {
    let participant = []
    switch (e.target.value) {
      case 3:
        participant.push(-1);
        break;
      case 4:
        participant.push(-2);
        break;
    }
    formRef.current.proDrawerRef.current.setFieldValue(
      "participant", participant
    )
  }

  return [
    {
      name: "stateName",
      label: intl.formatMessage({id: 'ticket.workflow.state.stateName'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.state.stateName'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.state.stateName'})
      }
    },
    {
      name: "priority",
      label: intl.formatMessage({id: 'ticket.workflow.state.priority'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.state.priority'}),
      component: ProFormDigit,
      width: "xl",
      options: {},
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.state.priority'})
      }
    },
    {
      name: "categoryId",
      label: intl.formatMessage({id: 'ticket.workflow.helper.workflow'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.helper.workflow'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        request: async () => option,
        initialValue: workflow.id,
        disabled: true
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.helper.workflow'})
      }
    },
    {
      name: "approvalType",
      label: intl.formatMessage({id: 'ticket.workflow.state.approvalType'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.state.approvalType'}),
      component: ProFormRadio.Group,
      width: "xl",
      options: {
        options: approvalTypeOption
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.state.approvalType'})
      }
    },
    {
      name: "hiddenState",
      label: intl.formatMessage({id: 'ticket.workflow.state.hiddenState'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.state.hiddenState'}),
      component: ProFormRadio.Group,
      width: "xl",
      options: {
        options: hiddenStateOption
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.state.hiddenState'})
      }
    },
    {
      name: "participantType",
      label: intl.formatMessage({id: 'ticket.workflow.state.participantType'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.state.participantType'}),
      component: ProFormRadio.Group,
      width: "xl",
      options: {
        options: participantTypeOption,
        fieldProps: {
          onChange: onParticipantTypeChange
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.state.participantType'})
      }
    },
    {
      name: "participant",
      label: intl.formatMessage({id: 'ticket.workflow.state.participant'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.state.participant.placeholder'}),
      component: ProFormSelect,
      width: "xl",
      options: {
        mode: "multiple",
        fieldProps: {
          allowClear: true,
          showSearch: true,
          onSelect: () => {
            setParticipant("")
          },
          onSearch: (value: string) => {
            setParticipant(value)
          }
        },
        convertValue: (value: any) => {
          if (!value) {
            return
          }
          return typeof value === "string" ? value.split(",").map(Number) : value.map((x: any) => x.id ? x.id : x)
        },
        transform: (value: any) => {
          return {
            participant: typeof value === "string" ? value : value.join(",")
          }
        },
        dependencies: ["participant", "participantType"],
        request: async (params) => {
          if (params.participantType === 3) {
            return [
              {
                "label": intl.formatMessage({id: "ticket.workflow.state.participantType.done"}),
                "value": -1
              }
            ]
          }

          if (params.participantType === 4) {
            return [
              {
                "label": intl.formatMessage({id: "ticket.workflow.state.participantType.applicant"}),
                "value": -2
              }
            ]
          }
          const requestParams: handlerRequest.RemoteSelectSearchParams = {
            option: {
              label: "name",
              value: "id"
            },
            params: {},
            request: queryGroupList
          }

          if (params.participant && params.participantType && !params.keyWords) {
            requestParams.params.filter = `id=${params.participant}`
            switch (params.participantType) {
              case 1:
                requestParams.option.label = "username"
                requestParams.request = queryUserList
                break;
              case 2:
                requestParams.option.label = "name"
                break;
            }
            return await RemoteRequestSelectSearch(requestParams)
          }

          if (!params.participantType) {
            return []
          }

          if (params.participantType === 0 || searchParticipant === "" ){
            return []
          }

          switch (params.participantType) {
            case 1:
              requestParams.request = queryUserList
              requestParams.option.label = "username"
              break;
          }

          requestParams.params["filter"] = `${requestParams.option.label}=${searchParticipant}`
          return await RemoteRequestSelectSearch(requestParams)
        }
      },
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.state.participant'})
      }
    },
    {
      name: "currentFormFieldStateSet",
      label: intl.formatMessage({id: 'ticket.workflow.state.formState'}),
      component: Flex,
      type: 'antd',
      rules: {
        required: true,
        message: intl.formatMessage({id: 'ticket.workflow.state.formState'})
      },
      options: {
        justify: "space-between",
        wrap: "wrap",
        gap: "gap",
        vertical: "vertical"
      },
      element: (
        <>
          {
            formList.map((item, index) => (
              <div key={index} style={{width: 500}}>
                <Flex justify="space-between" gap="large">
                  <div key={`label-parent-${index}`} style={{padding: 4}}>
                    <div key={`label-field-${index}`} style={{fontWeight: "bold"}}>字段名</div>
                    <div key={`label-field-value-${index}`}>{item.fieldLabel}</div>
                  </div>
                  <div key={`field-parent-key-${index}`} style={{padding: 4}}>
                    <div key={`field-key-${index}`} style={{fontWeight: "bold"}} >字段值</div>
                    <div key={`field-key-value-${index}`} >{item.fieldKey}</div>
                  </div>
                  <div>
                    <div key={`status-parent-${index}`} style={{fontWeight: "bold"}}  >状态</div>
                    <div key={`status-radio-group-${index}`}>
                      <ProFormRadio.Group
                        rules={[{required: true, message: "请选择当前节点字段的属性"}]}
                        name={`form-${item.fieldKey}-${item.fieldType}`}
                        options={formFieldStateOption}/>
                    </div>
                  </div>
                </Flex>
              </div>
            ))
          }
        </>
      )
    },
    {
      name: "webhook",
      label: intl.formatMessage({id: 'ticket.workflow.state.webhook'}),
      placeholder: intl.formatMessage({id: 'ticket.workflow.state.webhook'}),
      component: ProFormText,
      width: "xl",
      options: {},
      rules: {
        required: false,
        message: intl.formatMessage({id: 'ticket.workflow.state.webhook'})
      }
    },
  ]
}

export const ProModelUpdateFormItems = (workflow: any, record: TicketResponse.WorkflowNodeStateInfo, formList: TicketResponse.WorkflowCustomFormInfo[], proModalUpdateRef: any) => {
  return ProModelCreateFormItems(workflow, record, formList, proModalUpdateRef)
}
