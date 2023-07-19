import http from '@/utils/request'
// 获取统计数据
function getEchartsList(data) {
  return http({
    url: '/mg/index-data/index-data',
    method: 'post',
    data
  })
}
// 交易额
function getTurnover(data) {
  return http({
    url: '/mg/index-data/turnoverShopStatistics',
    method: 'post',
    data
  })
}
// 注册用户
function getRegUser(data) {
  return http({
    url: '/mg/index-data/memberStatistical',
    method: 'post',
    data
  })
}
// 订单
function getOrder(data) {
  return http({
    url: '/mg/index-data/orderShopStatistics',
    method: 'post',
    data
  })
}
// 绑定店铺
function getBindShop(data) {
  return http({
    url: '/mg/index-data/bindShopStatistics',
    method: 'post',
    data
  })
}
// 留存率
function getRetention(data) {
  return http({
    url: '/mg/index-data/getretention',
    method: 'post',
    data
  })
}
// 导出留存(未登录用户)
function exportRetained(data) {
  return http({
    url: `/mg/index-data/export-user/`,
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
// 用户绑定店铺
function getUserBindShop(data) {
  return http({
    url: '/mg/index-data/userBinding',
    method: 'post',
    data
  })
}
// 下面是运营统计分析接口
// 查询登录用户详情信息
function loginUserDetails(data) {
  return http({
    url: '/statistics/statisticsFunctionUse/loginUserDetails',
    method: 'post',
    data
  })
}
// 查询功能用量
function statisticsFunctionUseQuery(data) {
  return http({
    url: '/statistics/statisticsFunctionUse/query',
    method: 'post',
    data
  })
}
// 通过字段查询详情
function queryDetailsByField(data) {
  return http({
    url: '/statistics/statisticsFunctionUse/queryDetailsByField',
    method: 'post',
    data
  })
}
// 下载详情数据
function downloadDetailsData(data) {
  return http({
    url: '/statistics/statisticsFunctionUse/downloadDetailsData',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
// 已绑定店铺商品采集详情信息
function queryBinding(data) {
  return http({
    url: '/statistics/statisticsFunctionUse/queryBindingStoreProductCrawlDetails',
    method: 'post',
    data
  })
}
// 未绑定店铺商品采集详情信息
function queryNoBinding(data) {
  return http({
    url: '/statistics/statisticsFunctionUse/queryNoBindingStoreProductCrawlDetails',
    method: 'post',
    data
  })
}

// 查询代打包的统计每日（mg数据看板）
function selectMgForwarderPackageCount(data) {
  return http({
    url: '/forwardertms/forwarderPackage/selectMgForwarderPackageCount',
    method: 'post',
    data
  })
}

// 查询代打包的列表（mg数据看板）
function selectMgForwarderPackageList(data) {
  return http({
    url: '/forwardertms/forwarderPackage/selectMgForwarderPackageList',
    method: 'post',
    data
  })
}

// 代打包的统计-导出
function downloadMgForwarderPackageStatistics(data) {
  return http({
    url: '/forwardertms/forwarderPackage/downloadMgForwarderPackageStatistics',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

export {
  getEchartsList,
  exportRetained,
  getTurnover,
  getRegUser,
  getOrder,
  getBindShop,
  getRetention,
  getUserBindShop,
  loginUserDetails,
  statisticsFunctionUseQuery,
  queryDetailsByField,
  downloadDetailsData,
  queryBinding,
  queryNoBinding,
  selectMgForwarderPackageCount,
  selectMgForwarderPackageList,
  downloadMgForwarderPackageStatistics
}
