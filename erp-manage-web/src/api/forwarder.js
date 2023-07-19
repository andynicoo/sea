import http from '@/utils/request'
// 查询货代商综合统计
function getStatisList(data) {
  return http({
    url: '/forwardertms/forwarderStatistics/list',
    method: 'post',
    data
  })
}

export {
  getStatisList
}
