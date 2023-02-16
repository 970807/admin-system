import { http } from '@/utils/http'
import { IGetListParams, IGetListResult } from './model/accountListModel'

/**
 * @description: 获取账号列表
 */
export const getList = (params: IGetListParams) => {
  return http.request<IGetListResult>('get', '/api/meishijie/account/getList', {
    params
  })
}
