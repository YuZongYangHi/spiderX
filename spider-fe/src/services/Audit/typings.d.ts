declare namespace AuditRequest {}

declare namespace AuditResponse {
  type OperateLog = {
    id: number;
    username: string;
    type: number;
    srcData: string;
    targetData: string;
    diffData: string;
    datetime: string;
    createTime: string;
    updateTime: string;
  }

  type AuditUserLoginInfo = {
    id: number;
    username: string;
    type: number;
    createTime: string;
    updateTime: string;
  }
}
