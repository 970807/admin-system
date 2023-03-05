const express = require('express')

const router = express.Router()

router.use('/account', require('./account'))
router.use('/common', require('./common'))
router.use('/role', require('./role'))
router.use('/routes', require('./routes'))
router.use('/user', require('./user'))

module.exports = router
