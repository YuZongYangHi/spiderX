declare namespace ProModal {
  type Params = {
    title: string;
    width: "500px" | string;
    params: any[] | [];
    initialValues: any;
    handleOnCancel: () => void;
    valueIsValid: (value: any) => boolean;
    request: (...string, value: any) => Promise<API.Response<null> | undefined>;
    formItems: ProForm.columns[];
    successMessage: string;
    errorMessage: string;
    layout: "horizontal";
    extra: object;
    action?: string;
    transform?: (values) => object;
  }
}
