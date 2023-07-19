import http from '@/utils/request'
// 提现审批列表
function getPayConfigList(data) {
  return http({
    url: '/mg/mg/pay-config/list',
    method: 'get',
    data
  })
}

// 提现审批列表
function editPayConfig(data) {
  return http({
    url: '/mg/mg/pay-config/edit',
    method: 'post',
    data
  })
}

// 充值订单列表
function getPageList(data) {
  return http({
    url: '/acc/finance-recharge-order/pageList',
    method: 'post',
    data
  })
}

// 充值退款
function returnRechargeMoney(data) {
  return http({
    url: '/acc/finance-recharge-order/returnRechargeMoney',
    method: 'post',
    data
  })
}

// 查询退款进度
function searchReturnRecharge(data) {
  return http({
    url: '/acc/finance-recharge-order/searchReturnRecharge',
    method: 'post',
    data
  })
}

export {
  getPayConfigList,
  editPayConfig,
  getPageList,
  returnRechargeMoney,
  searchReturnRecharge
}
