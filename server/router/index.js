const express = require('express')

const router = express.Router()

router.use('/user', require('./user'))
router.use('/meishijie', require('./meishijie'))

module.exports = router
