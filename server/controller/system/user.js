const jwt = require('../../utils/jwt')
const { jwtSecret } = require('../../config/default.config')

async function generateTokenByUserId(userId) {
  // 生成token
  const token = await jwt.sign(
    {
      userId,
    },
    jwtSecret,
    {
      expiresIn: '12h',
    },
  )
  return token
}

exports.loginSucess = async (req, res, next) => {
  try {
    // 登录成功，返回token
    const userId = req.userId
    const token = await generateTokenByUserId(userId)
    res.json({
      code: '200',
      data: { userId, token },
    })
  } catch (err) {
    next(err)
  }
}

exports.getUserInfo = (req, res, next) => {
  const userInfo = { ...req.userInfo }
  delete userInfo.password
  res.json({
    code: '200',
    data: userInfo,
  })
}
