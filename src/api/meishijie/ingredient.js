import request from '@/utils/request'

export function getCategoryList(params) {
  return request({
    url: '/meishijie/ingredient/getCategoryList',
    method: 'get',
    params
  })
}

export function getAllCategoryList() {
  return request({
    url: '/meishijie/ingredient/getAllCategoryList',
    method: 'get'
  })
}

export function addCategory(data) {
  return request({
    url: '/meishijie/ingredient/addCategory',
    method: 'post',
    data
  })
}

export function editCategory(data) {
  return request({
    url: '/meishijie/ingredient/editCategory',
    method: 'put',
    data
  })
}

export function batchDeleteCategory(data) {
  return request({
    url: '/meishijie/ingredient/batchDeleteCategory',
    method: 'delete',
    data
  })
}

export function getIngredientList(params) {
  return request({
    url: '/meishijie/ingredient/getIngredientList',
    method: 'get',
    params
  })
}

export function addIngredient(data) {
  return request({
    url: '/meishijie/ingredient/addIngredient',
    method: 'post',
    data
  })
}

export function editIngredient(data) {
  return request({
    url: '/meishijie/ingredient/editIngredient',
    method: 'put',
    data
  })
}

export function batchDeleteIngredient(data) {
  return request({
    url: '/meishijie/ingredient/batchDeleteIngredient',
    method: 'delete',
    data
  })
}
