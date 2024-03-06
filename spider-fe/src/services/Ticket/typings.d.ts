declare namespace TicketRequest {

  type CreateProduct = {
    name: string;
    icon: string;
    allowedVisibilityGroups: string;
    description: string;
  }

  type UpdateProduct = {
    icon: string;
    allowedVisibilityGroups: string;
    description: string;
  }

  type FilterProduct = {
    name: string;
  }

  type FilterFlowLogInfo = {
    id: number;
    stateName: string;
    recordId: number;
  }

  type CreateCategory = {
    name: string;
    icon: string;
    allowedVisibilityGroups: string;
    description: string;
    categoryId: number;
    snRuleIdentifier: string;
    webhookURL: string;
  }

  type UpdateCategory = {
    icon: string;
    allowedVisibilityGroups: string;
    description: string;
    webhookURL: string;
  }

  type FilterCategory = {
    allowedVisibilityGroups: string;
    name: string;
    snRuleIdentifier: string;
  }

  type FilterWorkflowHelper = {
    name: string;
  }

  type CreateWorkflowHelper = {
    name: string;
    url: string;
    categoryId: number;
    description: string;
  }

  type UpdateWorkflowHelper = {
    name: string;
    url: string;
    description: string;
  }

  type CreateWorkflowNodeState = {
    stateName: string;
    priority: number;
    currentFormFieldStateSet: string;
    hiddenState: number;
    participantType: number;
    participant: string;
    webhook: string;
    categoryId: number;
    approvalType: number;
  }

  type UpdateWorkflowNodeState = {
    stateName: string;
    priority: number;
    currentFormFieldStateSet: string;
    hiddenState: number;
    participantType: number;
    participant: string;
    webhook: string;
    approvalType: number;
  }

  type FilterWorkflowNodeState = {
    stateName: string;
    participantType: number;
    hiddenState: number;
    participant: string;
    approvalType: number;
    categoryId: number;
  }

  type CreateWorkflowCustomForm = {
    categoryId: number;
    fieldType: number;
    fieldKey: number;
    fieldLabel: string;
    placeholder: string;
    required: number;
    defaultValue: string;
    remoteURL: string;
    fieldOptions: string;
    priority: number;
  }

  type UpdateWorkflowCustomForm = {
    placeholder: string;
    required: number;
    defaultValue: string;
    remoteURL: string;
    fieldOptions: string;
    priority: number;
  }

  type FilterWorkflowCustomForm = {
    fieldType: number;
    fieldKey: string;
    fieldLabel: string;
  }

  type FilterWorkflowTransition = {
    buttonName: string;
    buttonType: number;
  }

  type CreateWorkflowTransition = {
    buttonName: string;
    buttonType: number;
    currentWorkflowStateId: number;
    targetWorkflowStateId: number;
    categoryId: number;
  }

  type UpdateWorkflowTransition = {
    buttonName: string;
    buttonType: number;
    currentWorkflowStateId: number;
    targetWorkflowStateId: number;
  }

  type RecordFilter = {
    sn: string;
    stateId: number;
    categoryId: number;
    status: number;
    creator: string;
  }
}

declare namespace TicketResponse {
  type ProductInfo = {
    id: number;
    name: string;
    icon: string;
    allowedVisibilityGroups: string;
    creator: string;
    description: string;
    createTime: string;
    updateTime: string;
    groups: GroupResponse.GroupInfo[];
  }

  type CategoryInfo = {
    id: number;
    name: string;
    icon: string;
    allowedVisibilityGroups: string;
    layout: string;
    creator: string;
    description: string;
    createTime: string;
    updateTime: string;
    webhookURL: string;
    categoryId: number;
    snRuleIdentifier: string;
    product: ProductInfo;
  }

  type WorkflowWikiInfo = {
    id: number;
    name: string;
    url: string;
    categoryId: number;
    workflow: WorkflowInfo;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  type WorkflowNodeStateInfo = {
    id: number;
    stateName: string;
    priority: number;
    currentFormFieldStateSet: string;
    hiddenState: number;
    participantType: number;
    participant: string;
    webhookURL: string;
    categoryId: number;
    approvalType: number;
    creator: string;
    createTime: string;
    updateTime: string;
    participants: any[];
    workflow: WorkflowInfo;
  }

  type WorkflowCustomFormInfo = {
    id: number;
    categoryId: number;
    category: CategoryInfo;
    fieldType: number;
    fieldKey: number;
    fieldLabel: string;
    placeholder: string;
    required: number;
    defaultValue: string;
    remoteURL: string;
    fieldOptions: string;
    priority: number;
    width: string;
    rowMargin: number;
  }

  type WorkflowTransitionInfo = {
    id: number;
    buttonName: string;
    buttonType: string;
    currentWorkflowStateId: number;
    targetWorkflowStateId: number;
    categoryId: number;
    workflow: WorkflowInfo;
    srcState: WorkflowNodeStateInfo;
    targetState: WorkflowNodeStateInfo;
    creator: string;
    createTime: string;
    updateTime: string;
  }

  type AddTicketRecordResponseInfo = {
    sn: string;
    approver: string;
    nodeName: string;
  }

  type RecordInfo = {
    id: number;
    sn: string;
    state: WorkflowNodeStateInfo;
    categoryId: number;
    category: CategoryInfo;
    status: number;
    createTime: string;
    updateTime: string;
    creator: string;
    participants: any[];
  }

  type flowLogInfo = {
    id: number;
    approver: string;
    recordId: number;
    record: RecordInfo;
    status: string;
    approvalStatus: string;
    nodePriority: number;
    workflowNode: string;
    handleDuration: string;
    suggestion: string;
    createTime: string;
    updateTime: string;
  }

  type RecordForm = {
    id: number;
    recordId: number;
    record: RecordInfo;
    fieldType: number;
    fieldKey: string;
    fieldLabel: string;
    fieldValue: string;
  }

  type nodeFormItemState = {
    fieldKey: string;
    fieldValue: number;
    fieldType: string;
  }

  type commentInfo = {
    id: number;
    recordId: number;
    record: RecordInfo;
    userId: number;
    user: UserResponse.UserInfo;
    content: string;
    currentState: string;
    createTime: string;
    updateTime: string;
  }
}

