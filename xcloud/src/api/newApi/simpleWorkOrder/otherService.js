import request from '@/libs/request'

/**
 * 获取极简工单列表
 */
export const getSimpleWorkOrderList = data => {
    return request({
        url: '/workorder/management/simpleWorkOrder/page',
        data,
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        }
    })
}

/**
 * 获取极简工单详情
 */
 export const getSimpleWorkOrderInfo = id => {
  return request({
      url: '/workorder/management/simpleWorkOrder/detail/' + id,
      method: 'get'
  })
}

/**
 * 税务经理认领
 */
 export const dispose = id => {
  return request({
      url: '/workorder/management/simpleWorkOrder/dispose/' + id,
      method: 'post'
  })
}

/**
 * 税务经理批量认领
 */
 export const batchDispose = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/dispose',
      data,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
 * 供应链认领
 */
 export const supplyChain = id => {
  return request({
      url: '/workorder/management/simpleWorkOrder/supplyChain/' + id,
      method: 'post'
  })
}

/**
 * 供应链批量认领
 */
 export const batchSupplyChain = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/supplyChain-batch',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 单个修改状态
*/
export const changeStatus = data => {
  return request({
     url: '/workorder/management/simpleWorkOrder/status',
     data,
     method: 'put',
     headers: {
       'Content-Type': 'application/json'
     }
  })
}

/**
* 批量修改状态
*/
export const batchStatus = data => {
  return request({
     url: '/workorder/management/simpleWorkOrder/status-batch',
     data,
     method: 'put',
     headers: {
       'Content-Type': 'application/json'
     }
  })
}

/**
* 更改税务经理
*/
export const changeDispose = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/dispose',
      data,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 更改供应链专员
*/
export const changeSupplyChain = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/supplyChain',
      data,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 导出
*/
export const exportWorkOrder = params => {
  return request({
      url: '/workorder/management/simpleWorkOrder/export',
      params,
      method: 'get',
      responseType: 'blob'
  })
}

/**
* 添加进度
*/
export const addSimpleWorkProgress = data => {
  return request({
      url: '/workorder/management/simpleWorkProgress',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 订单详情
*/
export const simpleWorkProgressOrderInfo = id => {
  return request({
      url: '/workorder/management/simpleWorkOrder/order/' + id,
      method: 'get'
  })
}

/**
* 获取当前企业下的服务商/律师
*/
export const getSimpleWorkOrderSupplier = code => {
  return request({
      url: '/workorder/management/simpleWorkOrder/supplier/' + code,
      method: 'get'
  })
}

/**
* 更换服务商/律师
*/
export const changeSimpleWorkOrderSupplier = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/supplier',
      data,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 更换公司名称
*/
export const changeSimpleWorkOrderCompany = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/company',
      data,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 上传资料清单
*/
export const simpleWorkOrderReferApi = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/refer',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 上传客户资料
*/
export const simpleWorkOrderMaterialApi = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/material',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 客服认领
*/
export const customerSupportApi = id => {
  return request({
      url: `/workorder/management/simpleWorkOrder/customerSupport/${id}`,
      method: 'post'
  })
}

/**
* 批量修改客服
*/
export const batchCustomerSupportApi = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/customerSupport',
      data,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 回执下载
*/
export const materialDownApi = params => {
  return request({
      url: '/workorder/management/simpleWorkOrder/material/down',
      params,
      method: 'get',
      responseType: "blob",
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
  })
}

/**
* 驳回
*/
export const rejectApi = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/reject',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
* 驳回
*/
export const upLoadReceiptApi = data => {
  return request({
      url: '/workorder/management/simpleWorkOrder/receipt',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
 * 删除备注
 */
 export const delRemarkById = id => {
  return request({
      url: '/workorder/management/simpleWorkProgress/' + id,
      method: 'delete'
  })
}
