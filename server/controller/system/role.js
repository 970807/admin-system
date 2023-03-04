const adminDb = require('../../db/admin')

exports.getList = async (req, res, next) => {
  try {
    const list = await adminDb.query(
      'SELECT id,role_name,enable,sort,create_time,update_time FROM role_list order by sort'
    )
    res.json({ code: 0, data: list })
  } catch (err) {
    next(err)
  }
}

exports.existRoleName = async (req, res, next) => {
  try {
    const { roleName } = req.query
    if (!roleName) {
      res.json({ code: -1, message: '角色名不能为空' })
      return
    }
    const [{ count }] = await adminDb.query(
      'SELECT count(*) as count FROM role_list WHERE role_name = ?',
      [roleName]
    )
    res.json({
      code: 0,
      data: count > 0
    })
  } catch (err) {
    next(err)
  }
}

exports.addRole = async (req, res, next) => {
  try {
    const { roleName, enable, sort } = req.body
    if (!roleName) {
      res.json({ code: -1, message: '角色名不能为空' })
      return
    }
    if (typeof enable !== 'number') {
      res.json({ code: -1, message: 'enable字段仅能为数字类型' })
      return
    }
    if (typeof sort !== 'number') {
      res.json({ code: -1, message: 'sort字段仅能为数字类型' })
      return
    }
    const d = new Date()
    await adminDb.query('INSERT INTO role_list set ?', {
      roleName,
      enable,
      sort,
      createTime: d,
      updateTime: d
    })
    res.json({
      code: 0,
      data: null,
      message: '添加角色成功'
    })
  } catch (err) {
    if (err.sqlState === '23000') {
      res.json({
        code: -1,
        message: err.message
      })
      return
    }
    next(err)
  }
}

exports.editRole = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) {
      res.json({ code: -1, message: '未知的角色id' })
      return
    }
    const { roleName, enable, sort } = req.body
    if (!roleName) {
      res.json({ code: -1, message: '角色名不能为空' })
      return
    }
    if (typeof enable !== 'number') {
      res.json({ code: -1, message: 'enable字段仅能为数字类型' })
      return
    }
    if (typeof sort !== 'number') {
      res.json({ code: -1, message: 'sort字段仅能为数字类型' })
      return
    }
    await adminDb.query(
      'UPDATE role_list set role_name=?,enable=?,sort=?,update_time=? where id=?',
      [roleName, enable, sort, new Date(), id]
    )
    res.json({ code: 0, data: null, message: '编辑角色成功' })
  } catch (err) {
    next(err)
  }
}

exports.changeRoleStatus = async (req, res, next) => {
  try {
    let { id, enable } = req.params
    if (!id) return res.json({ code: -1, message: '未知的角色id' })
    if (!enable) return res.json({ code: -1, message: 'enable字段不能为空' })
    enable = enable === '0' ? 0 : 1
    await adminDb.query(
      'UPDATE role_list set enable=?,update_time=? where id=?',
      [enable, new Date(), id]
    )
    res.json({
      code: 0,
      data: null,
      message: `${enable ? '启用成功' : '禁用成功'}`
    })
  } catch (err) {
    next(err)
  }
}

exports.batchDel = async (req, res, next) => {
  try {
    const idList = req.body.idList
    if (!Array.isArray(idList)) {
      res.json({ code: -1, message: 'idList不能为空' })
      return
    }
    if (idList.length < 1) {
      res.json({ code: 0, data: null, message: '批量删除成功' })
      return
    }
    await adminDb.query('DELETE FROM role_list WHERE id in (?)', [idList])
    res.json({ code: 0, data: null, message: '批量删除成功' })
  } catch (err) {
    next(err)
  }
}

exports.del = async (req, res, next) => {
  try {
    const id = req.params.id
    if (!id) return res.json({ code: -1, message: 'id不能为空' })
    await adminDb.query('DELETE FROM role_list WHERE id = ?', [id])
    res.json({ code: 0, data: null, message: '删除成功' })
  } catch (err) {
    next(err)
  }
}
