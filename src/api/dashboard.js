import request from '@/utils/request'

export function getFrequencyPoints(query) {
  return request({
    url: '/devCommunication/scanNet?mode='+query,
    method: 'get',
    params: query
  })
}

export function doconfig(data) {
  return request({
    url: '/devCommunication/config',
    method: 'post',
    data
  })
}


export function importNum(data) {
  return request({
    url: '/devCommunication/importNum',
    method: 'post',
    data
  })
}

export function getConfig() {
  return request({
    url: '/devCommunication/getConfig',
    method:'get',
  })
}

export function queryNum(data) {
  return request({
    url: '/devCommunication/getCaptureNum',
    method: 'post',
    data
  })
}