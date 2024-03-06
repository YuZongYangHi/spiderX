export const SelectRemoteSearch = async (params: object, request: any, label: string, value: string) => {
  let searchStr = ""
  if (Object.keys(params).length > 0 ) {
    Object.keys(params).forEach(key => {
      searchStr += `${key}=${params[key]}&`;
    })
  }
  const p = searchStr.substr(0, searchStr.lastIndexOf('&'))
  const combinationParams = {}
  if (p !== "") {
    combinationParams.filter = p
  }
  const result = await request(combinationParams)
  if (!result.success) {
    return []
  }

  return result.data.list.map(item => {
    return {
      label: item[label],
      value: item[value]
    }
  })
}
