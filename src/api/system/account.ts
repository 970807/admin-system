import { http } from '@/utils/http'
import {
  IGetListParams,
  IGetListResult,
  IIsExistAccountParams,
  IAddAccountData,
  IEditAccountData
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
export const editAccount = (id: number, data: IEditAccountData) => {
  return http.request<null>('post', `/api/system/account/editAccount/${id}`, {
    data
  })
}

/**
 * @description 启用/禁用账号
 * @param id 账号id
 * @param enable 是否启用：1启用 0禁用
 */
export const changeStatus = (id: number, enable: 0 | 1) => {
  return http.request<null>(
    'post',
    `/api/system/account/changeStatus/${id}/${enable}`
  )
}
