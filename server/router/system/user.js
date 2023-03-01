const express = require('express')
const systemCtrl = require('../../controller/system')
const validator = require('../../middleware/validator')
const auth = require('../../middleware/auth')

const router = express.Router()

// 用户登录
router.post('/login', validator.system.user.login, systemCtrl.user.loginSucess)

// 获取登录用户信息
router.get('/getInfo', auth, systemCtrl.user.getInfo)

module.exports = router
