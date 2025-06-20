import { http } from '@/utils/http'
import {
  listItemType,
  IGetListResult,
  IExistRoleNameParams,
  IExistRoleNameResult,
  IAddOrEditRoleData,
  IBatchDelData,
  IRoleAuthData
} from './model/role'
import { IAuthListItem } from './model/auth'

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
export const editRole = (id: listItemType['id'], data: IAddOrEditRoleData) => {
  return http.request<null>('post', `/api/system/role/editRole/${id}`, { data })
}

/**
 * @description 启用/禁用角色
 * @param id 角色id
 * @param enable 是否启用：1启用 0禁用
 */
export const changeRoleStatus = (id: listItemType['id'], enable: 0 | 1) => {
  return http.request<null>(
    'post',
    `/api/system/role/changeRoleStatus/${id}/${enable}`
  )
}

/**
 * @description 批量删除角色
 */
export const batchDel = (data: IBatchDelData) => {
  return http.request<null>('delete', '/api/system/role/batchDel', { data })
}

/**
 * @description 删除角色
 */
export const delRole = (id: listItemType['id']) => {
  return http.request<null>('delete', `/api/system/role/del/${id}`)
}

/**
 * @description 角色授权
 */
export const roleAuth = (roleId: listItemType['id'], data: IRoleAuthData) => {
  return http.request<null>('post', `/api/system/role/roleAuth/${roleId}`, {
    data
  })
}

/**
 * @description 获取角色拥有的权限id列表
 */
export const getAuthIdsByRoleId = (roleId: listItemType['id']) => {
  return http.request<Array<IAuthListItem['id']>>(
    'get',
    `/api/system/role/getAuthIdsByRoleId/${roleId}`
  )
}
