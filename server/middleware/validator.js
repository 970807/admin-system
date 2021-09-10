const db = require('../db/index.js')
const md5 = require('../utils/md5')

exports.loginValidator = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.json({
        code: '-1',
        message: '账号或密码不能为空'
      })
    }
    // 查找对应账号
    const r = await db.query(
      'select * from user_list where username = ?',
      username
    )
    if (r.length === 0) {
      return res.json({
        code: '-1',
        message: '登录失败，账号不存在'
      })
    }
    const userInfo = r[0]
    console.log(md5(password))
    if (userInfo.password !== md5(password)) {
      return res.json({
        code: '-1',
        message: '登录失败，密码错误'
      })
    }
    req.userId = userInfo.id
    next()
  } catch (err) {
    next(err)
  }
}
