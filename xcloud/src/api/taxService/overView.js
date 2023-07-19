import request from '@/libs/request'

//申报数据总览
export const taxWorkOrderData = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/taxWorkOrder',
    data,
    method: 'post'
  })
}

//各国服务情况总览
export const taxCountryData = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/service/country',
    data,
    method: 'post'
  })
}

//服务数据概览
export const taxServiceData = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/service',
    data,
    method: 'post'
  })
}

//业务数据统计
export const progressDataApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/overView',
    data,
    method: 'post'
  })
}


//业务数据统计
export const businessAnalysisDataApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/business',
    data,
    method: 'post'
  })
}

//注册用户数视图
export const registerUserViewApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/business/registerUser',
    data,
    method: 'post'
  })
}

//线索总数视图
export const clewViewApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/business/clew',
    data,
    method: 'post'
  })
}


//注册用户数视图
export const payUserViewApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/business/payUser',
    data,
    method: 'post'
  })
}

//订单数视图
export const orderViewApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/business/order',
    data,
    method: 'post'
  })
}

//订单数视图
export const taxVatServiceViewApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/business/taxVatService',
    data,
    method: 'post'
  })
}

//成交金额视图
export const payAmountViewApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/business/payAmount',
    data,
    method: 'post'
  })
}

//各部门数据
export const department = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department',
    data,
    method: 'post'
  })
}

//具体销售情况
export const saleInfo = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department/saleInfo',
    data,
    method: 'post'
  })
}

//服务数据
export const serviceAnalysis = (data) => {
  return request({
    url: '/etax/management/dataanalysis/serviceAnalysis',
    data,
    method: 'post'
  })
}


//运营部门数据统计
export const operationApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department/operation',
    data,
    method: 'post'
  })
}

//运营部门用户数据统计
export const operationUserApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department/operation/user',
    data,
    method: 'post'
  })
}

//运营部门用户数据统计
export const operationViewApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department/operation/view',
    data,
    method: 'post'
  })
}


//销售部门数据统计
export const saleApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department/sale',
    data,
    method: 'post'
  })
}

//销售部门人员数据统计
export const saleUserApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department/sale/user',
    data,
    method: 'post'
  })
}

//销售部门数据视图
export const saleViewApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department/sale/view',
    data,
    method: 'post'
  })
}


//根据部门编码获取所有部门
export const departmentListApi = (data) => {
  return request({
    url: '/etax/department/manage/department/list',
    data,
    method: 'post'
  })
}

//根据部门编码获取所有人员
export const departmentUserListApi = (data) => {
  return request({
    url: '/etax/department/manage/department/user/list',
    data,
    method: 'post',
  })
}


//获取销售销售目标汇总
export const targetSummary = (data) => {
  return request({
    url: '/etax/department/manage/department/sale/target/summary',
    data,
    method: 'post',
  })
}



//批量添加或修改销售目标
export const saveOrUpdate = (data) => {
  return request({
    url: '/etax/department/manage/sale/target/saveOrUpdate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


//添加或修改运营人员线索
export const operatSaveOrUpdate = (data) => {
  return request({
    url: '/etax/department/manage/operation/userClew/saveOrUpdate',
    data,
    method: 'post',
  })
}

//渠道部门人员数据统计
export const channelUserApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department/channel/user',
    data,
    method: 'post',
  })
}

//渠道部门数据统计
export const channelApi = (data) => {
  return request({
    url: '/etax/management/dataanalysis/statistic/department/channel',
    data,
    method: 'post'
  })
}
