const meishijieDb = require('../../db/meishijie')

exports.getCategoryList = async (req, res, next) => {
  try {
    const { page, pageSize, categoryName } = req.query
    const [list, [{ total: totalCount }]] = await Promise.all([
      meishijieDb.query(
        'select * from recipe_ingredient_category_list where category_name like ? order by id desc limit ?,?',
        [
          `%${categoryName}%`,
          parseInt((page - 1) * pageSize),
          parseInt(pageSize)
        ]
      ),
      meishijieDb.query(
        'select count(*) as total from recipe_ingredient_category_list'
      )
    ])
    res.json({
      code: '200',
      data: { list, totalCount }
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
      'update recipe_ingredient_category_list set category_name=? where id=?',
      [categoryName, id]
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
      affectRows
    } = await meishijieDb.query(
      'delete from recipe_ingredient_category_list where id in ?',
      [[idList]]
    )
    if (affectRows < 1) {
      return res.json({ code: '-1', message: '批量删除分类失败' })
    }
    res.json({ code: '200', message: '批量删除分类成功' })
  } catch (err) {
    next(err)
  }
}
