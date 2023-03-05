const express = require('express')
const systemCtrl = require('../../controller/system')

const router = express.Router()

// 获取rsa公钥
router.get('/getRSAPublicKey', systemCtrl.common.getRSAPublicKey)

module.exports = router
