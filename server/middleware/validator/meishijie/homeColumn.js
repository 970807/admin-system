exports.addHomeColumn = (req, res, next) => {
  const { columnName, sortNo, available } = req.body
  if (!columnName) {
    return res.json({ code: -1, message: '栏位名称不能为空' })
  }
  if (!sortNo && sortNo !== 0) {
    return res.json({ code: -1, message: '排序值不能为空' })
  }
  if (!available && available !== 0) {
    return res.json({ code: -1, message: '启用状态不能为空' })
  }
  next()
}

exports.editHomeColumn = (req, res, next) => {
  const { id, columnName, sortNo } = req.body
  if (!id) {
    return res.json({ code: -1, message: 'id不能为空' })
  }
  if (!columnName) {
    return res.json({ code: -1, message: '栏位名称不能为空' })
  }
  if (!sortNo && sortNo !== 0) {
    return res.json({ code: -1, message: '排序值不能为空' })
  }
  if (!available && available !== 0) {
    return res.json({ code: -1, message: '启用状态不能为空' })
  }
  next()
}

exports.updateHomeColumnSortNo = (req, res, next) => {
  const { id, sortNo } = req.params
  if (!id) {
    return res.json({ code: -1, message: 'id不能为空' })
  }
  if (!sortNo && sortNo !== 0) {
    return res.json({ code: -1, message: '排序值不能为空' })
  }
  next()
}

exports.batchDeleteHomeColumn = (req, res, next) => {
  const { idList } = req.body
  if (!Array.isArray(idList)) {
    return res.json({ code: -1, message: '参数idList不能为空' })
  }
  next()
}

exports.availableHomeColumn = (req, res, next) => {
  const { available, idList } = req.body
  if (!Array.isArray(idList)) {
    return res.json({ code: -1, message: '参数idList不能为空' })
  }
  if (!available && available !== 0) {
    return res.json({ code: -1, message: '参数available不能为空' })
  }
  next()
}
