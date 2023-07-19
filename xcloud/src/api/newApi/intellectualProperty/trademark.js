import request from '@/libs/request';

// 分页查询工单列表
export const workorderListAPI = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/pagelist',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 查询商标工单详情
export const workorderDetailAPI = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/detail',
    data,
    method: 'post',
  });
};

// 获取商标注册所有注册进度
export const getAllServiceProgressAPI = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/getAllServiceProgress',
    data,
    method: 'post',
  });
};

// 商标工单节点状态变更
export const updateNodeAPI = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/updateNode',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 商标工单封存/取消封存
export const changeSealedAPI = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/sealed',
    data,
    method: 'post',
  });
};

// 商标工单列表下载资料
export const importListAPI = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/importList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 商标工单发送短信
export const sendSmsAPI = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/sendSms',
    data,
    method: 'post',
  });
};
/**
 * 取消工单
 * @param {*} data
 * @returns
 */
export const cacelWordOrder = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/cancel',
    data,
    method: 'post',
  });
};

/**
 * 美国、欧盟、英国下载资料
 * @param {*} data
 * @returns
 */
export const dowloadWordOrder = (params) => {
  return request({
    url: '/workorder/management/trademark/workorder/standard/zipdowload',
    params,
    method: 'get',
    responseType: 'blob',
  });
};

/**
 * 除 美国、欧盟、英国、日本下载资料
 * @param {*} data
 * @returns
 */
export const dowloadZipWordOrder = (params) => {
  return request({
    url: '/workorder/management/trademark/workorder/other/zipdowload',
    params,
    method: 'get',
    responseType: 'blob',
  });
};

/**
 * 查询律师发布的流程
 * @param {*} data
 * @returns
 */
export const getAttorneyWorkFlowApi = (params) => {
  return request({
    url: '/workorder/management/attorney/getAttorneyWorkFlow',
    params,
    method: 'get',
  });
};

/**
 * 查询律师发布的流程
 * @param {*} data
 * @returns
 */
export const batchUpdAttorneyApi = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/batchUpdAttorney',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/** 1.7.7.3 工单优化 */

/** 新增数据答复建议方案  */
export const addTrademarkReplyPlan = (data) => {
  return request({
    url: '/workorder/management/trademarkReplyPlan/addTrademarkReplyPlan',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取工单翻译OA详情
 * @param {*} data
 * @returns
 */
export const getFileDetails = (params) => {
  return request({
    url: '/workorder/management/workOrder/oa/getFileDetails',
    params,
    method: 'get',
  });
};

/**删除一条答复建议  */
export const delById = (id) => {
  return request({
    url: '/workorder/management/trademarkReplyPlan/delById?id=' + id,
    method: 'post',
  });
};

/**
 * 修改公告日期
 * @param {*} data
 * @returns
 */
export const updateNoticeDate = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/updateNoticeDate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 验证受理号
export const closeWorkOrder = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/closeWorkOrder',
    data,
    method: 'post',
  });
};

// python查询日志
export const pythonLogApi = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/get/pythonLog',
    data,
    method: 'post',
  });
};

// 调用python脚本接口限制提醒
export const checkPythonRequest = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/cheak/pythonRequest',
    data,
    method: 'post',
  });
};

//---------------------------合规紧急需求------------------start---------------------
// 查询客户邮件  functionCode，countryCode，enterpriseId
export const getEmailConfig = (data) => {
  return request({
    url: '/workorder/management/work-email-config/getEmailConfig',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 客户上传资料弹窗 smsSend 是否发送短信  customerData资料URL   {serviceId}或者${workId==id}  ${functionCode}
export const sendCustomFile = (data) => {
  return request({
    url: '/workorder/management/service_work_order/sms/send/service',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 是否发送邮件弹窗  ${emailSend} ${functionCode}  (${serviceId} ${workId==id})
export const sendEmail = (data) => {
  return request({
    url: '/workorder/management/service_work_order/email/send/service',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
//---------------------------合规紧急需求----------------end-----------------------

// 商标复活 POST /management/trademark/workorder/reCreateVowOrder
export const reCreateVowOrder = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/reCreateVowOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
// 下载使用证据
export const downloadEvidence = (id) => {
  return request({
    url: '/workorder/management/trademark/workorder/downloadEvidence',
    params: { serviceId: id },
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    responseType: 'blob',
  });
};
// 提交使用证据（新）
export const submitEvidence = (data) => {
  return request({
    url: '/workorder/management/trademark/workorder/submitEvidence',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 获取商标二级状态
export const getTrademarkStatusTwoList = (params) => {
  return request({
    url: '/workorder/management/trademark/search/utils/status/two/list',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 获取核名关联记录
export const getTrademarkRecord = (params) => {
  return request({
    url: '/workorder/management/trademark/workorder/searchRecord',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 关联核名记录
export const handleAssociatedTrademarkRecord = (data) => {
  // workorder/
  return request({
    url: '/workorder/management/trademark/workorder/associated/trademarkSearchName',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
