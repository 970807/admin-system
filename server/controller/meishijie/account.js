const meishijieDb = require('../../db/meishijie')
const getList = require('../../utils/getList')
const md5 = require('../../utils/md5')
const { meishijieMd5Salt } = require('../../config/default.config')

exports.getList = async (req, res, next) => {
  getList({
    req,
    res,
    next,
    db: meishijieDb,
    dbTable: 'user_list',
    likeSearchFieldArr: [{ reqField: 'account', dbField: 'account' }]
  })
}

exports.addAccount = async (req, res, next) => {
  try {
    const { account, phone, password, avatar } = req.body
    const d = new Date()
    const { insertId } = await meishijieDb.query(
      'insert into user_list set ?',
      {
        account,
        phone,
        password: md5(password, meishijieMd5Salt),
        avatar,
        createTime: d,
        updateTime: d
      }
    )
    res.json({
      code: '200',
      message: '添加账号成功',
      data: {
        id: insertId,
        account,
        phone,
        avatar
      }
    })
  } catch (err) {
    next(err)
  }
}

exports.editAccount = async (req, res, next) => {
  try {
    const { id, account, phone, avatar } = req.body
    await meishijieDb.query(
      'update user_list set account=?,phone=?,avatar=?,updateTime=? where id=?',
      [account, phone, avatar, new Date(), id]
    )
    res.json({
      code: '200',
      message: '修改账号成功',
      data: {
        id,
        account,
        phone,
        avatar
      }
    })
  } catch (err) {
    next(err)
  }
}

exports.editAccountPassword = async (req, res, next) => {
  try {
    const { id, password } = req.body
    const {
      changedRows
    } = await meishijieDb.query('update user_list set password=? where id=?', [
      md5(password, meishijieMd5Salt),
      id
    ])
    if (changedRows > 0) {
      res.json({
        code: '200',
        message: '修改密码成功',
        data: { id }
      })
    } else {
      res.json({ code: '-1', message: '修改密码失败' })
    }
  } catch (err) {
    next(err)
  }
}

exports.deleteAccountById = async (req, res, next) => {
  try {
    const id = req.body.id
    await meishijieDb.query('delete from user_list where id = ?', id)
    res.json({
      code: '200',
      message: '删除成功'
    })
  } catch (err) {
    next(err)
  }
}
