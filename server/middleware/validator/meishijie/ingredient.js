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
