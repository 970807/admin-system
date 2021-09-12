const express = require('express')

const meishijieCtrl = require('../../controller/meishijie')
const auth = require('../../middleware/auth')
const validator = require('../../middleware/validator')

const router = express.Router()

router.post(
  '/addRecipe',
  auth,
  validator.meishijie.recipe.addRecipe,
  meishijieCtrl.recipe.addRecipe
)

module.exports = router
