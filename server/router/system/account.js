const express = require('express')
const systemCtrl = require('../../controller/system')
const auth = require('../../middleware/auth')

const router = express.Router()

// 获取系统账号列表
router.get('/getList', auth, systemCtrl.account.getList)

module.exports = router
