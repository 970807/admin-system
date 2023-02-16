import { http } from '@/utils/http'

export type GetLoginResult = {
  /** 用户名 */
  username: string
  /** 当前登陆用户的角色 */
  roles: Array<string>
  /** `token` */
  accessToken: string
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: Date
}

export type RefreshTokenResult = {
  /** `token` */
  accessToken: string
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: Date
}

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<GetLoginResult>('post', '/api/system/user/login', {
    data
  })
}

// TODO
/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>('post', '/refreshToken', { data })
}