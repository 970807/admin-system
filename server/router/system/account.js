const express = require('express')
const systemCtrl = require('../../controller/system')
const auth = require('../../middleware/auth')

const router = express.Router()

// 获取系统账号列表
router.get('/getList', auth, systemCtrl.account.getList)

// 判断账号是否重复
router.get('/isExistAccount', auth, systemCtrl.account.isExistAccount)

// 添加账号
router.put('/addAccount', auth, systemCtrl.account.addAccount)

// 编辑账号
router.post('/editAccount/:id', auth, systemCtrl.account.editAccount)

// 启用/禁用账号 enable：传1启用 传0禁用
router.post('/changeStatus/:id/:enable', auth, systemCtrl.account.changeStatus)

module.exports = router
