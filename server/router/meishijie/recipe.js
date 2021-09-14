const express = require('express')

const meishijieCtrl = require('../../controller/meishijie')
const auth = require('../../middleware/auth')
const validator = require('../../middleware/validator')

const router = express.Router()

router.get(
  '/getRecipeList',
  auth,
  validator.meishijie.recipe.getRecipeList,
  meishijieCtrl.recipe.getRecipeList
)

router.post(
  '/addRecipe',
  auth,
  validator.meishijie.recipe.addRecipe,
  meishijieCtrl.recipe.addRecipe
)

router.get(
  '/getRecipeDetailById',
  auth,
  validator.meishijie.recipe.getRecipeDetailById,
  meishijieCtrl.recipe.getRecipeDetailById
)

module.exports = router
