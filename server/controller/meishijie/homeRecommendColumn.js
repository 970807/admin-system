const meishijieDb = require('../../db/meishijie')

const sortAndFormatRecipeListToStr = list => {
  list.sort((a, b) => a.sort - b.sort)
  return list.map(item => `${item.id},${item.sort}`).join(';') + ';'
}

exports.getColumnList = async (req, res, next) => {
  try {
    const { columnTitle } = req.query
    let list = await meishijieDb.query(
      'select * from home_recommend_column_list where column_title like ?',
      `%${columnTitle || ''}%`
    )
    list = list.map(item => {
      const columnRecipeCount = item.recipeListStr
        .slice(0, -1)
        .split(';').length
      return {
        id: item.id,
        columnTitle: item.columnTitle,
        columnRecipeCount
      }
    })
    res.json({ code: 0, list })
  } catch (err) {
    next(err)
  }
}

exports.getColumnDetail = async (req, res, next) => {
  try {
    const { id } = req.query
    const [detail] = await meishijieDb.query(
      'select * from home_recommend_column_list where id=?',
      id
    )
    if (!detail) {
      return res.json({ code: -1, message: '详情获取失败' })
    }
    const recipeIds = []
    detail.recipeList = detail.recipeListStr
      .slice(0, -1)
      .split(';')
      .map(item => {
        const [id, sort] = item.split(',')
        recipeIds.push(id)
        return { id, sort }
      })
    delete detail.recipeListStr
    const recipeMap = await meishijieDb.query(
      'select id,recipe_name from recipe_detail_list where id in (?)',
      [recipeIds]
    )
    detail.recipeList.forEach(item => {
      let recipeName = ''
      const res = recipeMap.find(item2 => item.id === item2.id)
      if (res) {
        recipeName = res.recipeName
      }
      item.recipeName = recipeName
    })
    res.json({ code: 0, data: detail })
  } catch (err) {
    next(err)
  }
}

exports.addColumn = async (req, res, next) => {
  try {
    const { columnTitle, showRecipeCount, recipeList } = req.body
    const recipeListStr = sortAndFormatRecipeListToStr(recipeList)
    const d = new Date()
    const { insertId: id } = await meishijieDb.query(
      'insert into home_recommend_column_list set ?',
      {
        columnTitle,
        showRecipeCount,
        recipeListStr,
        createTime: d,
        updateTime: d
      }
    )
    res.json({ code: 0, message: '添加推荐栏目成功', data: { id } })
  } catch (err) {
    next(err)
  }
}

exports.editColumn = async (req, res, next) => {
  try {
    const { id, columnTitle, showRecipeCount, recipeList } = req.body
    const recipeListStr = sortAndFormatRecipeListToStr(recipeList)
    const d = new Date()
    const { changedRows } = await meishijieDb.query(
      'update home_recommend_column_list set column_title=?,show_recipe_count=?,recipe_list_str=?,update_time=? where id=?',
      [columnTitle, showRecipeCount, recipeListStr, d, id]
    )
    if (changedRows < 1) {
      res.json({ code: -1, message: '修改推荐栏目失败' })
    }
    res.json({ code: 0, message: '修改推荐栏目成功', data: { id } })
  } catch (err) {
    next(err)
  }
}

exports.deleteColumn = async (req, res, next) => {
  try {
    const { id } = req.body
    const { affectedRows } = await meishijieDb.query(
      'delete from home_recommend_column_list where id=?',
      id
    )
    if (affectedRows < 1) {
      return res.json({ code: -1, message: '删除推荐栏目失败' })
    }
    res.json({ code: 0, message: '删除推荐栏目成功' })
  } catch (err) {
    next(err)
  }
}
