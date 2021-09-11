const meishijieDb = require('../../../db/meishijie')

exports.getCategoryList = (req, res, next) => {
  const { page, pageSize } = req.query
  if (!page) {
    return res.json({ code: '-1', message: '参数page错误' })
  }
  if (!pageSize) {
    return res.json({ code: '-1', message: '参数pageSize错误' })
  }
  next()
}

exports.addCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body
    if (!categoryName) {
      return res.json({ code: '-1', message: '分类名称不能为空' })
    }
    // 验证分类名称是否已存在
    const [{ count }] = await meishijieDb.query(
      'select count(*) as count from recipe_ingredient_category_list where category_name = ?',
      categoryName
    )
    if (count) {
      return res.json({ code: '-1', message: '添加失败，该分类名称已存在' })
    }
    next()
  } catch (err) {
    next(err)
  }
}

exports.editCategory = async (req, res, next) => {
  const { id, categoryName } = req.body
  if (!id) {
    return res.json({ code: '-1', message: '分类id不能为空' })
  }
  if (!categoryName) {
    return res.json({ code: '-1', message: '分类名称不能为空' })
  }
  next()
}

exports.batchDeleteCategory = (req, res, next) => {
  const { idList } = req.body
  if (!idList || !Array.isArray(idList) || idList.length < 1) {
    return res.json({ code: '-1', message: '请选择要删除的分类' })
  }
  next()
}

exports.getIngredientList = (req, res, next) => {
  const { page, pageSize } = req.query
  if (!page) {
    return res.json({ code: '-1', message: '参数page错误' })
  }
  if (!pageSize) {
    return res.json({ code: '-1', message: '参数pageSize错误' })
  }
  next()
}

exports.addIngredient = async (req, res, next) => {
  try {
    const { categoryId, ingredientName } = req.body
    if (typeof categoryId !== 'number') {
      return res.json({ code: '-1', message: '分类id不能为空' })
    }
    if (!ingredientName) {
      return res.json({ code: '-1', message: '食材名称不能为空' })
    }
    // 查找分类是否存在
    const [{ count1 }] = await meishijieDb.query(
      'select count(*) as count1 from recipe_ingredient_category_list where id=?',
      categoryId
    )
    if (count1 < 1) {
      return res.json({ code: '-1', message: '添加失败，分类不存在' })
    }
    // 查找食材名称是否已存在
    const [
      { count2 }
    ] = await meishijieDb.query(
      'select count(*) as count2 from recipe_ingredient_list where ingredient_name=? and category_id=?',
      [ingredientName, categoryId]
    )
    if (count2) {
      return res.json({
        code: '-1',
        message: '添加失败，该分类下的食材名称已存在'
      })
    }
    next()
  } catch (err) {
    next(err)
  }
}

exports.editIngredient = async (req, res, next) => {
  try {
    const { id, categoryId, ingredientName } = req.body
    if (typeof id !== 'number') {
      return res.json({ code: '-1', message: 'id不能为空' })
    }
    if (typeof categoryId !== 'number') {
      return res.json({ code: '-1', message: '分类id不能为空' })
    }
    if (!ingredientName) {
      return res.json({ code: '-1', message: '食材名称不能为空' })
    }
    const promiseList = []
    // 查找id是否存在
    promiseList.push(
      meishijieDb.query(
        'select count(*) as count0 from recipe_ingredient_list where id=?',
        id
      )
    )

    // 查找分类是否存在
    promiseList.push(
      meishijieDb.query(
        'select count(*) as count1 from recipe_ingredient_category_list where id=?',
        categoryId
      )
    )

    // 查找食材名称是否已存在
    promiseList.push(
      meishijieDb.query(
        'select count(*) as count2 from recipe_ingredient_list where ingredient_name=? and category_id=? and id<>?',
        [ingredientName, categoryId, id]
      )
    )

    const [[{ count0 }], [{ count1 }], [{ count2 }]] = await Promise.all(
      promiseList
    )

    if (count0 < 1) {
      return res.json({ code: '-1', message: '修改失败，食材不存在' })
    }

    if (count1 < 1) {
      return res.json({ code: '-1', message: '修改失败，分类不存在' })
    }

    if (count2) {
      return res.json({ code: '-1', message: '修改失败，该食材名称已存在' })
    }
    next()
  } catch (err) {
    next(err)
  }
}

exports.batchDeleteIngredient = (req, res, next) => {
  const { idList } = req.body
  if (!idList || !Array.isArray(idList) || idList.length < 1) {
    return res.json({ code: '-1', message: '请选择要删除的食材' })
  }
  next()
}
