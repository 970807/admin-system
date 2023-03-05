const NodeRSA = require('node-rsa')
const key = new NodeRSA({ b: 1024 })
key.setOptions({ encryptionScheme: 'pkcs1' }) //指定加密格式

// 生成公钥私钥 使用pkcs8标准 pem格式
exports.publicKey = key.exportKey('pkcs8-public-pem')
exports.privateKey = key.exportKey('pkcs8-private-pem')

// rsa加密
exports.encrypt = str => {
  const encrypted = key.encryptPrivate(str, 'base64')
  return encrypted
}

// rsa解密
exports.decrypt = str => {
  const decrypted = key.decrypt(str, 'utf8')
  return decrypted
}
