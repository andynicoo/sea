import request from '@/libs/request';

/**
 * 获取法人签名
 */
export const getCompanyLegalPersonSign = (params) => {
  return request({
    url: '/workorder/management/sign/refresh',
    method: 'post',
    data: params,
  });
};

/**
 * 获取签名链接
 */
export const getCompanyLegalPersonSignUrl = (params) => {
  return request({
    url: '/workorder/management/sign/generate',
    method: 'post',
    data: params,
  });
};

/**
 * ocr识别
 * @param {string} fileType 文件类型（身份证正面：ID_CARD；身份证反面：ID_CARD_REVERSE；公司营业执照：COMPANY_LICENSE）
 * @param {string} fileUrl 文件url
 */
export const clientOcr = (data) => {
  return request({
    url: 'https://sit2-xcloud-console.itaxs.com/api/workorder/client/ocr',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 下载资料清单
 */
export const workFlowColumnRelationDownloadList = (params) => {
  return request({
    url: '/workorder/client/workFlowColumnRelation/downloadList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};

/**
 * 下载上传资料模板
 */
export const workFlowColumnRelationDownloadMaterialExcel = (params) => {
  return request({
    url: '/workorder/client/workFlowColumnRelation/downloadMaterialExcel',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};
