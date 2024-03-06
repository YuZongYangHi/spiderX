declare namespace handlerRequest {
  type SelectOption = {
    label: string;
    value: any;
  };
  type RemoteSelectSearchParams = {
    option: SelectOption;
    params: object;
    request: any;
  }
}
