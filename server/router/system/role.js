const express = require('express')
const systemCtrl = require('../../controller/system')
const auth = require('../../middleware/auth')

const router = express.Router()

// 获取角色列表
router.get('/getList', auth, systemCtrl.role.getList)

// 查询角色名是否存在
router.get('/existRoleName', auth, systemCtrl.role.existRoleName)

// 添加角色
router.put('/addRole', auth, systemCtrl.role.addRole)

// 编辑角色
router.post('/editRole/:id', auth, systemCtrl.role.editRole)

module.exports = router
