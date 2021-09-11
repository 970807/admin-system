import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/meishijie/account/getList',
    method: 'get',
    params
  })
}

export function addAccount(data) {
  return request({
    url: '/meishijie/account/addAccount',
    method: 'post',
    data
  })
}

export function editAccount(data) {
  return request({
    url: '/meishijie/account/editAccount',
    method: 'put',
    data
  })
}

export function editAccountPassword(data) {
  return request({
    url: '/meishijie/account/editAccountPassword',
    method: 'put',
    data
  })
}

export function deleteAccountById(data) {
  return request({
    url: '/meishijie/account/deleteAccountById',
    method: 'delete',
    data
  })
}
