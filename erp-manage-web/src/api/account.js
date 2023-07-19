import http from '@/utils/request'
// 提现审批列表
function getAccountList(data) {
  return http({
    url: '/acc/fw/finance/list',
    method: 'post',
    data
  })
}
// 同意汇款
function moneyAgree(data) {
  return http({
    url: '/acc/fw/finance/withdraw/send-money',
    method: 'post',
    data
  })
}
// 拒绝汇款
function moneyRefuse(data) {
  return http({
    url: '/acc/fw/finance/withdraw/refuse',
    method: 'post',
    data
  })
}
// 同步
function getAccountListAPi(data) {
  return http({
    url: '/acc/finance-withdraw-order/searchOnePay',
    method: 'post',
    data
  })
}

// 提现审批列表
function getSettlementList(data) {
  return http({
    url: '/mg/mg/erpOrder/list/settle',
    method: 'post',
    data
  })
}
// 订单列表
function getOrderList(data) {
  return http({
    url: '/mg/mg/erpOrder/list',
    method: 'post',
    data
  })
}

// 结算审核
function auditSettle(data) {
  return http({
    url: '/mg/mg/erpOrder/audit/settle',
    method: 'post',
    data
  })
}

// 退款审核
function auditRefund(data) {
  return http({
    url: '/mg/mg/erpOrder/audit/refund',
    method: 'post',
    data
  })
}

// 订单额信息
function getOrderTotal(data) {
  return http({
    url: '/mg/mg/erpOrder/orderTotal',
    method: 'post',
    data
  })
}

// 搜索条件
function getOrderCondition(data) {
  return http({
    url: '/mg/setMeal/get/condition',
    method: 'post',
    data
  })
}

// 运营后台包裹列表
function getForwarderPackageList(data) {
  return http({
    url: '/forwardertms/forwarderPackage/mgForwarderPackageList',
    method: 'post',
    data
  })
}

// 运营后台包裹列表 导出
function downloadMgForwarderPackageList(data) {
  return http({
    url: '/forwardertms/forwarderPackage/downloadMgForwarderPackageList',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 支持提现单导出功能
function exportData(data) {
  return http({
    url: '/acc/fw/finance/financeWithdraw/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 预付款提现审批优化 导出
function exportRecord(data) {
  return http({
    url: '/acc/fw/finance/advance/export',
    method: 'get',
    data,
    responseType: 'arraybuffer'
  })
}

// 获取代付渠道
function supportChannel(data) {
  return http({
    url: '/acc/fw/finance/withdraw/support-channel',
    method: 'post',
    data
  })
}

export {
  getAccountList,
  moneyAgree,
  moneyRefuse,
  getAccountListAPi,
  getSettlementList,
  getOrderList,
  auditSettle,
  auditRefund,
  getOrderTotal,
  getOrderCondition,
  getForwarderPackageList,
  downloadMgForwarderPackageList,
  exportData,
  exportRecord,
  supportChannel
}
