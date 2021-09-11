const express = require('express')
const systemCtrl = require('../../controller/system')
const adminValidator = require('../../middleware/admin-validator')
const auth = require('../../middleware/auth')

const router = express.Router()

// 用户登录
router.post(
  '/login',
  adminValidator.loginValidator,
  systemCtrl.user.loginSucess
)

// 获取用户信息
router.get('/getInfo', auth, systemCtrl.user.getInfo)

module.exports = router
