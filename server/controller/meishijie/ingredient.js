const meishijieDb = require('../../db/meishijie')
const getList = require('../../utils/getList')

exports.getCategoryList = async (req, res, next) => {
  getList({
    req,
    res,
    next,
    db: meishijieDb,
    dbTable: 'recipe_ingredient_category_list',
    likeSearchFieldArr: [{ reqField: 'categoryName', dbField: 'category_name' }]
  })
}

exports.getAllCategoryList = async (req, res, next) => {
  try {
    const list = await meishijieDb.query(
      'select * from recipe_ingredient_category_list order by id desc'
    )
    res.json({
      code: '200',
      data: { list }
    })
  } catch (err) {
    next(err)
  }
}

exports.addCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body
    const d = new Date()
    const {
      insertId: id
    } = await meishijieDb.query(
      'insert into recipe_ingredient_category_list set ?',
      { categoryName, createTime: d, updateTime: d }
    )
    res.json({
      code: '200',
      message: '添加分类成功',
      data: { id, categoryName }
    })
  } catch (err) {
    next(err)
  }
}

exports.editCategory = async (req, res, next) => {
  try {
    const { id, categoryName } = req.body
    const {
      changedRows
    } = await meishijieDb.query(
      'update recipe_ingredient_category_list set category_name=?,update_time=? where id=?',
      [categoryName, new Date(), id]
    )
    if (changedRows < 1) {
      return res.json({ code: '-1', message: '修改分类失败' })
    }
    res.json({
      code: '200',
      message: '修改分类成功',
      data: { id, categoryName }
    })
  } catch (err) {
    next(err)
  }
}

exports.batchDeleteCategory = async (req, res, next) => {
  try {
    const { idList } = req.body
    const {
      affectedRows
    } = await meishijieDb.query(
      'delete from recipe_ingredient_category_list where id in ?',
      [[idList]]
    )
    if (affectedRows < 1) {
      return res.json({ code: '-1', message: '批量删除分类失败' })
    }
    res.json({ code: '200', message: '批量删除分类成功' })
  } catch (err) {
    next(err)
  }
}

exports.getIngredientList = async (req, res, next) => {
  getList({
    req,
    res,
    next,
    db: meishijieDb,
    dbTable: 'recipe_ingredient_list',
    likeSearchFieldArr: [
      { reqField: 'ingredientName', dbField: 'ingredient_name' }
    ]
  })
}

exports.addIngredient = async (req, res, next) => {
  try {
    const { categoryId, ingredientName } = req.body
    const d = new Date()
    const { insertId: id } = await meishijieDb.query(
      'insert into recipe_ingredient_list set ?',
      {
        categoryId,
        ingredientName,
        createTime: d,
        updateTime: d
      }
    )
    res.json({
      code: '200',
      message: '添加食材成功',
      data: { id, categoryId, ingredientName }
    })
  } catch (err) {
    next(err)
  }
}

exports.editIngredient = async (req, res, next) => {
  try {
    const { id, categoryId, ingredientName } = req.body
    const {
      changedRows
    } = await meishijieDb.query(
      'update recipe_ingredient_list set category_id=?, ingredient_name=?, update_time=? where id=?',
      [categoryId, ingredientName, new Date(), id]
    )
    if (changedRows < 1) {
      return res.json({ code: '-1', message: '修改食材失败' })
    }
    res.json({
      code: '200',
      message: '修改食材成功',
      data: { id, categoryId, ingredientName }
    })
  } catch (err) {
    next(err)
  }
}

exports.batchDeleteIngredient = async (req, res, next) => {
  try {
    const { idList } = req.body
    const {
      affectedRows
    } = await meishijieDb.query(
      'delete from recipe_ingredient_list where id in ?',
      [[idList]]
    )
    if (affectedRows < 1) {
      return res.json({ code: '-1', message: '批量删除食材失败' })
    }
    res.json({ code: '200', message: '批量删除食材成功' })
  } catch (err) {
    next(err)
  }
}
