const adminDb = require('../../db/admin')
const getList = require('../../utils/getList')

exports.getList = (req, res, next) => {
  getList({
    req,
    db: adminDb,
    dbTable: 'user_list',
    queryFieldArr: [
      'id',
      'username',
      'avatar',
      'role_id',
      'enable',
      'create_time',
      'update_time'
    ],
    searchFieldArr: [{ reqField: 'roleId', dbField: 'role_id' }],
    likeSearchFieldArr: [{ reqField: 'username', dbField: 'username' }],
    orderProp: req.query.orderProp,
    orderSeq: req.query.orderSeq,
    onSuccess: function (data) {
      res.json({ code: 0, data })
    },
    onError: function (err) {
      next(err)
    }
  })
}

exports.isExistAccount = async (req, res, next) => {
  try {
    const { username } = req.query
    if (!username) return res.json({ code: -1, message: '账号不能为空' })
    const r = await adminDb.query(
      'SELECT 1 FROM user_list where username=? LIMIT 1',
      [username]
    )
    const isExist = r.length > 0
    res.json({ code: 0, data: isExist })
  } catch (err) {
    next(err)
  }
}

exports.addAccount = async (req, res, next) => {
  try {
    const { username, password, avatar, roleId, enable } = req.body
    if (!username) return res.json({ code: -1, message: '账号不能为空' })
    if (!password) return res.json({ code: -1, message: '密码不能为空' })
    if (!roleId) return res.json({ code: -1, message: '角色不能为空' })
    if (typeof enable !== 'number')
      return res.json({ code: -1, message: 'enable字段仅能为数字类型' })
    const d = new Date()
    await adminDb.query('INSERT INTO user_list SET ?', {
      username,
      password,
      avatar: avatar || null,
      roleId,
      enable,
      createTime: d,
      updateTime: d
    })
    res.json({ code: 0, data: null, message: '添加账号成功' })
  } catch (err) {
    if (err.sqlState === '23000') {
      // 账号重复
      res.json({ code: -1, data: null, message: err.sqlMessage })
      return
    }
    next(err)
  }
}

exports.editAccount = async (req, res, next) => {
  try {
    const id = req.params.id
    if (!id) return res.json({ code: -1, message: '账号id不能为空' })
    const { username, avatar, roleId } = req.body
    if (!username) return res.json({ code: -1, message: '账号不能为空' })
    if (!roleId) return res.json({ code: -1, message: '角色不能为空' })
    if (typeof enable !== 'number')
      return res.json({ code: -1, message: 'enable字段仅能为数字类型' })
    await adminDb.query(
      'UPDATE user_list SET username=?,avatar=?,role_id=?,enable=?,update_time=? WHERE id=?',
      [username, avatar || null, roleId, enable, new Date(), id]
    )
    res.json({ code: 0, data: null, message: '编辑账号成功' })
  } catch (err) {
    if (err.sqlState === '23000') {
      // 账号重复
      res.json({ code: -1, data: null, message: err.sqlMessage })
      return
    }
    next(err)
  }
}

exports.changeStatus = async (req, res, next) => {
  try {
    let { id, enable } = req.params
    if (!id) return res.json({ code: -1, message: '未知的角色id' })
    if (!enable) return res.json({ code: -1, message: 'enable字段不能为空' })
    enable = enable === '0' ? 0 : 1
    await adminDb.query(
      'UPDATE user_list set enable=?,update_time=? where id=?',
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
