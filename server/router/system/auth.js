const express = require('express')
const systemCtrl = require('../../controller/system')
const auth = require('../../middleware/auth')

const router = express.Router()

// 获取权限列表
router.get('/getList', auth, systemCtrl.auth.getList)

// 添加&编辑权限
router.post('/addOrEditAuth', auth, systemCtrl.auth.addOrEditAuth)

// 删除权限
router.delete('/del/:id', auth, systemCtrl.auth.del)

// 批量删除权限
router.delete('/batchDel', auth, systemCtrl.auth.batchDel)

module.exports = router
