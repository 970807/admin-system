import { http } from '@/utils/http'
import {
  IGetListParams,
  IGetListResult,
  IAddAccountData,
  IAddAccountResult,
  IEditAccountData,
  IEditAccountResult,
  IEditAccountPasswordData,
  IEditAccountPasswordResult,
  IDeleteAccountData,
  IDeleteAccountResult
} from './model/accountModel'

/**
 * @description: 获取账号列表
 */
export const getList = (params: IGetListParams) => {
  return http.request<IGetListResult>('get', '/api/meishijie/account/getList', {
    params
  })
}

/**
 * @description: 添加账号
 */
export const addAccount = (data: IAddAccountData) => {
  return http.request<IAddAccountResult>(
    'post',
    '/api/meishijie/account/addAccount',
    {
      data
    }
  )
}

/**
 * @description: 编辑账号
 */
export const editAccount = (data: IEditAccountData) => {
  return http.request<IEditAccountResult>(
    'put',
    '/api/meishijie/account/editAccount',
    { data }
  )
}

/**
 * @description: 修改密码
 */
export const editAccountPassword = (data: IEditAccountPasswordData) => {
  return http.request<IEditAccountPasswordResult>(
    'put',
    '/api/meishijie/account/editAccountPassword',
    { data }
  )
}

/**
 * @description: 删除账号
 */
export const deleteAccount = (data: IDeleteAccountData) => {
  return http.request<IDeleteAccountResult>(
    'delete',
    '/api/meishijie/account/deleteAccountById',
    { data }
  )
}
