const express = require('express')

const router = express.Router()

router.use('/music', require('./music'))
router.use('/meishijie', require('./meishijie'))
router.use('/system', require('./system'))

module.exports = router
