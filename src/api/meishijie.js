import request from '@/utils/request'

export function getAccountList(params) {
  return request({
    url: '/meishijie/getAccountList',
    method: 'get',
    params
  })
}

export function addAccount(data) {
  return request({
    url: '/meishijie/addAccount',
    method: 'post',
    data
  })
}

export function editAccount(data) {
  return request({
    url: '/meishijie/editAccount',
    method: 'put',
    data
  })
}

export function editAccountPassword(data) {
  return request({
    url: '/meishijie/editAccountPassword',
    method: 'put',
    data
  })
}

export function deleteAccountById(data) {
  return request({
    url: '/meishijie/deleteAccountById',
    method: 'delete',
    data
  })
}
