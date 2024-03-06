declare namespace NodeRequest {
  type CreateForm = {
    name: string;
    cnName: string;
    operator: number;
    bandwidth: string;
    region: string;
    city: string;
    status: number;
    attribute: number;
    grade: number;
    comment: string;
    contract: number;
    productLines: number[];
  }
  type UpdateForm = {
    operator: number;
    bandwidth: string;
    region: string;
    city: string;
    status: number;
    attribute: number;
    grade: number;
    comment: string;
    contract: number;
    productLines: number[];
  }

  type UpdateStatus = {
    status: number;
  }
}

declare namespace NodeResponse {
  type NodeInfo = {
    id: number;
    name: string;
    cnName: string;
    operator: number;
    bandwidth: string;
    region: string;
    province: string;
    status: number;
    creator: string;
    attribute: number;
    grade: number;
    comment: string;
    contract: number;
    isDeleted: number;
    createTime: string;
    updateTime: string;
    productLines: ServiceTreeResponse.TreeInfo[]
  }

  type ImportInfo = {
    success: number;
    error: number;
  }
}
