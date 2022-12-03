const express = require('express')

const router = express.Router()

router.use('/system', require('./system'))
router.use('/meishijie', require('./meishijie'))

module.exports = router
