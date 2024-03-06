declare namespace ServerForm  {
  type Params = {
    initialValues?: ServerResponse.ServerInfo;
    ValidHandler?: (values: ServerRequest.CreateServer) => boolean;
    request: (serverId?: number, values: ServerRequest.CreateServer) => any;
    title: string;
    handleType: string;
  }
}
