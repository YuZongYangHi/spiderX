declare namespace ProProDrawerForm {
  type Params = {
    title: string;
    formItems: ProForm.columns[];
    request: (...string, value: any) => Promise<API.Response<null> | undefined>;
  }
}
