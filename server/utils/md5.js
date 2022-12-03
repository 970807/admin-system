const crypto = require('crypto')
const { adminMd5Salt } = require('../config/default.config')

module.exports = (str, salt = adminMd5Salt) => {
  return crypto
    .createHash('md5')
    .update(salt + str)
    .digest('hex')
}
