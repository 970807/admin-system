const express = require('express')

const meishijieCtrl = require('../controller/meishijieCtrl')
const auth = require('../middleware/auth')
const meishijieValidator = require('../middleware/meishijie-validator')

const router = express.Router()

// 获取账号列表
router.get('/getAccountList', auth, meishijieCtrl.getAccountList)

// 添加账号
router.post(
  '/addAccount',
  auth,
  meishijieValidator.addAccountValidator,
  meishijieCtrl.addAccount
)

// 编辑账号信息
router.put(
  '/editAccount',
  auth,
  meishijieValidator.editAccountValidator,
  meishijieCtrl.editAccount
)

// 修改密码
router.put(
  '/editAccountPassword',
  auth,
  meishijieValidator.editAccountPasswordValidator,
  meishijieCtrl.editAccountPassword
)

// 删除账号
router.delete('/deleteAccountById', auth, meishijieCtrl.deleteAccountById)

module.exports = router
