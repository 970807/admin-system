const { verify } = require('../utils/jwt')
const { jwtSecret } = require('../config/default.config')
const adminDb = require('../db/admin.js')

module.exports = async (req, res, next) => {
  // 从请求头获取 token 数据
  let token = req.headers.authorization
  token = token ? token.split('Bearer ')[1] : null
  if (!token) {
    return res.json({ code: 401, message: 'token不存在' })
  }
  let userId
  try {
    // 验证 token 是否有效
    const r = await verify(token, jwtSecret)
    userId = r.userId
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.json({ code: 401, message: '登录状态已过期，请重新登录！' })
    else if (err.name === 'JsonWebTokenError')
      return res.json({ code: 401, message: 'token解析失败，请重新登录！' })
    else return res.json({ code: 401, message: '未知错误' })
  }
  try {
    const r = await adminDb.query(
      'select * from user_list where id = ?',
      userId
    )
    if (r.length < 1) {
      return res.json({ code: 401, message: '用户不存在' })
    }
    req.userInfo = r[0]
    next()
  } catch (err) {
    console.error(err.message)
    next(err)
  }
}
