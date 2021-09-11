const express = require('express')

const router = express.Router()

router.use('/account', require('./account'))
router.use('/ingredient', require('./ingredient'))

module.exports = router
