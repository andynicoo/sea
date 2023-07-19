import request from '@/utils/request';

// 获取商标核名报告
export const getTrademarkCheckReport = (data) => {
  return request({
    url: '/workorder/trademark-search-record-report/info/link',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};
// 商标核名报告用户确认
export const handleCheckReportUserConfirm = (data) => {
  return request({
    url: '/workorder/client/trademark-search-record-report/userConfirm',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 获取所有大类
export const getAllCategoryList = () => {
  return request({
    url: '/workorder/management/trademark/category/allList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
