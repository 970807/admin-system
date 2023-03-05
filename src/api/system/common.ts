import { http } from '@/utils/http'

/**
 * @description 获取rsa公钥
 */
export const getRSAPublicKey = () => {
  return http.request<string>('get', '/api/system/common/getRSAPublicKey')
}
