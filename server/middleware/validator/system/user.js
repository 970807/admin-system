const adminDb = require('../../../db/admin.js')
const { rsaDecrypt, aesDecrypt } = require('../../../utils/encrypt')

exports.login = async (req, res, next) => {
  try {
    const { username, password, captchaText, captchaCode } = req.body
    if (!captchaText) {
      return res.json({
        code: -1,
        message: '验证码不能为空'
      })
    }
    // 校验验证码是否正确
    try {
      const captchaInfo = JSON.parse(aesDecrypt(captchaCode))
      if (Date.now() > captchaInfo.expires) {
        return res.json({
          code: -1,
          message: '验证码已过期，请刷新验证码重试'
        })
      }
      if (captchaInfo.text.toLowerCase() !== captchaText.toLowerCase()) {
        return res.json({
          code: -1,
          message: '验证码错误'
        })
      }
    } catch {
      return res.json({
        code: -1,
        message: '验证码校验失败'
      })
    }
    if (!username || !password) {
      return res.json({
        code: -1,
        message: '账号或密码不能为空'
      })
    }
    // 查找对应账号
    const r = await adminDb.query(
      'select * from user_list where username = ? LIMIT 1',
      username
    )
    if (r.length === 0) {
      return res.json({
        code: -1,
        message: '登录失败，账号不存在'
      })
    }
    const userInfo = r[0]
    if (userInfo.password !== rsaDecrypt(password)) {
      return res.json({
        code: -1,
        message: '登录失败，密码错误'
      })
    }
    req.userId = userInfo.id
    req.username = username
    next()
  } catch (err) {
    next(err)
  }
}
