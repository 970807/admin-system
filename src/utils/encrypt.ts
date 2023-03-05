import JSEncrypt from 'jsencrypt'
import { getRSAPublicKey } from '@/api/system/common'

// 公钥 首次要从服务器获取
let publicKey = ''

const fetchPublicKey = async () => {
  const { data: publicKey } = await getRSAPublicKey()
  return publicKey
}

// 从服务器获取公钥
export const getRsaPublicKey = async () => {
  if (!publicKey) {
    publicKey = await fetchPublicKey()
  }
}

/**
 * rsa加密
 */
export const encrypt = async (str: string) => {
  if (!publicKey) {
    // 从服务器获取公钥
    publicKey = await fetchPublicKey()
  }
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  const encrypted = encrypt.encrypt(str)
  if (encrypted === false) {
    return Promise.reject(new Error('rsa加密失败'))
  }
  return encrypted
}
