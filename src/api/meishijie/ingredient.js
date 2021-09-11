import request from '@/utils/request'

export function getCategoryList(params) {
  return request({
    url: '/meishijie/ingredient/getCategoryList',
    method: 'get',
    params
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
