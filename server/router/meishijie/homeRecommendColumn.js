const express = require('express')

const meishijieCtrl = require('../../controller/meishijie')
const auth = require('../../middleware/auth')
const validator = require('../../middleware/validator')

const router = express.Router()

router.get(
  '/getColumnList',
  auth,
  meishijieCtrl.homeRecommendColumn.getColumnList
)

router.get(
  '/getColumnDetail',
  auth,
  validator.meishijie.homeRecommendColumn.getColumnDetail,
  meishijieCtrl.homeRecommendColumn.getColumnDetail
)

router.post(
  '/addColumn',
  auth,
  validator.meishijie.homeRecommendColumn.addColumn,
  meishijieCtrl.homeRecommendColumn.addColumn
)

router.put(
  '/editColumn',
  auth,
  validator.meishijie.homeRecommendColumn.editColumn,
  meishijieCtrl.homeRecommendColumn.editColumn
)

module.exports = router
