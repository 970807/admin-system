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

module.exports = router
