const express = require('express')

const meishijieCtrl = require('../../controller/meishijie')
const auth = require('../../middleware/auth')
const meishijieValidator = require('../../middleware/meishijie-validator')

const router = express.Router()

// 获取账号列表
router.get('/getList', auth, meishijieCtrl.account.getList)

// 添加账号
router.post(
  '/addAccount',
  auth,
  meishijieValidator.addAccountValidator,
  meishijieCtrl.account.addAccount
)

// 编辑账号信息
router.put(
  '/editAccount',
  auth,
  meishijieValidator.editAccountValidator,
  meishijieCtrl.account.editAccount
)

// 修改密码
router.put(
  '/editAccountPassword',
  auth,
  meishijieValidator.editAccountPasswordValidator,
  meishijieCtrl.account.editAccountPassword
)

// 删除账号
router.delete(
  '/deleteAccountById',
  auth,
  meishijieCtrl.account.deleteAccountById
)

module.exports = router
