import request from '@/libs/request';

// 分页查询OA工单列表
export const oaWorkorderListAPI = (data) => {
  return request({
    url: '/workorder/management/official/list',
    data,
    method: 'post',
  });
};

// 分页查询OA工单详情
export const oaWorkorderDetailAPI = (data) => {
  return request({
    url: '/workorder/management/official/detail',
    data,
    method: 'post',
  });
};

// 文件OA状态列表
export const oaStatusListAPI = (params) => {
  return request({
    url: '/workorder/management/workOrder/oa/list/oa-status',
    params,
    method: 'get',
  });
};

// 上传官方文件(创建OA工单)
export const addFileOaAPI = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/add/fileOa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 修改官方文件
export const updateFileOaAPI = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/update/fileOa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 删除官方文件
export const delFileOaAPI = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/del/fileOa',
    data,
    method: 'post',
  });
};

// 翻译oa
export const translateOaAPI = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/translate/oa',
    data,
    method: 'post',
  });
};

// 翻译暂停信
export const translateStopLetterAPI = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/translate/stopLetter',
    data,
    method: 'post',
  });
};

// 取消暂停信
export const cancelLetterAPI = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/cancel/stopLetter',
    data,
    method: 'post',
  });
};

// 审批通过答复材料
export const passAnswerAPI = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/pass/answer/materials',
    data,
    method: 'post',
  });
};

// 驳回答复材料
export const rejectAnswerAPI = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/reject/answer/materials',
    data,
    method: 'post',
  });
};

// 根据业务分类获取商品列表
export const serviceProductListAPI = (data) => {
  return request({
    url: '/orderproduct/management/productInfo/serviceProductList',
    data,
    method: 'post',
  });
};

//

// 根据业务分类获取商品列表
export const closeOaAPI = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/closeOa',
    data,
    method: 'post',
  });
};

/** 获取OA关联的答复方案及使用证据 */
export const getOaReplyPlanAndEvidence = (id) => {
  return request({
    url: '/workorder/management/workOrder/oa/getOaReplyPlanAndEvidence/' + id,
    method: 'get',
  });
};

// management / workOrder / oa / translate / oa;

// /** 获取使用证据商品 */
// export const translateOa = (data) => {
//   return request({
//     url: "/workorder/management/workOrder/oa/translate/oa",
//     data,
//     method: "post",
//   });
// };
// 审批驳回答复材料
export const rejectMaterials = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/reject/answer/materials',
    data,
    method: 'post',
  });
};

//获取OA关联文件
export const getRelationFiles = (params) => {
  return request({
    url: '/workorder/management/workOrder/oa/getRelationFiles',
    params,
    method: 'get',
  });
};

/**下载使用证据 */
export const zipdowloadEvidenct = (params) => {
  return request({
    url: '/workorder/management/trademark/workorder/standard/zipdowloadEvidenct',
    params,
    method: 'get',
  });
};

/**获取使用证据详情 (预览) */
export const getEvidenceDetail = (params) => {
  return request({
    url: '/workorder/management/trademark/workorder/evidence/getEvidenceDetail',
    params,
    method: 'get',
  });
};

/** 查看答复审查意见信息 -> 用户确认答复 */
export const replaceMaterials = (data) => {
  return request({
    url: '/workorder/management/workOrder/oa/update/oa/answer/replaceMaterials',
    data,
    method: 'post',
  });
};

// 根据业务分类获取商品列表
export const productListAPI = (data) => {
  return request({
    url: '/productcenter/client/productInfo/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
