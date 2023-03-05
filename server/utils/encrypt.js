const crypto = require('crypto')
const NodeRSA = require('node-rsa')

// RSA加解密
const key = new NodeRSA({ b: 1024 })
key.setOptions({ encryptionScheme: 'pkcs1' }) //指定加密格式

// 生成RSA公钥私钥 使用pkcs8标准 pem格式
exports.publicKey = key.exportKey('pkcs8-public-pem')
exports.privateKey = key.exportKey('pkcs8-private-pem')

// RSA加密
exports.rsaEncrypt = str => {
  const encrypted = key.encryptPrivate(str, 'base64')
  return encrypted
}

// RSA解密
exports.rsaDecrypt = str => {
  const decrypted = key.decrypt(str, 'utf8')
  return decrypted
}

// AES加解密
const algorithm = 'aes-256-cbc'
const aesKey = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

// AES加密
exports.aesEncrypt = str => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(aesKey), iv)
  let crypted = cipher.update(str, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

// AES解密
exports.aesDecrypt = str => {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(aesKey), iv)
  let decrypted = decipher.update(str, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
