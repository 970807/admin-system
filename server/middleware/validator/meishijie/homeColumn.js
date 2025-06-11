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

exports.addTodayHotVideoRecipe = (req, res, next) => {
  const { recipeIdList } = req.body
  if (!Array.isArray(recipeIdList)) {
    return res.json({ code: -1, message: '参数recipeIdList不能为空' })
  }
  next()
}

exports.updateTodayHotVideoRecipeSortNo = (req, res, next) => {
  const { id, sortNo } = req.body
  if (!id) {
    return res.json({ code: -1, message: '参数id不能为空' })
  }
  if (!sortNo && sortNo !== 0) {
    return res.json({ code: -1, message: '参数sortNo不能为空' })
  }
  next()
}

exports.deleteTodayHotVideoRecipe = (req, res, next) => {
  const { idList } = req.body
  if (!idList) {
    return res.json({ code: -1, message: '参数idList不能为空' })
  }
  next()
}

exports.addTodayHotSearch = (req, res, next) => {
  const { keyword } = req.body
  if (!keyword) {
    return res.json({ code: -1, message: '关键词不能为空' })
  }
  next()
}

exports.updateTodayHotSearchSortNo = (req, res, next) => {
  const { id, sortNo } = req.body
  if (!id) {
    return res.json({ code: -1, message: 'id不能为空' })
  }
  if (!sortNo && sortNo !== 0) {
    return res.json({ code: -1, message: '参数sortNo不能为空' })
  }
  next()
}

exports.deleteTodayHotSearch = (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return res.json({ code: -1, message: 'id不能为空' })
  }
  next()
}

exports.getTodayThreeMealsList = (req, res, next) => {
  const { type } = req.query
  if (!type) {
    return res.json({ code: -1, message: '参数type不能为空' })
  }
  next()
}

exports.addTodayThreeMeals = (req, res, next) => {
  const { type, recipeIdList } = req.body
  if (!type) {
    return res.json({ code: -1, message: '参数type不能为空' })
  }
  if (
    !['breakfast', 'lunch', 'afternoonTea', 'dinner', 'nightSnack'].includes(
      type
    )
  ) {
    // 三餐类型 breakfast：早餐 lunch：午餐 afternoonTea：下午茶 dinner：晚餐 nightSnack：夜宵
    return res.json({
      code: -1,
      message:
        'type类型不正确，breakfast：早餐 lunch：午餐 afternoonTea：下午茶 dinner：晚餐 nightSnack：夜宵'
    })
  }
  if (!recipeIdList) {
    return res.json({ code: -1, message: '参数recipeIdList不能为空' })
  }
  next()
}

exports.updateTodayThreeMealsSortNo = (req, res, next) => {
  const { id, sortNo } = req.body
  if (!id) {
    return res.json({ code: -1, message: 'id不能为空' })
  }
  if (!sortNo && sortNo !== 0) {
    return res.json({ code: -1, message: '参数sortNo不能为空' })
  }
  next()
}

exports.deleteTodayThreeMeals = (req, res, next) => {
  const { idList } = req.body
  if (!idList) {
    return res.json({ code: -1, message: 'id不能为空' })
  }
  next()
}

exports.getColumnRecipeList = (req, res, next) => {
  const { columnId } = req.params
  if (!columnId) {
    return res.json({ code: -1, message: 'id不能为空' })
  }
  next()
}

exports.addColumnRecipe = (req, res, next) => {
  const { columnId, recipeIdList } = req.body
  if (!columnId) {
    return res.json({ code: -1, message: 'columnId不能为空' })
  }
  if (!recipeIdList) {
    return res.json({ code: -1, message: '参数recipeIdList不能为空' })
  }
  next()
}

exports.updateColumnRecipeSortNo = (req, res, next) => {
  const { id, sortNo } = req.body
  if (!id) {
    return res.json({ code: -1, message: 'id不能为空' })
  }
  if (!sortNo && sortNo !== 0) {
    return res.json({ code: -1, message: '参数sortNo不能为空' })
  }
  next()
}

exports.deleteColumnRecipe = (req, res, next) => {
  const { idList } = req.body
  if (!idList) {
    return res.json({ code: -1, message: 'id不能为空' })
  }
  next()
}
