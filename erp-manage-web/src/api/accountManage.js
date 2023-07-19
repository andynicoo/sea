import http from '@/utils/request'
// 获取货代商列表
function getForwarderList(data) {
  return http({
    url: '/forwardertms/forwarderInfo/pageList',
    method: 'post',
    data
  })
}

// 所有的货代商列表不分页
function getForwarderListAll(data) {
  return http({
    url: '/forwardertms/forwarderInfo/forwarderListAll',
    method: 'post',
    data
  })
}

// 查待付金额
function getPerPayMoney(data) {
  return http({
    url: '/forwardertms/forwarderInfo/get/perPayMoney',
    method: 'post',
    data
  })
}
// 查待付金额
function cashMoney(data) {
  return http({
    url: '/acc/finance-withdraw-order/prePayWithdraw',
    method: 'post',
    data
  })
}
// 获取货代商归类记录列表
function getClassificationList(data) {
  return http({
    url: '/forwardertms/forwarderInfo/classificationOptRecord',
    method: 'post',
    data
  })
}
// 货代商归类
function accountsClassification(data) {
  return http({
    url: '/forwardertms/forwarderInfo/accountsClassification',
    method: 'post',
    data
  })
}

// 海外服务商列表
function getSeaOverseasList(data) {
  return http({
    url: '/mg/mg/forwarder/sea-system-list',
    method: 'post',
    data
  })
}

// 新增海外服务商
function addSeaOverseas(data) {
  return http({
    url: '/mg/mg/forwarder/add-sea-system',
    method: 'post',
    data
  })
}

// 修改海外服务商
function editSeaOverseas(data) {
  return http({
    url: '/mg/mg/forwarder/modify-sea-system',
    method: 'post',
    data
  })
}

// 获取所有可用的海外仓库
function getAllOverseasStore(data) {
  return http({
    url: '/mg/mg/forwarder/all-overseas-store',
    method: 'post',
    data
  })
}

export {
  getForwarderList,
  getForwarderListAll,
  getPerPayMoney,
  cashMoney,
  getClassificationList,
  accountsClassification,
  getSeaOverseasList,
  addSeaOverseas,
  editSeaOverseas,
  getAllOverseasStore
}
