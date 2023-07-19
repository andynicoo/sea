import request from '@/libs/request';

/**
 * 海牙认证列表
 */
export const getApostilleList = (data) => {
  return request({
    url: '/workorder/management/tax/apostille/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 海牙认证详情
 */
export const getApostilleInfo = (data) => {
  return request({
    url: '/workorder/management/vat/apostille/detail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 保存海牙认证资料
 */
export const saveApostille = (data) => {
  return request({
    url: '/workorder/management/vat/apostille/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 提交海牙认证资料
 */
export const submitApostille = (data) => {
  return request({
    url: '/workorder/management/vat/apostille/submit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 海牙认证资料-审核通过
 */
export const apostilleCheck = (data) => {
  return request({
    url: '/workorder/management/vat/apostille/approval/material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 海牙认证资料-审核驳回
 */
export const apostilleReject = (data) => {
  return request({
    url: '/workorder/management/vat/apostille/reject',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 海牙认证确认签收资料(已发送服务商)
 */
export const apostilleSendLogisticsInfo = (data) => {
  return request({
    url: '/workorder/management/tax/apostille/send_supplier',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 上传海牙文件
 */
export const apostilleUpload = (data) => {
  return request({
    url: '/workorder/management/tax/apostille/file',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 更改服务商
 */
export const apostilleChange = (data) => {
  return request({
    url: '/workorder/management/vat/apostille/supplier',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 更改西班牙海牙服务商
 */
export const updataSupplieres = (data) => {
  return request({
    url: '/workorder/management/vat/apostille/supplier/es',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
/**
 * 获取用户公司信息
 */
export const getUserCompanyMaterial = (params) => {
  return request({
    url: '/workorder/management/userCompanyMaterial/list',
    params,
    method: 'get',
  });
};

/**
 * 海牙服务单批量发送短信-提醒客户邮寄授权书
 */
export const sendSmsBatch = (data) => {
  return request({
    url: '/workorder/management/vat/apostille/send/smsBatch',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
