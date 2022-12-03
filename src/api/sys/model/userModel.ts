/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string
  password: string
}

export interface RoleInfo {
  roleName: string
  value: string
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number
  token: string
  // role: RoleInfo
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  // 用户id
  id: string | number
  // 用户名
  username: string
  // 昵称
  nickname: string
  // 创建时间
  createTIme: string
  // 更新时间
  updateTIme: string
}
