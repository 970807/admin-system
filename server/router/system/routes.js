const express = require('express')
const systemCtrl = require('../../controller/system')
const auth = require('../../middleware/auth')

const router = express.Router()

// 动态路由
router.get('/getAsyncRoutes', auth, systemCtrl.routes.getAsyncRoutes)

module.exports = router
