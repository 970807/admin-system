import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}
