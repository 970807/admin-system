import { http } from '@/utils/http'
import {
  IGetListResult,
  IExistRoleNameParams,
  IExistRoleNameResult,
  IAddOrEditRoleData
} from './model/role'

/**
 * @description 获取角色列表
 */
export const getList = () => {
  return http.request<IGetListResult>('get', '/api/system/role/getList')
}

/**
 * @description 查询角色名是否存在 true：存在 false：不存在
 */
export const existRoleName = (params: IExistRoleNameParams) => {
  return http.request<IExistRoleNameResult>(
    'get',
    '/api/system/role/existRoleName',
    { params }
  )
}

/**
 * @description 添加角色
 */
export const addRole = (data: IAddOrEditRoleData) => {
  return http.request<null>('put', '/api/system/role/addRole', { data })
}

/**
 * @description 编辑角色
 */
export const editRole = (id: number, data: IAddOrEditRoleData) => {
  return http.request<null>('post', `/api/system/role/editRole/${id}`, { data })
}
