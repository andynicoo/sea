import request from '@/libs/request'

/**
 * 获取操作指引列表
 */
 export const getOperationDocumentList = params => {
  return request({
      url: '/information/management/operationDocument/page',
      params,
      method: 'get'
  })
}

/**
 * 获取操作指引回显详情
 */
 export const getOperationDocumentInfo = id => {
  return request({
      url: '/information/management/operationDocument/' + id,
      method: 'get'
  })
}

/**
 * 获取操作指引回显详情
 */
 export const getOperationDocumentAllInfo = id => {
  return request({
      url: '/information/management/operationDocument/item/' + id,
      method: 'get'
  })
}

/**
 * 添加操作指引
 */
 export const addOperationDocument = data => {
  return request({
      url: '/information/management/operationDocument',
      data,
      method: 'post',
      headers: {
          'Content-Type': 'application/json'
      }
  })
}

/**
 * 编辑操作指引
 */
 export const updateOperationDocument = data => {
  return request({
      url: '/information/management/operationDocument',
      data,
      method: 'put',
      headers: {
          'Content-Type': 'application/json'
      }
  })
}

/**
 * 删除操作指引
 */
 export const delOperationDocument = id => {
  return request({
      url: '/information/management/operationDocument/' + id,
      method: 'delete'
  })
}

/**
 * 禁用/启用操作指引
 */
 export const disabledOperationDocument = (id, status) => {
  return request({
      url: '/information/management/operationDocument/' + id + '/status/' + status,
      method: 'put'
  })
}