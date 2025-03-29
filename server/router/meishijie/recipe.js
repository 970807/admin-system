const express = require('express')

const meishijieCtrl = require('../../controller/meishijie')
const auth = require('../../middleware/auth')
const validator = require('../../middleware/validator')

const router = express.Router()

// 获取菜谱列表
router.get(
  '/getRecipeList',
  auth,
  validator.meishijie.recipe.getRecipeList,
  meishijieCtrl.recipe.getRecipeList
)

// 添加菜谱
router.post(
  '/addRecipe',
  auth,
  validator.meishijie.recipe.addRecipe,
  meishijieCtrl.recipe.addRecipe
)

// 编辑菜谱
router.put(
  '/editRecipe',
  auth,
  validator.meishijie.recipe.editRecipe,
  meishijieCtrl.recipe.editRecipe
)

// 批量删除菜谱
router.delete(
  '/batchDeleteRecipe',
  auth,
  validator.meishijie.recipe.batchDeleteRecipe,
  meishijieCtrl.recipe.batchDeleteRecipe
)

// 获取菜谱详情
router.get(
  '/getRecipeDetailById',
  auth,
  validator.meishijie.recipe.getRecipeDetailById,
  meishijieCtrl.recipe.getRecipeDetailById
)

// html导入菜谱
router.post(
  '/importFromHtmlStr',
  auth,
  validator.meishijie.recipe.importFromHtmlStr,
  meishijieCtrl.recipe.importFromHtmlStr
)

// 发布/取消发布菜谱
router.post(
  '/publish',
  auth,
  validator.meishijie.recipe.publish,
  meishijieCtrl.recipe.publish
)

module.exports = router
