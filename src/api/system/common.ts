import { http } from '@/utils/http'
import { IGetCaptchaResult } from './model/common'

/**
 * @description 获取rsa公钥
 */
export const getRSAPublicKey = () => {
  return http.request<string>('get', '/api/system/common/getRSAPublicKey')
}

/**
 * @description 获取验证码
 */
export const getCaptcha = () => {
  return http.request<IGetCaptchaResult>('get', '/api/system/common/getCaptcha')
}
