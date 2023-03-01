import { http } from '@/utils/http'
import { IGetListParams, IGetListResult } from './model/accountModel'

/**
 * @description: 获取系统账号列表
 */
export const getList = (params: IGetListParams) => {
  return http.request<IGetListResult>('get', '/api/system/account/getList', {
    params
  })
}
