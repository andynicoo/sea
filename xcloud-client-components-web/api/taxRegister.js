import request from '@/utils/request';

/**
 * 服务工单详情
 * @param {*} params 参数，serviceId
 */
export function getDetail(params) {
  return request({
    url: '/workorder/client/vat/workOrder/detail',
    method: 'post',
    data: params,
  });
}

/**
 * 表单配置数据
 *  @param {*} params 参数，
 */
export function getNodeField(params) {
  return request({
    url: '/workorder/management/workFlowColumnRelation/findWorkflowColumnsByCode',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 获取签名链接
 * @param {*} params 参数，
 *
 */
export function signCode(params) {
  return request({
    url: '/workorder/client/sign/generate',
    method: 'post',
    data: params,
  });
}

/**
 * 获取法人签名回显
 * @param {*} params 参数，serviceNo
 *
 */
export function refresh(params) {
  return request({
    url: '/workorder/client/sign/refresh',
    method: 'post',
    data: params,
  });
}

/**
 * 保存注册或转代理资料
 *  @param {*} params 参数，
 */
export function materialSave(params) {
  return request({
    url: '/workorder/client/vat/material/save',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 提交注册或转代理资料
 *  @param {*} params 参数，
 */
export function materialSubmit(params) {
  return request({
    url: '/workorder/client/vat/material/submit',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 *  客户端-下载资料
 * @param {*} params 参数，
 */
export function downloadFile(params) {
  return request({
    url: '/workorder/client/vat/download',
    method: 'get',
    params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *
 * vat-退税 服务详情
 * @param {*} params 参数，
 */
export function getTaxRefundInfo(params) {
  return request({
    url: '/workorder/client/taxRefundWorkOrder/serviceDetail',
    method: 'get',
    params,
  });
}

/**
 * VAT退税工单保存资料
 * @param {*} params 参数，
 */
export function saveInfo(params) {
  return request({
    url: '/workorder/client/taxRefundWorkOrder/saveInfo',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 *  VAT退税工单提交资料
 * @param {*} params 参数，
 */
export function submitInfo(params) {
  return request({
    url: '/workorder/client/taxRefundWorkOrder/submitInfo',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
/**
 *  vat-退税 根据服务号查询驳回内容(最新一条)
 * @param {*} params 参数，
 */
export function latestReject(params) {
  return request({
    url: '/workorder/client/commonInterface/latestReject',
    method: 'POST',
    data: params,
  });
}

/**
 * 查询驳回内容(最新一条)(新工单)
 * @param {*} params 参数，
 */
export function latestRejectByWorkNo(workNo) {
  return request({
    url: '/workorder/client/commonInterface/reject/last/' + workNo,
    method: 'get',
  });
}

/**
 *  上传注册+转代理授权书
 * @param {*} params 参数，
 */
export function uploadAuthorization(params) {
  return request({
    url: '/workorder/client/service_work_order/upload/auth/file',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 查看历史购买信息
 */
export const queryHistoryList = (params) => {
  return request({
    url: '/workorder/client/epr_expansion/query/history',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 申报服务工单详情
 * @param {*} params 参数，serviceId
 */
export function getDeclareDetail(params) {
  return request({
    url: '/workorder/client/epr/declare/detail',
    method: 'post',
    data: params,
  });
}

/**
 * 查看本年历史购买信息
 */
export const queryYearHistoryList = (params) => {
  return request({
    url: '/workorder/client/epr/declare/history',
    params: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查看历史购买信息
 */
export const queryDeclareHistoryList = (params) => {
  return request({
    url: '/workorder/client/epr/declare/query/history',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查看历史购买信息
 */
export const queryBatHistoryList = (params) => {
  return request({
    url: '/workorder/client/epr_expansion/query/batteryHistory',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/** 查找德国EPR的续费历史购买信息 */
export function getEprHistoryInfo(data) {
  return request({
    url: '/workorder/client/epr/renew/findEprHistoryInfo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *
 * @param {*} params 参数，
 */
export function getEprBJProduct(params) {
  return request({
    url: '/workorder/client/epr/declare/getEprBJProduct',
    method: 'post',
    params,
  });
}

/**
 * 计算费用
 */
export const calcuDeclare = (params) => {
  return request({
    url: '/workorder/client/epr/declare/calculatingExpenses',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 *
 * epr注册 隐藏证书，uin
 * @param {*} params 参数，
 */
export function getHideInfo(params) {
  return request({
    url: '/workorder/client/registerTemp/getOne',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**
 * ocr识别[德国vat,转代理]
 * @param {string} fileType 文件类型（身份证正面：idCardFaceType；身份证反面：idCardBackType；营业执照：businessLicenseType；税号文件 taxNumberType;）
 */
export const clientFromOcr = (data) => {
  return request({
    url: '/workorder/client/from_ocr',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 店铺地址识别
 * @param {string}
 */
export const pythonOcrLink = (data, sourceToken) => {
  let cancelToken = '';
  if (sourceToken) {
    cancelToken = sourceToken.token;
  }
  return request({
    url: '/workorder/management/pythonOcr/link',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    cancelToken,
  });
};
