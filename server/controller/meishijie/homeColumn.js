const { v4: uuidv4 } = require('uuid')
const meishijieDb = require('../../db/meishijie')

exports.getHomeColumnList = async (req, res, next) => {
  const { columnName } = req.query
  try {
    const list = await meishijieDb.query(
      'select * from home_column_list where `column_name` like ? order by sort_no, update_time asc',
      [`%${columnName}%`]
    )

    const promiseList = []
    // 查询栏位菜谱数
    for (const item of list) {
      if (item.id === 'TODAY_HOT_VIDEO_RECIPE') {
        // 今日热门视频菜谱
        const promise = meishijieDb
          .query(
            'select count(*) as count from home_column_list_today_hot_video_recipe'
          )
          .then(([{ count }]) => {
            item.recipeCount = count
          })
        promiseList.push(promise)
      } else if (item.id === 'TODAY_HOT_SEARCH') {
        // 今日热搜
        item.recipeCount = null // 今日热搜的菜谱数为0
      } else if (item.id === 'TODAY_THREE_MEALS') {
        // 今日三餐
        const promise = meishijieDb
          .query(
            'select count(*) as count from home_column_list_today_three_meals'
          )
          .then(([{ count }]) => {
            item.recipeCount = count
          })
        promiseList.push(promise)
      } else {
        // 其它菜谱
        const promise = meishijieDb
          .query(
            'select count(*) as count from home_column_list_recipe where column_id=?',
            [item.id]
          )
          .then(([{ count }]) => {
            item.recipeCount = count
          })
        promiseList.push(promise)
      }
    }

    await Promise.allSettled(promiseList)

    res.json({ code: 0, data: list })
  } catch (err) {
    next(err)
  }
}

exports.getHomeColumnDetail = async (req, res, next) => {
  const { id } = req.params
  try {
    const [detail] = await meishijieDb.query(
      'select * from home_column_list where id=?',
      [id]
    )
    if (!detail) {
      res.json({ code: -1, message: '栏位不存在' })
      return
    }

    //删除一些用不到的字段
    delete detail.system
    delete detail.createTime
    delete detail.updateTime

    res.json({
      code: 0,
      data: detail
    })
  } catch (err) {
    next(err)
  }
}

exports.addHomeColumn = async (req, res, next) => {
  try {
    const { columnName, sortNo = 0, available = 0 } = req.body
    const d = new Date()
    const id = uuidv4()
    const { affectedRows } = await meishijieDb.query(
      'insert into home_column_list set ?',
      {
        id,
        columnName,
        system: 0, // 是否是系统预设栏位 1:是 0:否 (手动的加的不是系统预设栏位)
        available,
        sortNo,
        createTime: d,
        updateTime: d
      }
    )
    if (affectedRows < 1) {
      res.json({ code: -1, message: '添加栏位失败' })
      return
    }
    res.json({ code: 0, message: '添加栏位成功', data: { id } })
  } catch (err) {
    next(err)
  }
}

exports.editHomeColumn = async (req, res, next) => {
  try {
    const { id, columnName, sortNo, available } = req.body
    const { changedRows } = await meishijieDb.query(
      'update home_column_list set column_name=?,sort_no=?,available=?,update_time=? where id=?',
      [columnName, sortNo, available, new Date(), id]
    )
    if (changedRows < 1) {
      res.json({ code: -1, message: '修改栏位失败' })
      return
    }
    res.json({ code: 0, message: '修改栏位成功', data: { id } })
  } catch (err) {
    next(err)
  }
}

exports.updateHomeColumnSortNo = async (req, res, next) => {
  try {
    const { id, sortNo } = req.params
    await meishijieDb.query(
      'update home_column_list set sort_no=?,update_time=? where id=?',
      [sortNo, new Date(), id]
    )
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.batchDeleteHomeColumn = async (req, res, next) => {
  try {
    const { idList } = req.body
    if (idList?.length) {
      await meishijieDb.query(
        'delete from home_column_list where id in (?) and `system` != 1',
        [idList]
      )
    }
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.availableHomeColumn = async (req, res, next) => {
  try {
    const { available, idList } = req.body
    if (idList?.length) {
      await meishijieDb.query(
        'update home_column_list set available=?, update_time=? where id in (?)',
        [available, new Date(), idList]
      )
    }
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.addTodayHotVideoRecipe = async (req, res, next) => {
  try {
    const { recipeIdList } = req.body
    if (recipeIdList?.length) {
      const d = new Date()
      const promiseList = []
      for (const recipeId of recipeIdList) {
        const promise = new Promise(async (resolve, reject) => {
          // 先查询一下热门视频菜谱表，之前已经添加过该菜谱的，不再重复添加
          const [{ count }] = await meishijieDb
            .query(
              'select count(*) as count from home_column_list_today_hot_video_recipe where recipe_id=? limit 1',
              [recipeId]
            )
            .catch(err => {
              reject(err)
            })

          if (count > 0) {
            // 之前已经添加过该菜谱的，不再重复添加
            resolve()
            return
          }

          // 将菜谱添加到热门视频菜谱表
          const id = uuidv4()

          await meishijieDb
            .query(
              'insert into home_column_list_today_hot_video_recipe set ?',
              {
                id,
                recipeId,
                sortNo: 0, // 添加时默认为0，后续可以手动修改为其它值
                createTime: d,
                updateTime: d
              }
            )
            .catch(err => {
              reject(err)
            })

          resolve()
        })
        promiseList.push(promise)
        await Promise.all(promiseList).catch(err => {
          next(err)
        })
      }
    }
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.getTodayHotVideoRecipe = async (req, res, next) => {
  try {
    const { recipeName } = req.query
    let list = await meishijieDb.query(
      'select * from home_column_list_today_hot_video_recipe order by sort_no, update_time'
    )
    // 把recipeName(菜谱名称)、publish(发布状态)查询出来
    const promiseList = []
    for (const thvr of list) {
      const promise = meishijieDb
        .query(
          'select recipe_name, publish from recipe_list where id=? limit 1',
          [thvr.recipeId]
        )
        .then(([detial]) => {
          thvr.recipeName = detial.recipeName
          thvr.publish = detial.publish
        })
        .catch(() => {
          thvr.recipeName = null
          thvr.publish = null
        })
      promiseList.push(promise)
    }
    await Promise.allSettled(promiseList)

    if (recipeName) {
      // recipeName查询参数处理
      list = list.filter(item => item.recipeName.includes(recipeName))
    }

    res.json({ code: 0, data: list })
  } catch (err) {
    next(err)
  }
}

exports.updateTodayHotVideoRecipeSortNo = async (req, res, next) => {
  try {
    const { id, sortNo } = req.body
    await meishijieDb.query(
      'update home_column_list_today_hot_video_recipe set sort_no=?, update_time=? where id=?',
      [sortNo, new Date(), id]
    )
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.deleteTodayHotVideoRecipe = async (req, res, next) => {
  try {
    const { idList } = req.body
    if (Array.isArray(idList) && idList.length) {
      await meishijieDb.query(
        'delete from home_column_list_today_hot_video_recipe where id in (?)',
        [idList]
      )
    }
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.getTodayHotSearch = async (req, res, next) => {
  try {
    const { keyword } = req.query
    const list = await meishijieDb.query(
      'select * from home_column_list_today_hot_search where `keyword` like ? order by sort_no,update_time',
      [`%${keyword}%`]
    )
    list.forEach(item => {
      delete item.createTime
      delete item.updateTime
    })
    res.json({ code: 0, data: list })
  } catch (err) {
    next(err)
  }
}

exports.addTodayHotSearch = async (req, res, next) => {
  try {
    const { keyword, superHot, sortNo } = req.body
    const id = uuidv4()
    const d = new Date()
    await meishijieDb.query(
      'insert into home_column_list_today_hot_search set ?',
      {
        id,
        keyword,
        superHot: superHot === 0 ? 0 : 1,
        sortNo: sortNo ?? 0,
        createTime: d,
        updateTime: d
      }
    )
    res.json({ code: 0, data: id })
  } catch (err) {
    next(err)
  }
}

exports.updateTodayHotSearchSortNo = async (req, res, next) => {
  try {
    const { id, sortNo } = req.body
    await meishijieDb.query(
      'update home_column_list_today_hot_search set sort_no=?, update_time=? where id=?',
      [sortNo ?? 0, new Date(), id]
    )
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.deleteTodayHotSearch = async (req, res, next) => {
  try {
    const { id } = req.params
    await meishijieDb.query(
      'delete from home_column_list_today_hot_search where id=?',
      [id]
    )
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.getTodayThreeMealsList = async (req, res, next) => {
  try {
    const { recipeName, type } = req.query
    let list = await meishijieDb.query(
      'select * from home_column_list_today_three_meals where type=? order by sort_no,update_time',
      [type]
    )

    // 查询菜谱名称，发布状态
    const promiseList = []
    for (const item of list) {
      const recipeId = item.recipeId
      if (recipeId) {
        const promise = meishijieDb
          .query(
            'select recipe_name, publish from recipe_list where id=? limit 1',
            [recipeId]
          )
          .then(rrr => {
            const recipeDetail = rrr?.[0]
            if (recipeDetail) {
              item.recipeName = recipeDetail.recipeName
              item.publish = recipeDetail.publish
            } else {
              item.recipeName = null
              item.publish = null
            }
          })
        promiseList.push(promise)
      }
    }

    await Promise.allSettled(promiseList)

    if (recipeName) {
      // 菜谱名称查询参数，模糊查询
      list = list.filter(item => item.recipeName.includes(recipeName))
    }

    res.json({ code: 0, data: list })
  } catch (err) {
    next(err)
  }
}

exports.addTodayThreeMeals = async (req, res, next) => {
  try {
    const { type, recipeIdList } = req.body

    const promiseList = []

    for (const recipeId of recipeIdList) {
      const id = uuidv4()
      const d = new Date()
      const promise = meishijieDb.query(
        'insert into home_column_list_today_three_meals set ?',
        {
          id,
          recipeId,
          type,
          sortNo: 0, // 添加时默认为0，后续可以手动修改为其它值
          createTime: d,
          updateTime: d
        }
      )
      promiseList.push(promise)
    }

    await Promise.all(promiseList)

    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.updateTodayThreeMealsSortNo = async (req, res, next) => {
  try {
    const { id, sortNo } = req.body
    await meishijieDb.query(
      'update home_column_list_today_three_meals set sort_no=?, update_time=? where id=?',
      [sortNo, new Date(), id]
    )
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.deleteTodayThreeMeals = async (req, res, next) => {
  try {
    const { idList } = req.body
    await meishijieDb.query(
      'delete from home_column_list_today_three_meals where id in (?)',
      [idList]
    )
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.getColumnRecipeList = async (req, res, next) => {
  try {
    const { columnId } = req.params
    const { recipeName } = req.query
    let list = await meishijieDb.query(
      'select * from home_column_list_recipe where column_id=?',
      [columnId]
    )
    list.forEach(item => {
      delete item.createTime
      delete item.updateTime
    })

    // 查询菜谱名称，发布状态
    const promiseList = []
    for (const item of list) {
      const recipeId = item.recipeId
      if (recipeId) {
        const promise = meishijieDb
          .query(
            'select recipe_name, publish from recipe_list where id=? limit 1',
            [recipeId]
          )
          .then(rrr => {
            const recipeDetail = rrr?.[0]
            if (recipeDetail) {
              item.recipeName = recipeDetail.recipeName
              item.publish = recipeDetail.publish
            } else {
              item.recipeName = null
              item.publish = null
            }
          })
        promiseList.push(promise)
      }
    }

    await Promise.allSettled(promiseList)

    if (recipeName) {
      // 菜谱名称查询参数，模糊查询
      list = list.filter(item => item.recipeName.includes(recipeName))
    }

    res.json({ code: 0, data: list })
  } catch (err) {
    next(err)
  }
}

exports.addColumnRecipe = async (req, res, next) => {
  try {
    const { columnId, recipeIdList } = req.body
    const promiseList = []
    for (const recipeId of recipeIdList) {
      const id = uuidv4()
      const d = new Date()
      const promise = meishijieDb.query(
        'insert into home_column_list_recipe set ?',
        {
          id,
          columnId,
          recipeId,
          sortNo: 0, // 添加时默认为0，后续可以手动修改为其它值
          createTime: d,
          updateTime: d
        }
      )
      promiseList.push(promise)
    }
    await Promise.allSettled(promiseList)
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.updateColumnRecipeSortNo = async (req, res, next) => {
  try {
    const { id, sortNo } = req.body
    await meishijieDb.query(
      'update home_column_list_recipe set sort_no=?, update_time=? where id=?',
      [sortNo, new Date(), id]
    )
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.deleteColumnRecipe = async (req, res, next) => {
  try {
    const { idList } = req.body
    await meishijieDb.query(
      'delete from home_column_list_recipe where id in (?)',
      [idList]
    )
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}
