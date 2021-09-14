import request from '@/utils/request'

export function getRecipeList(params) {
  return request({
    url: '/meishijie/recipe/getRecipeList',
    method: 'get',
    params
  })
}

export function addRecipe(data) {
  return request({
    url: '/meishijie/recipe/addRecipe',
    method: 'post',
    data
  })
}

export function editRecipe(data) {
  return request({
    url: '/meishijie/recipe/editRecipe',
    method: 'put',
    data
  })
}

export function getRecipeDetailById(params) {
  return request({
    url: '/meishijie/recipe/getRecipeDetailById',
    method: 'get',
    params
  })
}

export function importFromHtmlStr(data) {
  return request({
    url: '/meishijie/recipe/importFromHtmlStr',
    method: 'post',
    data
  })
}
