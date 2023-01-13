const jwt = require('../../utils/jwt')
const { jwtSecret } = require('../../config/default.config')

async function generateTokenByUserId(userId) {
  // 生成token
  const token = await jwt.sign(
    {
      userId
    },
    jwtSecret,
    {
      expiresIn: '12h'
    }
  )
  return token
}

exports.loginSucess = async (req, res, next) => {
  try {
    // 登录成功，返回token
    const userId = req.userId
    const accessToken = await generateTokenByUserId(userId)
    res.json({
      code: 0,
      data: {
        userId,
        username: req.username,
        accessToken,
        refreshToken: `${accessToken}Refresh`,
        roles: ['admin'] // 一个用户可能有多个角色
      }
    })
  } catch (err) {
    next(err)
  }
}

exports.getInfo = (req, res, next) => {
  const userInfo = { ...req.userInfo }
  delete userInfo.password
  res.json({
    code: 0,
    data: { userInfo }
  })
}
