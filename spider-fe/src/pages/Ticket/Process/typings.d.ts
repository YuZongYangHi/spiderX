declare namespace ProcessParams {
  type Step = {
    record: TicketResponse.RecordInfo;
    nodeStateList: TicketResponse.WorkflowNodeStateInfo[];
    flowLogList: TicketResponse.flowLogInfo[]
  }

  type Description = {
    record: TicketResponse.RecordInfo;
    formList: TicketResponse.RecordForm[];
    getCurrentNodeFieldState: (fieldKey: string, fieldType: string) => number;
  }

  type Form = {
    record: TicketResponse.RecordInfo;
    formValueList: TicketResponse.RecordForm[]
    discard: any
    getCurrentNodeFieldState: (fieldKey: string, fieldType: string) => number;
  }

  type Transition = {
    record: TicketResponse.RecordInfo;
    user?: UserResponse.UserInfo;
    formValueList: TicketResponse.RecordForm[]
    display: string;
    discard: any
  }

  type FlowLog = {
    record: TicketResponse.RecordInfo;
    flowLogList: TicketResponse.flowLogInfo[]
  }

  type Comment = {
    record: TicketResponse.RecordInfo;
    user?: UserResponse.UserInfo;
  }
}
