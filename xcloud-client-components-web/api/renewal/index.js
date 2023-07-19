import request from '@/utils/request';

/**
 * 获取续费管理列表
 */
export const renewalList = (data) => {
  return request({
    // url: '/workorder/client/renewal/pageList',
    url: '/workorder/client/renewal/new/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 获取续费管理状态开启
 */
export const renewalStatus = (data) => {
  return request({
    url: '/etax/order_services/couponActivity',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//续费状态统计
export const renewalStatistical = (data) => {
  return request({
    url: '/workorder/client/renewal/statistical',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//续费服务公司对应的数量
export const companyStatistical = (data) => {
  return request({
    url: '/workorder/client/renewal/company/statistical',
    // data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//续费国家
export const renewalCountry = () => {
  return request({
    url: '/workorder/client/renewal/country',
    // data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//续费导出
export const renewalExport = (data) => {
  return request({
    url: '/workorder/client/renewal/export',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    responseType: 'blob',
  });
};

//客户端/小程序端获取最近要续费的服务信息
export const renewalBefore = (data) => {
  return request({
    url: '/workorder/client/renewal/before',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
