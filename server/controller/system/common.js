exports.getRSAPublicKey = (req, res, next) => {
  try {
    const { publicKey } = require('../../utils/encrypt')
    res.json({ code: 0, data: publicKey })
  } catch (err) {
    next(err)
  }
}

exports.getCaptcha = (req, res, next) => {
  try {
    // 引用svg-captcha库生成验证码
    const captcha = require('svg-captcha')
    const { aesEncrypt } = require('../../utils/encrypt')
    const cap = captcha.create({
      size: 4,
      noise: 1,
      color: true,
      background: '#F8DF72'
    })
    const curDate = new Date()
    // 过期时间(默认2分钟)
    const expires = curDate.setMinutes(curDate.getMinutes() + 2)
    const captchaCode = aesEncrypt(
      JSON.stringify({
        expires,
        text: cap.text
      })
    )
    res.json({
      code: 0,
      data: {
        captchaCode,
        captchaSvg: cap.data
      }
    })
  } catch (err) {
    next(err)
  }
}
