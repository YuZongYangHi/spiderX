export const buildTree = (items: ServiceTreeResponse.TreeInfo[], pid = 0) => {
  let pItems = items.filter(s => s.parentId === pid)
  if (!pItems || pItems.length <= 0)
    return null

  let design = []
  pItems.forEach(item => {
    design.push({
      title: item.name,
      id: item.id,
      name: item.name,
      level: item.level,
      parentId: item.parentId,
      fullNamePath: item.fullNamePath,
      fullIdPath: item.fullIdPath,
      createTime: item.createTime,
      updateTime: item.updateTime,
    })
  })
  design.forEach(item => {
    const res = buildTree(items, item.id)
    if (res && res.length > 0)
      item.children = [...res]
  })
  return [...design]
}
