import http from '@/utils/request'
// 获取旺币记录
function getCashRecord(data) {
  return http({
    url: '/acc/fw/finance/record/list',
    method: 'post',
    data
  })
}
// 获取任务
function getTaskList() {
  return http({
    url: '/mg/mg/market-task-conf/get'
  })
}
// 保存任务设置
function savaTaskConfig(data) {
  return http({
    url: '/mg/mg/market-task-conf/set',
    method: 'post',
    data
  })
}
// 导出旺币记录
function exportFinanceRecord(data) {
  return http({
    url: '/acc/fw/finance/record/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
// 列表查询旺币分配列表
function getFinanceRecord(data) {
  return http({
    url: '/mg/mg/finance/dis_record/list',
    method: 'post',
    data
  })
}
// 增加旺币分配记录
function addFinanceRecord(data) {
  return http({
    url: '/acc/finance-record/dis_record/add',
    method: 'post',
    data
  })
}
// 根据用户账户查询账户余额
function getFinanceAccAmount(data) {
  return http({
    url: '/mg/mg/finance/dis_record/getAccAmount',
    method: 'post',
    data
  })
}

// 旺币分配 导入
function importDisRecord (data) {
  return http({
    url: '/acc/finance-record/importDisRecord ',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export {
  getCashRecord,
  getTaskList,
  savaTaskConfig,
  exportFinanceRecord,
  getFinanceRecord,
  addFinanceRecord,
  getFinanceAccAmount,
  importDisRecord
}
