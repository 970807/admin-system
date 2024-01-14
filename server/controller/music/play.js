const {
  getNeteaseReqEncryptionData,
  getRequestHeaders
} = require('./utils/netease')
const axios = require('axios')

exports.search = async (req, res, next) => {
  try {
    const keyword = req.body.keyword
    if (!keyword) return res.json({ code: -1, message: '请输入关键字' })

    console.log(
      getNeteaseReqEncryptionData({
        csrf_token: '',
        limit: '8',
        s: keyword
      })
    )

    const r1 = await axios({
      method: 'post',
      url: 'https://music.163.com/weapi/search/suggest/web',
      data: getNeteaseReqEncryptionData({
        csrf_token: '',
        limit: '8',
        s: keyword
      }),
      headers: getRequestHeaders()
    })

    res.json({
      code: 0,
      data: r1.data?.result ?? null
    })
  } catch (err) {
    next(err)
  }
}
