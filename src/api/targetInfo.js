import request from '@/utils/request'

export function listTargetInfo(query) {
  var param = request({
    url: '/numberCompare',
    method: 'get',
    params: query
  })
  return param
}
export function deleteTargetInfo(ids) {
  return request({
    url: '/numberCompare',
    method: 'delete',
    data: ids
  })
}
export function exportTargetInfo(param) {
  return request({
    url: '/numberCompare',
    method: 'get',
    params: param,
    responseType: 'blob'
  })
}


export function excelExport(dataPoiList){
  return request(
    {
      url: '/numberCompare/export',
      method: 'post',
      data: dataPoiList,
      responseType: 'blob'
    }
  )
}
