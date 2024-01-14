const express = require('express')
const musicCtrl = require('../../controller/music')

const router = express.Router()

// 查询音乐
router.post('/search', musicCtrl.play.search)

module.exports = router
