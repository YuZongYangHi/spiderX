declare namespace API {
  type ResponseData<T> = {
    current: number;
    pageSize: number;
    total: number;
    list: T
  };

  type Response<T> = {
    success: boolean;
    data: ResponseData<T>;
    errorMessage: string;
  };

  type PageParams = {
    PageNum: number;
    PageSize: number;
  };
}
