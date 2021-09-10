const crypto = require('crypto')

module.exports = (str) => {
  return crypto
    .createHash('md5')
    .update('admin_system' + str)
    .digest('hex')
}
