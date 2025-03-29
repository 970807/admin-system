import { http } from '@/utils/http'
import {
  listItemType,
  IGetRecipeListParams,
  IGetRecipeListResult,
  getRecipeDetailByIdResultType,
  addRecipeDataType,
  editRecipeDataType,
  IImportFromHtmlStrDataType,
  IBatchDeleteRecipeData,
  IPublishRecipeData,
} from './model/recipeModel'

/**
 * @description：获取菜谱列表
 */
export const getRecipeList = (params: IGetRecipeListParams) => {
  return http.request<IGetRecipeListResult>(
    'get',
    '/api/meishijie/recipe/getRecipeList',
    { params }
  )
}

/**
 * @description：获取菜谱详情
 */
export const getRecipeDetailById = (params: { id: listItemType['id'] }) => {
  return http.request<getRecipeDetailByIdResultType>(
    'get',
    '/api/meishijie/recipe/getRecipeDetailById',
    {
      params
    }
  )
}

/**
 * @description：添加菜谱
 */
export const addRecipe = (data: addRecipeDataType) => {
  return http.request('post', '/api/meishijie/recipe/addRecipe', {
    data
  })
}

/**
 * @description：编辑菜谱
 */
export const editRecipe = (data: editRecipeDataType) => {
  return http.request('put', '/api/meishijie/recipe/editRecipe', { data })
}

/**
 * @description：html导入菜谱
 */
export const importFromHtmlStr = (data: IImportFromHtmlStrDataType) => {
  return http.request('post', '/api/meishijie/recipe/importFromHtmlStr', {
    data
  })
}

/**
 * @description：批量删除菜谱
 */
export const batchDeleteRecipe = (data: IBatchDeleteRecipeData) => {
  return http.request('delete', '/api/meishijie/recipe/batchDeleteRecipe', {
    data
  })
}

/**
 * @description：发布/取消发布
 */
export const publishRecipe = (data: IPublishRecipeData) => {
  return http.request('post', '/api/meishijie/recipe/publish', { data })
}
