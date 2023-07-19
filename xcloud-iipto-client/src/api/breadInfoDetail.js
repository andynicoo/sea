import request from "@/libs/request";

/**
 * 获取所有的一级类目
 */
export const getOneCategoryApi = data => {
  return request({
    url: "/workorder/management/trademark/category/allList",
    data,
    method: "post"
  });
};

/**
 * 获取指定查询条件的二级目录
 */
export const getTwoCategoryApi = data => {
  return request({
    url: "/workorder/management/trademark/category/subCategoryList",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 获取指定查询条件的二级目录
 */
export const getSubclassApi = data => {
  return request({
    url: "/workorder/management/trademark/category/subCategoryList",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 商标注册详情
 */
export const trademarkDetailApi = data => {
  return request({
    url: "/workorder/management/trademark/workorder/detail",
    data,
    method: "post"
  });
};

/**
 * 商标注册详情
 */
export const evidenceDetail = data => {
  return request({
    url: "/workorder/management/trademark/workorder/evidence/detail",
    data,
    method: "post"
  });
};

/**
 * 申请亚马逊备案验证码
 */
export const applyAmazonFilingCodeApi = data => {
  return request({
    url: "/workorder/client/amazonRecordInfo/add",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 确认答复OA
 */
export const answerOaApi = data => {
  return request({
    url: "/workorder/management/workOrder/oa/affirm/oa/answer",
    data,
    method: "post"
  });
};
/**
 * 上传答复方案选择
 * @param {*} data 
 * @returns 
 */
export const answerOaPlan = data => {
  return request({
    url: '/workorder/management/workOrder/oa/update/oa/answer/materials',
    data,
    method: "post"
  });
};
/**
 * 上传答复材料
 */
export const answerOaMaterialsApi = data => {
  return request({
    url: '/workorder/management/workOrder/oa/reupload/oa/answer/materials', //  新上传材料（新节点）
    data,
    method: "post"
  });
};

/**
 * 提交商标注册资料
 */
export const submitWorkorderApi = data => {
  return request({
    url: "/trademark/client/register/trademark/submit/workorder",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 文件OA工单列表
 */
export const fileOaListApi = data => {
  return request({
    url: "/trademark/client/fileOa/list/fileOa",
    data,
    method: "post"
  });
};

/**
 * 放弃答复 /workorder/management/workOrder/oa/cacel/answer/materials
 */
export const materialsApi = data => {
  return request({
    url: "/workorder/management/workOrder/oa/cacel/answer/materials",
    data,
    method: "post"
  });
};

/**
 * 获取OA关联的答复方案及使用证据
 */
export const getOaReplyPlanAndEvidenceApi = id => {
  return request({
    url: "/workorder/management/workOrder/oa/getOaReplyPlanAndEvidence/" + id,
    method: "get"
  });
};

/**
 * 获取OA关联的答复方案及使用证据
 */
export const ByOaReplyCreateOrderApi = data => {
  return request({
    url: "/workorder/management/workOrder/oa/ByOaReplyCreateOrder",
    method: "post",
    data
  });
};


/**
 * 使用证据商标注册详情
 */
 export const evidenceDetailApi = data => {
  return request({
    url: "/workorder/management/trademark/workorder/evidence/detail",
    data,
    method: "post"
  });
};

/**
 * 获取oa选择的答复方案
 */
export const getOaTrademarkReplyPlan = (id) => {
  return request({
    url: "/workorder/management/workOrder/oa/getOaTrademarkReplyPlan?oaId=" + id,
    method: "get"
  })
};
/**
 * 上传授权书
 */
export const handleAuthorizationFile = (data) => {
  return request({
    url: "/workorder/management/workOrder/oa/upload/oa/authorizationFile",
    method: "post",
    data
  })
};