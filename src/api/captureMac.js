import request from '@/utils/request'

export function listResult(query) {
  return request({
    url: '/hotMac',
    method: 'get',
    params: query
  })
}

export function deleteResult(data) {
  return request({
    url: '/hotMac',
    method: 'delete',
    data
  })
}
