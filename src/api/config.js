import request from '@/utils/request'

export function doconfig(data) {
    return request({
      url: '/config/doconfig',
      method: 'post',
      data
    })
  }
  