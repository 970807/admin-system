const meishijieDb = require('../../db/meishijie')
const md5 = require('../../utils/md5')
const { meishijieMd5Salt } = require('../../config/default.config')

exports.getList = async (req, res, next) => {
  try {
    const { page, pageSize, account } = req.query
    const [list, [{ total: totalCount }]] = await Promise.all([
      meishijieDb.query(
        'select * from user_list where account like ? order by id desc limit ?,?',
        [`%${account}%`, parseInt((page - 1) * pageSize), parseInt(pageSize)]
      ),
      meishijieDb.query('select count(*) as total from user_list')
    ])
    list.forEach((item) => delete item.password)
    res.send({
      code: '200',
      data: { list, totalCount }
    })
  } catch (err) {
    next(err)
  }
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
    res.send({
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
    res.send({
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
      res.send({
        code: '200',
        message: '修改密码成功',
        data: { id }
      })
    } else {
      res.send({ code: '-1', message: '修改密码失败' })
    }
  } catch (err) {
    next(err)
  }
}

exports.deleteAccountById = async (req, res, next) => {
  try {
    const id = req.body.id
    await meishijieDb.query('delete from user_list where id = ?', id)
    res.send({
      code: '200',
      message: '删除成功'
    })
  } catch (err) {
    next(err)
  }
}
