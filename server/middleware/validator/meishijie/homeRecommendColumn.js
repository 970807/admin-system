exports.getColumnDetail = (req, res, next) => {
  const { id } = req.query
  if (!id) {
    return res.json({ code: '-1', message: '栏目id为空' })
  }
  next()
}

exports.addColumn = (req, res, next) => {
  const { columnTitle, showRecipeCount, recipeList } = req.body
  if (!columnTitle) {
    return res.json({ code: '-1', message: '请输入栏目标题' })
  }
  if (!showRecipeCount) {
    return res.json({ code: '-1', message: '请输入栏目显示个数' })
  }
  if (!Array.isArray(recipeList) || !recipeList.length) {
    return res.json({ code: '-1', message: '请添加菜谱' })
  }
  next()
}

exports.editColumn = (req, res, next) => {
  const { id, columnTitle, showRecipeCount, recipeList } = req.body
  if (!id) {
    return res.json({ code: '-1', message: 'id字段为必须' })
  }
  if (!columnTitle) {
    return res.json({ code: '-1', message: '请输入栏目标题' })
  }
  if (!showRecipeCount) {
    return res.json({ code: '-1', message: '请输入栏目显示个数' })
  }
  if (!Array.isArray(recipeList) || !recipeList.length) {
    return res.json({ code: '-1', message: '请添加菜谱' })
  }
  next()
}
