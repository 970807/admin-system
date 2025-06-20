import { http } from '@/utils/http'
import type {
  IAuthListItem,
  IAddOrEditAuthData,
  IBatchDelAuthData
} from './model/auth'

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

/**
 * @description 删除权限
 */
export const delAuth = (id: IAuthListItem['id']) => {
  return http.request<null>('delete', `/api/system/auth/del/${id}`)
}

/**
 * @description 批量删除权限
 */
export const batchDelAuth = (data: IBatchDelAuthData) => {
  return http.request<null>('delete', '/api/system/auth/batchDel', { data })
}

/**
 * @description 更新排序值
 */
export const updateSortNo = (
  id: IAuthListItem['id'],
  sortNo: IAuthListItem['sortNo']
) => {
  return http.request<null>(
    'post',
    `/api/system/auth/updateSortNo/${id}/${sortNo}`
  )
}

/**
 * @description 启用&禁用
 */
export const changeStatus = (
  id: IAuthListItem['id'],
  enable: IAuthListItem['enable']
) => {
  return http.request<null>(
    'post',
    `/api/system/auth/changeStatus/${id}/${enable}`
  )
}
