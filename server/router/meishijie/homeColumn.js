const express = require('express')

const meishijieCtrl = require('../../controller/meishijie')
const auth = require('../../middleware/auth')
const validator = require('../../middleware/validator')

const router = express.Router()

router.get(
  '/getHomeColumnList',
  auth,
  meishijieCtrl.homeColumn.getHomeColumnList
)

router.post(
  '/getHomeColumnDetail/:id',
  auth,
  meishijieCtrl.homeColumn.getHomeColumnDetail
)

router.put(
  '/addHomeColumn',
  auth,
  validator.meishijie.homeColumn.addHomeColumn,
  meishijieCtrl.homeColumn.addHomeColumn
)

router.post(
  '/editHomeColumn',
  auth,
  validator.meishijie.homeColumn.editHomeColumn,
  meishijieCtrl.homeColumn.editHomeColumn
)

router.post(
  '/updateHomeColumnSortNo/:id/:sortNo',
  auth,
  validator.meishijie.homeColumn.updateHomeColumnSortNo,
  meishijieCtrl.homeColumn.updateHomeColumnSortNo
)

router.delete(
  '/batchDeleteHomeColumn',
  auth,
  validator.meishijie.homeColumn.batchDeleteHomeColumn,
  meishijieCtrl.homeColumn.batchDeleteHomeColumn
)

router.post(
  '/availableHomeColumn',
  auth,
  validator.meishijie.homeColumn.availableHomeColumn,
  meishijieCtrl.homeColumn.availableHomeColumn
)

router.post(
  '/addTodayHotVideoRecipe',
  auth,
  validator.meishijie.homeColumn.addTodayHotVideoRecipe,
  meishijieCtrl.homeColumn.addTodayHotVideoRecipe
)

router.get(
  '/getTodayHotVideoRecipe',
  auth,
  meishijieCtrl.homeColumn.getTodayHotVideoRecipe
)

router.post(
  '/updateTodayHotVideoRecipeSortNo',
  auth,
  validator.meishijie.homeColumn.updateTodayHotVideoRecipeSortNo,
  meishijieCtrl.homeColumn.updateTodayHotVideoRecipeSortNo
)

router.delete(
  '/deleteTodayHotVideoRecipe',
  auth,
  validator.meishijie.homeColumn.deleteTodayHotVideoRecipe,
  meishijieCtrl.homeColumn.deleteTodayHotVideoRecipe
)

router.get(
  '/getTodayHotSearch',
  auth,
  meishijieCtrl.homeColumn.getTodayHotSearch
)

router.post(
  '/addTodayHotSearch',
  auth,
  validator.meishijie.homeColumn.addTodayHotSearch,
  meishijieCtrl.homeColumn.addTodayHotSearch
)

router.put(
  '/updateTodayHotSearchSortNo',
  auth,
  validator.meishijie.homeColumn.updateTodayHotSearchSortNo,
  meishijieCtrl.homeColumn.updateTodayHotSearchSortNo
)

router.delete(
  '/deleteTodayHotSearch/:id',
  auth,
  validator.meishijie.homeColumn.deleteTodayHotSearch,
  meishijieCtrl.homeColumn.deleteTodayHotSearch
)

router.get(
  '/getTodayThreeMealsList',
  auth,
  validator.meishijie.homeColumn.getTodayThreeMealsList,
  meishijieCtrl.homeColumn.getTodayThreeMealsList
)

router.post(
  '/addTodayThreeMeals',
  auth,
  validator.meishijie.homeColumn.addTodayThreeMeals,
  meishijieCtrl.homeColumn.addTodayThreeMeals
)

router.put(
  '/updateTodayThreeMealsSortNo',
  auth,
  validator.meishijie.homeColumn.updateTodayThreeMealsSortNo,
  meishijieCtrl.homeColumn.updateTodayThreeMealsSortNo
)

router.delete(
  '/deleteTodayThreeMeals',
  auth,
  validator.meishijie.homeColumn.deleteTodayThreeMeals,
  meishijieCtrl.homeColumn.deleteTodayThreeMeals
)

router.get(
  '/getColumnRecipeList/:columnId',
  auth,
  validator.meishijie.homeColumn.getColumnRecipeList,
  meishijieCtrl.homeColumn.getColumnRecipeList
)

router.post(
  '/addColumnRecipe',
  auth,
  validator.meishijie.homeColumn.addColumnRecipe,
  meishijieCtrl.homeColumn.addColumnRecipe
)

router.put(
  '/updateColumnRecipeSortNo',
  auth,
  validator.meishijie.homeColumn.updateColumnRecipeSortNo,
  meishijieCtrl.homeColumn.updateColumnRecipeSortNo
)

router.delete(
  '/deleteColumnRecipe',
  auth,
  validator.meishijie.homeColumn.deleteColumnRecipe,
  meishijieCtrl.homeColumn.deleteColumnRecipe
)

module.exports = router
