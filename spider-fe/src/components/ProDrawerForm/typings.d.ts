declare namespace ProProDrawerForm {
  type Params = {
    title: string;
    formItems: ProForm.columns[];
    requestParams: any[];
    request: (...string, value: any) => Promise<API.Response<null> | undefined>;
    width: "500px" | string;
    successMessage: string;
    errorMessage: string;
    initialValues: any;
    handleOnCancel: () => void;
  }
}
