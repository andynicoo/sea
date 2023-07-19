import request from '@/utils/request'

/**
 * 公司列表
 */
export const companyList = (data, type) => {
  if (type === 'post') {
    return request({
      url: 'work_client/company/company_list',
      data,
      method: type
    })
  } else {
    const params = data
    return request({
      url: 'work_client/company/company_list',
      params,
      method: type
    })
  }
}
/**
 * 添加账号
 */
export const companyAdd = (data) => {
  return request({
    url: 'work_client/company/company_add',
    data,
    method: 'post'
  })
}
/**
   * 编辑公司
   */
export const companyEdit = (data) => {
  return request({
    url: 'work_client/company/company_edit',
    data,
    method: 'post'
  })
}
/**
   * 删除公司
   */
export const companyDelete = (data) => {
  return request({
    url: 'work_client/company/company_del',
    data,
    method: 'post'
  })
}
