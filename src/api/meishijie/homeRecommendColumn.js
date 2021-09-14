import request from '@/utils/request'

export function getColumnList(params) {
  return request({
    url: '/meishijie/homeRecommendColumn/getColumnList',
    method: 'get',
    params
  })
}

export function getColumnDetail(params) {
  return request({
    url: '/meishijie/homeRecommendColumn/getColumnDetail',
    method: 'get',
    params
  })
}

export function addColumn(data) {
  return request({
    url: '/meishijie/homeRecommendColumn/addColumn',
    method: 'post',
    data
  })
}

export function editColumn(data) {
  return request({
    url: '/meishijie/homeRecommendColumn/editColumn',
    method: 'put',
    data
  })
}

export function deleteColumn(data) {
  return request({
    url: '/meishijie/homeRecommendColumn/deleteColumn',
    method: 'delete',
    data
  })
}
