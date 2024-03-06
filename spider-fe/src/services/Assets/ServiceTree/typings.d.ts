
declare namespace ServiceTreeRequest {}

declare namespace ServiceTreeResponse {
  type TreeInfo = {
    id: number;
    name: string;
    level: number;
    parentId: number;
    fullNamePath: string;
    fullIdPath: string;
    createTime: string;
    updateTime: string;
  }
}
