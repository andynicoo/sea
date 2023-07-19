import request from '@/libs/request';

/**
 * 获取续费列表
 */
export function renewalList(data) {
  return request({
    url: '/workorder/management/renewalCenter/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 条件查询续费服务天数范围对应的统计
 */
export function renewalStatistical(data) {
  return request({
    url: '/workorder/management/renewalCenter/statistical',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取当前登录账号跟进用户的公司信息
 */
export function listByCurrentAccount(params) {
  return request({
    url: '/workorder/management/userCompanyMaterial/listByCurrentAccount',
    method: 'get',
    params,
  });
}

/**
 * 导出续费
 */
export function renewalCenterExport(data) {
  return request({
    url: '/workorder/management/renewalCenter/export',
    method: 'post',
    data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取续费详情
 */
export function renewalDetail(serviceId) {
  return request({
    url: '/workorder/management/renewal/' + serviceId,
    method: 'get',
  });
}

/**
 * 获取续费跟进记录列表
 */
export function renewalFollowList(serviceId) {
  return request({
    url: '/workorder/management/renew_follow/list/' + serviceId,
    method: 'get',
  });
}

/**
 * 添加续费跟进记录
 */
export function renewalFollowSave(data) {
  return request({
    url: '/workorder/management/renew_follow/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取提醒记录列表
 */
export function messageSenderRecord(data) {
  return request({
    url: '/msg/messageSenderRecord/getPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取跟进标签列表
 */
export function renewalFollowLabel() {
  return request({
    url: '/workorder/management/renew_follow/listLabel',
    method: 'get',
  });
}
