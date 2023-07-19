import request from '@/libs/request'

//初审统计列表
export const getInitialAuditEfficiencyListApi = (params) => {
  return request({
    url: '/trademark/workOrderInitialAuditEfficiency/list',
    params,
    method: 'get',
  })
}

//初审统计数量汇总
export const getInitialAuditEfficiencyCountStatisticsApi = (params) => {
  return request({
    url: '/trademark/workOrderInitialAuditEfficiency/countStatistics',
    params,
    method: 'get',
  })
}

//OA统计列表
export const getOaStatisticsListApi = (params) => {
  return request({
    url: '/trademark/workOrderOaStatistics/list',
    params,
    method: 'get',
  })
}

//OA统计数量汇总
export const getOaCountStatisticsApi = (params) => {
  return request({
    url: '/trademark/workOrderOaStatistics/countStatistics',
    params,
    method: 'get',
  })
}

//律师审核统计列表
export const lawyerAuditListApi = (params) => {
  return request({
    url: '/trademark/workOrderMaterialDownloadOperateRecord/list',
    params,
    method: 'get',
  })
}

//律师审核统计
export const lawyerAuditStaticsApi = (params) => {
  return request({
    url: '/trademark/workOrderMaterialDownloadOperateRecord/countStatistics',
    params,
    method: 'get',
  })
}

//获取部门和员工
export const getAllUserAndDepartmentApi = (params) => {
  return request({
    url: '/trademark/management/UserDepartment/getAllUserAndDepartment',
    params,
    method: 'get',
  })
}
