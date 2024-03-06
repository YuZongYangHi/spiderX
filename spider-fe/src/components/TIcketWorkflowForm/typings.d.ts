declare namespace TicketWorkflowForm {
  type T = {
    IsValid?: (values) => boolean;
    TransForm?: (values) => any;
    data: TicketResponse.WorkflowCustomFormInfo[];
    initialValues: object;
    fetch: any;
    params?: any[];
    successTitle: string;
    backTitle?: boolean
    onFinish?: (values)
    formAttributes?: object;
    formItemFunc?: (value: TicketResponse.WorkflowCustomFormInfo) => object
  }
}
