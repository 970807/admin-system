const express = require('express')
const systemCtrl = require('../../controller/system')

const router = express.Router()

// 获取rsa公钥
router.get('/getRSAPublicKey', systemCtrl.common.getRSAPublicKey)

// 获取验证码
router.get('/getCaptcha', systemCtrl.common.getCaptcha)

module.exports = router
