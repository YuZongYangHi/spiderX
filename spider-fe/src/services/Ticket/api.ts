import {request} from 'umi';

export async function retrieveTicketProduct(id: number) {
  return request<API.Response<TicketResponse.ProductInfo>>(`/api/v1/ticket/engine/product/${id}`, {
    method: "GET"
  })
}

export async function listTicketProduct(params: TicketRequest.FilterProduct) {
  return request<API.Response<TicketResponse.ProductInfo[]>>(`/api/v1/ticket/engine/product`, {
    method: "GET",
    params
  })
}

export async function destroyTicketProduct(id: number) {
  return request<API.Response<null>>(`/api/v1/ticket/engine/product/${id}`, {
    method: "DELETE"
  });
}

export async function updateTicketProduct(id: number, data: TicketRequest.UpdateProduct) {
  return request<API.Response<TicketResponse.ProductInfo>>(`/api/v1/ticket/engine/product/${id}`, {
    method: "PUT",
    data
  });
}


export async function createTicketProducty(data: TicketRequest.CreateProduct) {
  return request<API.Response<TicketResponse.ProductInfo>>("/api/v1/ticket/engine/product", {
    method: "POST",
    data
  })
}

/*
  ticket category
 */
export async function retrieveTicketCategory(id: number) {
  return request<API.Response<TicketResponse.CategoryInfo>>(`/api/v1/ticket/engine/category/${id}`, {
    method: "GET"
  })
}

export async function listTicketCategoryByProductId(productId: number, params: TicketRequest.FilterCategory) {
  return request<API.Response<TicketResponse.CategoryInfo[]>>(`/api/v1/ticket/engine/product/${productId}/category`, {
    method: "GET",
    params
  })
}

export async function destroyTicketCategory(id: number) {
  return request<API.Response<null>>(`/api/v1/ticket/engine/category/${id}`, {
    method: "DELETE"
  });
}

export async function updateTicketCategory(id: number, data: TicketRequest.UpdateCategory) {
  return request<API.Response<TicketResponse.CategoryInfo>>(`/api/v1/ticket/engine/category/${id}`, {
    method: "PUT",
    data
  });
}


export async function createTicketCategory(data: TicketRequest.CreateCategory) {
  return request<API.Response<TicketResponse.CategoryInfo>>("/api/v1/ticket/engine/category", {
    method: "POST",
    data
  })
}

export async function listTicketCategory(params: TicketRequest.FilterCategory) {
  return request<API.Response<TicketResponse.CategoryInfo[]>>(`/api/v1/ticket/engine/category`, {
    method: "GET",
    params
  })
}

/*
  ticket workflow helper
 */
export async function retrieveTicketWorkflowWiki(id: number) {
  return request<API.Response<TicketResponse.WorkflowWikiInfo>>(`/api/v1/ticket/engine/category/document/${id}`, {
    method: "GET"
  })
}

export async function listTicketWorkflowWikiByWorkflowId(categoryId: number, params: TicketRequest.FilterCategory) {
  return request<API.Response<TicketResponse.WorkflowWikiInfo[]>>(`/api/v1/ticket/engine/category/${categoryId}/document`, {
    method: "GET",
    params
  })
}

export async function destroyTicketWorkflowWiki(id: number) {
  return request<API.Response<null>>(`/api/v1/ticket/engine/category/document/${id}`, {
    method: "DELETE"
  });
}

export async function updateTicketWorkflowWiki(id: number, data: TicketRequest.UpdateWorkflowHelper) {
  return request<API.Response<TicketResponse.WorkflowWikiInfo>>(`/api/v1/ticket/engine/category/document/${id}`, {
    method: "PUT",
    data
  });
}


export async function createTicketWorkflowWiki(data: TicketRequest.CreateWorkflowHelper) {
  return request<API.Response<TicketResponse.WorkflowWikiInfo>>("/api/v1/ticket/engine/category/document", {
    method: "POST",
    data
  })
}

/*
  ticket workflow node state
 */

export async function retrieveTicketWorkflowNodeState(id: number) {
  return request<API.Response<TicketResponse.WorkflowNodeStateInfo>>(`/api/v1/ticket/engine/workflow/state/${id}`, {
    method: "GET"
  })
}

export async function listTicketWorkflowNodeStateByWorkflowId(workflowId: number, params: TicketRequest.FilterWorkflowNodeState) {
  return request<API.Response<TicketResponse.WorkflowNodeStateInfo[]>>(`/api/v1/ticket/engine/category/${workflowId}/state`, {
    method: "GET",
    params
  })
}

export async function listTicketWorkflowNodeStat(params: TicketRequest.FilterWorkflowNodeState) {
  return request<API.Response<TicketResponse.WorkflowNodeStateInfo[]>>(`/api/v1/ticket/engine/workflow/state`, {
    method: "GET",
    params
  })
}

export async function destroyTicketWorkflowNodeState(id: number) {
  return request<API.Response<null>>(`/api/v1/ticket/engine/workflow/state/${id}`, {
    method: "DELETE"
  });
}

export async function updateTicketWorkflowNodeState(id: number, data: TicketRequest.UpdateWorkflowHelper) {
  return request<API.Response<TicketResponse.WorkflowNodeStateInfo>>(`/api/v1/ticket/engine/workflow/state/${id}`, {
    method: "PUT",
    data
  });
}


export async function createTicketWorkflowNodeState(data: TicketRequest.CreateWorkflowHelper) {
  return request<API.Response<TicketResponse.WorkflowNodeStateInfo>>("/api/v1/ticket/engine/workflow/state", {
    method: "POST",
    data
  })
}

/*
  ticket workflow custom form
 */
export async function retrieveTicketWorkflowCustomForm(id: number) {
  return request<API.Response<TicketResponse.WorkflowCustomFormInfo>>(`/api/v1/ticket/engine/workflow/customForm/${id}`, {
    method: "GET"
  })
}

export async function listTicketWorkflowCustomFormByWorkflowId(workflowId: number, params: TicketRequest.FilterWorkflowCustomForm) {
  return request<API.Response<TicketResponse.WorkflowCustomFormInfo[]>>(`/api/v1/ticket/engine/category/${workflowId}/customForm`, {
    method: "GET",
    params
  })
}

export async function destroyTicketWorkflowCustomForm(id: number) {
  return request<API.Response<null>>(`/api/v1/ticket/engine/workflow/customForm/${id}`, {
    method: "DELETE"
  });
}

export async function updateTicketWorkflowCustomForm(id: number, data: TicketRequest.UpdateWorkflowCustomForm) {
  return request<API.Response<TicketResponse.WorkflowCustomFormInfo>>(`/api/v1/ticket/engine/workflow/customForm/${id}`, {
    method: "PUT",
    data
  });
}


export async function createTicketWorkflowCustomForm(data: TicketRequest.CreateWorkflowCustomForm) {
  return request<API.Response<TicketResponse.WorkflowCustomFormInfo>>("/api/v1/ticket/engine/workflow/customForm", {
    method: "POST",
    data
  })
}

/*
  ticket workflow transition
 */
export async function retrieveTicketWorkflowTransition(id: number) {
  return request<API.Response<TicketResponse.WorkflowTransitionInfo>>(`/api/v1/ticket/engine/workflow/transition/${id}`, {
    method: "GET"
  })
}

export async function listTicketWorkflowTransitionByWorkflowId(workflowId: number, params: TicketRequest.FilterWorkflowTransition) {
  return request<API.Response<TicketResponse.WorkflowTransitionInfo[]>>(`/api/v1/ticket/engine/category/${workflowId}/transition`, {
    method: "GET",
    params
  })
}

export async function destroyTicketWorkflowTransition(id: number) {
  return request<API.Response<null>>(`/api/v1/ticket/engine/workflow/transition/${id}`, {
    method: "DELETE"
  });
}

export async function updateTicketWorkflowTransition(id: number, data: TicketRequest.UpdateWorkflowTransition) {
  return request<API.Response<TicketResponse.WorkflowTransitionInfo>>(`/api/v1/ticket/engine/workflow/transition/${id}`, {
    method: "PUT",
    data
  });
}


export async function createTicketWorkflowTransition(data: TicketRequest.CreateWorkflowTransition) {
  return request<API.Response<TicketResponse.WorkflowTransitionInfo>>("/api/v1/ticket/engine/workflow/transition", {
    method: "POST",
    data
  })
}


/*
  ticket product users
 */
export async function findProductList() {
  return request<API.Response<TicketResponse.ProductInfo[]>>(`/api/v1/ticket/product`, {
    method: "GET"
  })
}

export async function findCategoryListByProductId(productId: number) {
  return request<API.Response<TicketResponse.CategoryInfo[]>>(`/api/v1/ticket/product/${productId}/category`, {
    method: "GET"
  })
}

export async function findCategoryDocumentListByCategoryId(categoryId: number) {
  return request<API.Response<TicketResponse.CategoryInfo>>(`/api/v1/ticket/category/${categoryId}/document`, {
    method: "GET"
  })
}

export async function findCustomFormByCategoryId(categoryId: number) {
  return request<API.Response<TicketResponse.WorkflowCustomFormInfo[]>>(`/api/v1/ticket/category/${categoryId}/customForm`, {
    method: "GET"
  })
}

/*
  ticket  record
 */

export async function createTicketRecord(categoryId:number, data: any)  {
  return request<API.Response<TicketResponse.AddTicketRecordResponseInfo>>(`/api/v1/ticket/category/${categoryId}/record`, {
    method: "POST",
    data
  })
}

export async function updateTicketRecord(approvalType: string, categoryId:number, sn: string, data: any, suggestion: string)  {
  return request<API.Response<TicketResponse.AddTicketRecordResponseInfo>>(`/api/v1/ticket/category/${categoryId}/record/${sn}?approvalType=${approvalType}&suggestion=${suggestion}`, {
    method: "PUT",
    data
  })
}

export async function queryTicketTodoRecordList(params: TicketRequest.RecordFilter) {
  return request<API.Response<TicketResponse.RecordInfo>>(`/api/v1/ticket/record/todo/list`, {
    method: "GET",
    params
  })
}

export async function queryTicketDoneRecordList(params: TicketRequest.RecordFilter) {
  return request<API.Response<TicketResponse.RecordInfo>>(`/api/v1/ticket/record/done/list`, {
    method: "GET",
    params
  })
}

export async function queryTicketApplyRecordList(params: TicketRequest.RecordFilter) {
  return request<API.Response<TicketResponse.RecordInfo>>(`/api/v1/ticket/record/apply/list`, {
    method: "GET",
    params
  })
}

export async function destroyRecord(id: number) {
  return request<API.Response<null>>(`/api/v1/ticket/record/${id}`, {
    method: "DELETE"
  });
}

export async function discardRecord(sn: string) {
  return request<API.Response<TicketResponse.RecordInfo>>(`/api/v1/ticket/record/${sn}/discard`, {
    method: "PUT"
  });
}

export async function queryUserHasTicketRecordPermissions(sn: string) {
  return request<API.Response<boolean>>(`/api/v1/ticket/record/${sn}/hasPermissions`, {
      method: "GET",
    })
}


export async function retrieveRecord(sn: string) {
  return request<API.Response<TicketResponse.RecordInfo>>(`/api/v1/ticket/record/${sn}`, {
    method: "GET",
  })
}

export async function listRecordNodeStateBySn(sn: string) {
  return request<API.Response<TicketResponse.WorkflowNodeStateInfo[]>>(`/api/v1/ticket/record/${sn}/nodeState/list`, {
    method: "GET",
  })
}

export async function listTicketRecordFlowLogsByRecordId(recordId: number, params: any) {
  return request<API.Response<TicketResponse.flowLogInfo[]>>(`/api/v1/ticket/record/${recordId}/flowLogs`, {
    method: "GET",
    params
  })
}

export async function GetTicketRecordUrge(recordSn: string, nodeStateId: number) {
  return request<API.Response<null>>(`/api/v1/ticket/record/${recordSn}/${nodeStateId}/urge`, {
    method: "GET",
  })
}

export async function SendTicketRecordUrge(recordSn: string, nodeStateId: number) {
  return request<API.Response<null>>(`/api/v1/ticket/record/${recordSn}/${nodeStateId}/urge`, {
    method: "PUT",
  })
}

export async function GetRecordCurrentNodeApprovalButton(sn: string) {
  return request<API.Response<TicketResponse.WorkflowTransitionInfo[]>>(`/api/v1/ticket/record/${sn}/transition`, {
    method: "GET",
  })
}

export async function listRecordForm(sn: string) {
  return request<API.Response<TicketResponse.RecordForm[]>>(`/api/v1/ticket/record/${sn}/form`, {
    method: "GET",
  })
}

export async function addTicketRecordComment(sn: string, data: any)  {
  return request<API.Response<TicketResponse.commentInfo>>(`/api/v1/ticket/record/${sn}/comment`, {
    method: "POST",
    data
  })
}



export async function listTicketRecordComment(sn:string)  {
  return request<API.Response<TicketResponse.commentInfo[]>>(`/api/v1/ticket/record/${sn}/comment`, {
    method: "GET"
  })
}

