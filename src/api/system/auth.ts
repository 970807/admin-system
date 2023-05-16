import { http } from '@/utils/http'
import type { IAuthListItem, IAddOrEditAuthData } from './model/auth'

/**
 * @description 获取权限列表
 */
export const getList = () => {
  return http.request<IAuthListItem[]>('get', '/api/system/auth/getList')
}

/**
 * @description 添加&编辑权限
 */
export const addOrEditAuth = (data: IAddOrEditAuthData) => {
  return http.request<null>('post', '/api/system/auth/addOrEditAuth', { data })
}
