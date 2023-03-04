import { http } from '@/utils/http'
import {
  listItemType,
  IGetListParams,
  IGetListResult,
  IIsExistAccountParams,
  IAddAccountData,
  IEditAccountData,
  IBatchDelData,
  IResetPasswordData
} from './model/accountModel'

/**
 * @description: 获取系统账号列表
 */
export const getList = (params: IGetListParams) => {
  return http.request<IGetListResult>('get', '/api/system/account/getList', {
    params
  })
}

/**
 * @description 判断账号是否重复
 */
export const isExistAccount = (params: IIsExistAccountParams) => {
  return http.request<boolean>('get', '/api/system/account/isExistAccount', {
    params
  })
}

/**
 * @description 添加账号
 */
export const addAccount = (data: IAddAccountData) => {
  return http.request<null>('put', '/api/system/account/addAccount', { data })
}

/**
 * @description 编辑账号
 */
export const editAccount = (id: listItemType['id'], data: IEditAccountData) => {
  return http.request<null>('post', `/api/system/account/editAccount/${id}`, {
    data
  })
}

/**
 * @description 启用/禁用账号
 * @param id 账号id
 * @param enable 是否启用：1启用 0禁用
 */
export const changeStatus = (id: listItemType['id'], enable: 0 | 1) => {
  return http.request<null>(
    'post',
    `/api/system/account/changeStatus/${id}/${enable}`
  )
}

/**
 * @description 批量删除账号
 */
export const batchDel = (data: IBatchDelData) => {
  return http.request<null>('delete', '/api/system/account/batchDel', { data })
}

/**
 * @description 删除账号
 */
export const delAccount = (id: listItemType['id']) => {
  return http.request<null>('delete', `/api/system/account/del/${id}`)
}

/**
 * @description 修改密码
 */
export const resetPassword = (data: IResetPasswordData) => {
  return http.request<null>('post', '/api/system/account/resetPassword', {
    data
  })
}
