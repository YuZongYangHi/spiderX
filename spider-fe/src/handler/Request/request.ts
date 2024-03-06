
export const RemoteRequestSelectSearch = async (T: handlerRequest.RemoteSelectSearchParams):Promise<any[]> => {
  const result = await T.request(T.params);
  if (!result.success) {
    return []
  }
  return result.data.list.map((item: { [x: string]: any; }) => {
    return {
      label: item[T.option.label],
      value: item[T.option.value]
    }
  })
}
