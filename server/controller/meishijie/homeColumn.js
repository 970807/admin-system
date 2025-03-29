const { v4: uuidv4 } = require('uuid')
const meishijieDb = require('../../db/meishijie')

exports.getHomeColumnList = async (req, res, next) => {
  const { columnName } = req.query
  try {
    const list = await meishijieDb.query(
      'select * from home_column_list where `column_name` like ? order by sort_no asc',
      [`%${columnName}%`]
    )
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
      'update home_column_list set column_name=?,sort_no=?,available=?,update_time=? where id=? order by sort_no,update_time',
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
