import request from '@/libs/request'

// 获取增值服务分页数据
export const getAddServiceList = (data) => {
  return request({
    url: '/etax/taxApplyServices/manager/list',
    data,
    method: 'post'
  })
}

// 无需处理增值税申请服务工单
export const noChuli = (data) => {
  return request({
    url: '/etax/taxApplyServices/manager/material/dispense',
    data,
    method: 'post'
  })
}

// 完成增值税申请服务工单
export const finishChuli = (data) => {
  return request({
    url: '/etax/taxApplyServices/manager/material/finish',
    data,
    method: 'post'
  })
}

// 开始处理增值税申请服务工单
export const startChuli = (data) => {
  return request({
    url: '/etax/taxApplyServices/manager/material/dispose',
    data,
    method: 'post'
  })
}

//获取操作日志信息
export const getLog = (data) => {
  return request({
    url: '/etax/log/list',
    data,
    method: 'post'
  })
}
