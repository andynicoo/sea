import request from '@/utils/request';

/**
 * 获取增值服务列表
 */
export const getAddedServiceList = (data) => {
  return request({
    // url: '/etax/taxApplyServices/client/list',
    url: '/workorder/client/taxApplyServices/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 根据增值税申请服务类型获取服务公司
 */
export const getAddedCompanyList = (data) => {
  return request({
    url: '/workorder/client/taxApplyServices/orderServices/list',
    data,
    method: 'post',
  });
};

/**
 * 提交增值税申请服务资料
 */
export const submitAddedForm = (data) => {
  return request({
    // url: '/etax/taxApplyServices/client/add',
    url: '/workorder/client/taxApplyServices/add',
    data,
    method: 'post',
  });
};
