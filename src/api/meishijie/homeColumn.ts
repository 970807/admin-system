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
  availableHomeColumnDataType,
  IGetTodayHotVideoRecipeParams,
  updateTodayHotVideoRecipeSortNoDataType,
  deleteTodayHotVideoRecipeDataType,
  IGetTodayHotSearchParams,
  IGetTodayHotSearchResults,
  addTodayHotSearchDataType,
  updateTodayHotSearchSortNoDataType,
  IGetTodayThreeMealsListParams,
  getTodayThreeMealsListResults,
  addTodayThreeMealsDataType,
  updateTodayThreeMealsSortNoDataType,
  IGetColumnRecipeListParams,
  getColumnRecipeListResults,
  addColumnRecipeDataType,
  updateColumnRecipeSortNoDataType
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

/**
 * @description：首页栏位-今日热门视频菜谱-添加
 */
export const addTodayHotVideoRecipe = (data: { recipeIdList: string[] }) => {
  return http.request(
    'post',
    '/api/meishijie/homeColumn/addTodayHotVideoRecipe',
    { data }
  )
}

/**
 * @description：首页栏位-今日热门视频菜谱-查询列表
 */
export const getTodayHotVideoRecipe = (
  params: IGetTodayHotVideoRecipeParams
) => {
  return http.request<any[]>(
    'get',
    '/api/meishijie/homeColumn/getTodayHotVideoRecipe',
    { params }
  )
}

/**
 * @description：首页栏位-今日热门视频菜谱-更新排序值
 */
export const updateTodayHotVideoRecipeSortNo = (
  data: updateTodayHotVideoRecipeSortNoDataType
) => {
  return http.request(
    'post',
    '/api/meishijie/homeColumn/updateTodayHotVideoRecipeSortNo',
    { data }
  )
}

/**
 * @description：首页栏位-今日热门视频菜谱-删除菜谱
 */
export const deleteTodayHotVideoRecipe = (
  data: deleteTodayHotVideoRecipeDataType
) => {
  return http.request(
    'delete',
    '/api/meishijie/homeColumn/deleteTodayHotVideoRecipe',
    { data }
  )
}

/**
 * @description：首页栏位-今日热搜-查询列表
 */
export const getTodayHotSearch = (params: IGetTodayHotSearchParams) => {
  return http.request<IGetTodayHotSearchResults>(
    'get',
    '/api/meishijie/homeColumn/getTodayHotSearch',
    {
      params
    }
  )
}

/**
 * @description：首页栏位-今日热搜-添加热搜
 */
export const addTodayHotSearch = (data: addTodayHotSearchDataType) => {
  return http.request('post', '/api/meishijie/homeColumn/addTodayHotSearch', {
    data
  })
}

/**
 * @description：首页栏位-今日热搜-更新排序值
 */
export const updateTodayHotSearchSortNo = (
  data: updateTodayHotSearchSortNoDataType
) => {
  return http.request(
    'put',
    '/api/meishijie/homeColumn/updateTodayHotSearchSortNo',
    {
      data
    }
  )
}

/**
 * @description:首页栏位-今日热搜-删除热搜
 */
export const deleteTodayHotSearch = (id: string) => {
  return http.request(
    'delete',
    `/api/meishijie/homeColumn/deleteTodayHotSearch/${id}`
  )
}

/**
 * @description:首页栏位-今日三餐-查询列表
 */
export const getTodayThreeMealsList = (
  params: IGetTodayThreeMealsListParams
) => {
  return http.request<getTodayThreeMealsListResults>(
    'get',
    '/api/meishijie/homeColumn/getTodayThreeMealsList',
    { params }
  )
}

/**
 * @description:首页栏位-今日三餐-添加菜谱
 */
export const addTodayThreeMeals = (data: addTodayThreeMealsDataType) => {
  return http.request('post', '/api/meishijie/homeColumn/addTodayThreeMeals', {
    data
  })
}

/**
 * @description:首页栏位-今日三餐-更新排序值
 */
export const updateTodayThreeMealsSortNo = (
  data: updateTodayThreeMealsSortNoDataType
) => {
  return http.request(
    'put',
    '/api/meishijie/homeColumn/updateTodayThreeMealsSortNo',
    { data }
  )
}

/**
 * @description:首页栏位-今日三餐-删除菜谱
 */
export const deleteTodayThreeMeals = (data: { idList: string[] }) => {
  return http.request(
    'delete',
    '/api/meishijie/homeColumn/deleteTodayThreeMeals',
    { data }
  )
}

/**
 * @description：首页栏位-(非系统)菜谱管理-查询列表
 */
export const getColumnRecipeList = (
  columnId: string,
  params: IGetColumnRecipeListParams
) => {
  return http.request<getColumnRecipeListResults>(
    'get',
    `/api/meishijie/homeColumn/getColumnRecipeList/${columnId}`,
    { params }
  )
}

/**
 * @description：首页栏位-(非系统)菜谱管理-添加菜谱
 */
export const addColumnRecipe = (data: addColumnRecipeDataType) => {
  return http.request('post', '/api/meishijie/homeColumn/addColumnRecipe', {
    data
  })
}

/**
 * @description：首页栏位-(非系统)菜谱管理-更新排序值
 */
export const updateColumnRecipeSortNo = (
  data: updateColumnRecipeSortNoDataType
) => {
  return http.request(
    'put',
    '/api/meishijie/homeColumn/updateColumnRecipeSortNo',
    { data }
  )
}

/**
 * @description：首页栏位-(非系统)菜谱管理-删除菜谱
 */
export const deleteColumnRecipe = (data: { idList: string[] }) => {
  return http.request(
    'delete',
    '/api/meishijie/homeColumn/deleteColumnRecipe',
    { data }
  )
}
