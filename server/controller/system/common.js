exports.getRSAPublicKey = (req, res, next) => {
  try {
    const { publicKey } = require('../../utils/encrypt')
    res.json({ code: 0, data: publicKey })
  } catch (err) {
    next(err)
  }
}
