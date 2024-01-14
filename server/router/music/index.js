const express = require('express')

const router = express.Router()

router.use('/play', require('./play'))

module.exports = router
