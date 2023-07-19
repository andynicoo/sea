import request from '@/libs/request'

/**
 * 增值服务列表
 */
export const taxApplyServicesListAPI = data => {
    return request({
        url: '/workorder/management/taxApplyServices/list',
        data,
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        }
    })
}

/**
 * 工单添加备注
 */
 export const addRemarkAPI = data => {
  return request({
      url: '/workorder/management/taxApplyServices/add/remark',
      data,
      method: 'post',
  })
}


/**
 * 后台开始处理增值税申请服务工单
 */
 export const materialDispenseAPI = data => {
  return request({
      url: '/workorder/management/taxApplyServices/material/dispense',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}
/**
 * 后台开始处理增值税申请服务工单
 */
 export const taxApplyServicesDetail = data => {
  return request({
      url: '/workorder/management/taxApplyServices/detail',
      data,
      method: 'post',
  })
}

/**
 * 后台完成增值税申请服务工单
 */
 export const materialFinishAPI = data => {
  return request({
      url: '/workorder/management/taxApplyServices/material/finish',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}
/**
 * 后台无需处理增值税申请服务工单
 */
 export const materialOnDispenseAPI = data => {
  return request({
      url: '/workorder/management/taxApplyServices/material/on/dispense',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}

/**
 * 批量更新税务经理
 */
 export const changeDispose = data => {
  return request({
      url: '/workorder/management/taxApplyServices/disposeModifyBatch',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
  })
}