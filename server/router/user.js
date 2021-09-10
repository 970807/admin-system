const express = require('express')
const userCtrl = require('../controller/user')
const validator = require('../middleware/validator')
const auth = require('../middleware/auth')

const router = express.Router()

// 用户登录
router.post('/login', validator.loginValidator, userCtrl.loginSucess)

// 获取用户信息
router.get('/getInfo', auth, userCtrl.getInfo)

module.exports = router
