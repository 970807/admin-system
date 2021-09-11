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

router.get(
  '/getAllCategoryList',
  auth,
  meishijieCtrl.ingredient.getAllCategoryList
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

router.get(
  '/getIngredientList',
  auth,
  validator.meishijie.ingredient.getIngredientList,
  meishijieCtrl.ingredient.getIngredientList
)

router.post(
  '/addIngredient',
  auth,
  validator.meishijie.ingredient.addIngredient,
  meishijieCtrl.ingredient.addIngredient
)

router.put(
  '/editIngredient',
  auth,
  validator.meishijie.ingredient.editIngredient,
  meishijieCtrl.ingredient.editIngredient
)

router.delete(
  '/batchDeleteIngredient',
  auth,
  validator.meishijie.ingredient.batchDeleteIngredient,
  meishijieCtrl.ingredient.batchDeleteIngredient
)

module.exports = router
