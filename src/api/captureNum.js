
import request from '@/utils/request'

export function queryNum(data) {
    return request({
      url: '/captureNum/getCaptureNum',
      method: 'post',
      data
    })
  }

  export function getSortNum(data) {
    return request({
      url: '/captureNum/getSortNum',
      method: 'get',
      params:data
    })
  }

  export function getOneDay(data) {
    return request({
      url: '/captureNum/getOneDay',
      method: 'get',
      params:data
    })
  }

  export function getLongTime(data) {
    return request({
      url: '/captureNum/getLongTime',
      method: 'get',
      params:data
    })
  }