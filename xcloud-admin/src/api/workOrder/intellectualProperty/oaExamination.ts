import axios from '@/utils/axios';

//oa审查意见列表
export const getListPage = (data: any) => {
  return axios({
    url: '/workorder/management/official/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 文件OA状态列表
export const getOaStatusList = () => {
  return axios({
    url: '/workorder/management/workOrder/oa/list/oa-status',
    method: 'get',
  });
};

//获取所有处理人类型
export function getHandlerUserType(data: any) {
  return axios({
    url: '/workorder/management/xcloudHandlerAllot/handlerUserType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

// 修改处理人
export const updateHandlerUserTypeAPI = (data: any) => {
  return axios({
    url: '/workorder/management/trademark/workorder/batchUpdateHandler',
    data,
    method: 'post',
  });
};

// 查询OA工单详情  serviceId
export const oaWorkorderDetailAPI = (data: any) => {
  return axios({
    url: '/workorder/management/official/detail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//获取OA关联文件
export const getRelationFiles = (params: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/getRelationFiles',
    params,
    method: 'get',
  });
};

// 修改官方文件
export const updateFileOaAPI = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/update/fileOa',
    data,
    method: 'post',
  });
};

//获取工单翻译OA详情 - 答复建议
export const getFileDetails = (params: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/getFileDetails',
    params,
    method: 'get',
  });
};

//新增一条答复建议
export const addTrademarkReplyPlan = (data: any) => {
  return axios({
    url: '/workorder/management/trademarkReplyPlan/addTrademarkReplyPlan',
    data,
    method: 'post',
  });
};

//删除一条答复建议
export const delById = (params: any) => {
  return axios({
    url: '/workorder/management/trademarkReplyPlan/delById?id=' + params.id,
    method: 'post',
  });
};

// 翻译oa
export const translateOaAPI = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/translate/oa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 删除官方文件
export const delFileOaAPI = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/del/fileOa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 关闭oa
export const closeOaAPI = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/closeOa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 重新上传授权书模板
export const authorizationTemplateFile = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/update/oa/authorizationRelevanceFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//获取客户答复方案、答复材料
export const getOaTrademarkReplyPlan = (params: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/getOaTrademarkReplyPlan',
    params,
    method: 'get',
  });
};

//代客户上传答复材料
export const replaceMaterials = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/update/oa/answer/replaceMaterials',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//代客户再次上传答复材料  律师审核不通过后
export const replaceMaterialsAgign = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/reupload/oa/answer/replaceMaterials',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//获取付款链接
export const getPaymentLink = (params: any) => {
  return axios({
    url: '/order/management/order/' + params.id,
    method: 'get',
  });
};

// 代客户上传授权书
export const oaAuthorizationFile = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/upload/oaAuthorizationFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//平台审核、律师审核  通过
export const materials = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/pass/answer/materials',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//平台审核、律师审核  不通过
export const rejectMaterials = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/reject/answer/materials',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//审核授权书
export const authorizationFile = (data: any) => {
  return axios({
    url: '/workorder/management/workOrder/oa/verify/authorizationFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};
