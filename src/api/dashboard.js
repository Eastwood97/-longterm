import request from '@/utils/request'

export function getFrequencyPoints(query) {
  return request({
    url: '/devCommunication/scanNet',
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

export function getConfig(data) {
  return request({
    url: '/devCommunication/getConfig?devId='+data,
    method:'get',
    data
  })
}



export function reboot(data) {
  return request({
    url: '/devCommunication/reboot?devId='+data,
    method:'get',
    data
  })
}


export function queryNum(data) {
  return request({
    url: '/devCommunication/getCaptureNum',
    method: 'post',
    data
  })
}