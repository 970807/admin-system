const express = require('express')

const meishijieCtrl = require('../../controller/meishijie')
const auth = require('../../middleware/auth')
const validator = require('../../middleware/validator')

const router = express.Router()

router.get(
  '/getCategoryList',
  auth,
  validator.meishijie.ingredient.getCategoryList,
  meishijieCtrl.ingredient.getCategoryList
)

router.post(
  '/addCategory',
  auth,
  validator.meishijie.ingredient.addCategory,
  meishijieCtrl.ingredient.addCategory
)

router.put(
  '/editCategory',
  auth,
  validator.meishijie.ingredient.editCategory,
  meishijieCtrl.ingredient.editCategory
)

router.delete(
  '/batchDeleteCategory',
  auth,
  validator.meishijie.ingredient.batchDeleteCategory,
  meishijieCtrl.ingredient.batchDeleteCategory
)

module.exports = router
