import request from '@/utils/request'
const src = 'orderserver/'

/**
 * 获取合同列表
 */
export const getContractList = (obj) => {
  const data = obj
  return request({
    url: src + 'contract/vat/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//上传回传合同
export const contractBack = (data) => {
  return request({
    url: src + 'contract/vat/comesBack',
    data,
    method: 'post'
  })
}
//下载合同
export const downloadContract = (data) => {
  return request({
    url: src + 'contract/vat/look',
    data,
    method: 'post'
  })
}
//查看合同
export const lookContract = (data) => {
  return request({
    url: src + 'contract/vat/dfs/look',
    data,
    method: 'post'
  })
}
