export const workflowFormFieldTypeConvert = {
  1: {
    text: "字符串",
  },
  2: {
    text: "整数",
  },
  3: {
    text: "日期范围",
  },
  4: {
    text: "开关",
  },
  5: {
    text: "日期",
  },
  6: {
    text: "日期时间",
  },
  7: {
    text: "单选",
  },
  8: {
    text: "多选",
  },
  9: {
    text: "下拉",
  },
  10: {
    text: "多选下拉",
  },
  11: {
    text: "文本域",
  },
  12: {
    text: "远程搜索",
  },
  13: {
    text: "用户搜索",
  },
  14: {
    text: "用户组搜索",
  }
}

export const workflowFormRequiredConvert = {
  1: {
    text: "是"
  },
  2: {
    text: "否"
  }
}

export const workflowStateParticipant = {
  1: {
    text: "用户"
  },
  2: {
    text: "用户组"
  },
  3: {
    text: "无需处理"
  },
  4: {
    text: "发起人"
  }
}

export const workflowStateHiddenState = {
  1: {
    text: "显示",
    color: "green"
  },
  2: {
    text: "隐藏",
    color: "warning"
  }
}

export const workflowStateApprovalType = {
  1: {
    text: "人工审批",
    status: "warning"
  },
  2: {
    text: "自动通过",
    status: "success"
  },
  3: {
    text: "自动拒绝",
    status: "error"
  },
  4: {
    text: "无需审批",
    status: "success"
  }
}

export const workflowTransitionType = {
  "agree": {
    text: "同意",
    status: "success"
  },
  "reject": {
    text: "拒绝",
    status: "error"
  },
  "cancel": {
    text: "废弃",
    status: "warning"
  }
}

export const ticketRecordStatusType = {
  0: {
    text: "流程中",
    status: "processing"
  },
  1: {
    text: "已完结",
    status: "success"
  },
  2: {
    text: "废弃",
    status: "warning"
}
}

export default {
  "ticket.workflow.form.fieldType": workflowFormFieldTypeConvert,
  "ticket.workflow.form.required": workflowFormRequiredConvert,
  "ticket.workflow.state.participant": workflowStateParticipant,
  "ticket.workflow.state.hiddenState": workflowStateHiddenState,
  "ticket.workflow.state.approvalType": workflowStateApprovalType,
  "ticket.workflow.transition.type": workflowTransitionType,
  "ticket.record.status": ticketRecordStatusType
}
