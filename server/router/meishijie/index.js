const express = require('express')

const router = express.Router()

router.use('/account', require('./account'))
router.use('/homeColumn', require('./homeColumn'))
router.use('/ingredient', require('./ingredient'))
router.use('/recipe', require('./recipe'))
router.use('/homeRecommendColumn', require('./homeRecommendColumn'))

module.exports = router
