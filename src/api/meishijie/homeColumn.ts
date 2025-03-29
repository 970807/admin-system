import { http } from '@/utils/http'
import {
  listItemType,
  IGetHomeColumnListParams,
  IGetHomeColumnListResults,
  getHomeColumnDetailResultType,
  addHomeColumnDataType,
  editHomeColumnDataType,
  updateHomeColumnSortNoDataType,
  batchDeleteHomeColumnDataType,
  availableHomeColumnDataType
} from './model/homeColumn'

/**
 * @description：获取首页栏位列表
 */
export const getHomeColumnList = (params: IGetHomeColumnListParams) => {
  return http.request<IGetHomeColumnListResults>(
    'get',
    '/api/meishijie/homeColumn/getHomeColumnList',
    { params }
  )
}

/**
 * @description：获取首页栏位详情
 */
export const getHomeColumnDetail = (id: listItemType['id']) => {
  return http.request<getHomeColumnDetailResultType>(
    'post',
    `/api/meishijie/homeColumn/getHomeColumnDetail/${id}`
  )
}

/**
 * @description：添加首页栏位
 */
export const addHomeColumn = (data: addHomeColumnDataType) => {
  return http.request('put', '/api/meishijie/homeColumn/addHomeColumn', {
    data
  })
}

/**
 * @description：编辑首页栏位
 */
export const editHomeColumn = (data: editHomeColumnDataType) => {
  return http.request('post', '/api/meishijie/homeColumn/editHomeColumn', {
    data
  })
}

/**
 * @description：更新首页栏位排序值
 */
export const updateHomeColumnSortNo = (
  data: updateHomeColumnSortNoDataType
) => {
  return http.request(
    'post',
    `/api/meishijie/homeColumn/updateHomeColumnSortNo/${data.id}/${data.sortNo}`
  )
}

/**
 * @description：批量删除首页栏位
 */
export const batchDeleteHomeColumn = (data: batchDeleteHomeColumnDataType) => {
  return http.request(
    'delete',
    '/api/meishijie/homeColumn/batchDeleteHomeColumn',
    { data }
  )
}

/**
 * @description：启用/禁用首页栏位
 */
export const availableHomeColumn = (data: availableHomeColumnDataType) => {
  return http.request('post', '/api/meishijie/homeColumn/availableHomeColumn', {
    data
  })
}
