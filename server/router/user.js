const express = require('express')
const userCtrl = require('../controller/user')
const adminValidator = require('../middleware/admin-validator')
const auth = require('../middleware/auth')

const router = express.Router()

// 用户登录
router.post('/login', adminValidator.loginValidator, userCtrl.loginSucess)

// 获取用户信息
router.get('/getInfo', auth, userCtrl.getInfo)

module.exports = router
