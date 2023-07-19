import request from '@/libs/request';

/**
 * EPR查询列表页
 * @param {*} params 参数，
 */
export function getListAPI(data) {
  return request({
    url: '/workorder/management/vat/epr/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 更改服务商
 */
export const eprChangeSupplier = (params) => {
  return request({
    url: '/workorder/management/vat/epr/supplier',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 批量提醒
 */
export const eprNotice = (data) => {
  return request({
    url: '/workorder/management/vat/epr/batchNotice',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 导出
 */
export const eprExport = (data) => {
  return request({
    url: '/workorder/management/vat/epr/export',
    data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 保存epr资料
 */
export const saveEpr = (data) => {
  return request({
    url: '/workorder/management/vat/epr/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 提交epr资料
 */
export const submitEpr = (data) => {
  return request({
    url: '/workorder/management/vat/epr/commit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 替换授权书
 */
export const replaceAuthCertificate = (data) => {
  return request({
    url: '/workorder/management/vat/epr/replaceAuthCertificate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * epr资料-初步审核
 */
export const eprCheck = (data) => {
  return request({
    url: '/workorder/management/vat/epr/approval/material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * epr授权驳回
 */
export const eprRejectAuthorization = (data) => {
  return request({
    url: '/workorder/management/vat/epr/reject',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * epr授权驳回
 */
export const addUIN = (data) => {
  return request({
    url: '/workorder/management/vat/epr/addUIN',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * epr授权驳回
 */
export const editUIN = (data) => {
  return request({
    url: '/workorder/management/vat/epr/editUIN',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * epr提交服务商
 */
export const eprCommitSupplier = (data) => {
  return request({
    url: '/workorder/management/vat/epr/commitSupplier/' + data,
    data,
    method: 'post',
  });
};

/**
 * 录入证书
 */
export const eprCertificate = (data) => {
  return request({
    url: '/workorder/management/vat/epr/certificate/',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 完成EPR注册
 */
export const eprComplete = (data) => {
  return request({
    url: '/workorder/management/vat/epr/complete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 批量完成EPR注册
 */
export const eprBatchComplete = (data) => {
  return request({
    url: '/workorder/management/epr/batch/complete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 录入证书
 */
export const inputEprRegisterInfoApi = (data) => {
  return request({
    url: '/workorder/management/vat/epr/inputEprRegisterInfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查看历史购买信息
 */
export const queryHistoryList = (params) => {
  return request({
    url: '/workorder/management/vat/epr/query/history',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 查看电池法历史购买信息
 */
export const queryBatHistoryList = (params) => {
  return request({
    url: '/workorder/management/vat/epr/query/batteryHistory',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 导出
 */
export const addCateEprExport = (data) => {
  return request({
    url: '/workorder/management/vat/epr/export_expansion',
    data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * EPR申报查询列表页
 * @param {*} params 参数，
 */
export function getDeclareListAPI(data) {
  return request({
    url: '/workorder/management/epr/declare/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 保存epr申报
 */
export const saveDeclare = (data) => {
  return request({
    url: '/workorder/management/epr/declare/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 提交epr申报
 */
export const submitDeclare = (data) => {
  return request({
    url: '/workorder/management/epr/declare/submit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 上传epr申报回执
 */
export const uploadDeclare = (data) => {
  return request({
    url: '/workorder/management/epr/declare/submit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 导出
 */
export const declareEprExport = (data) => {
  return request({
    url: '/workorder/management/epr/declare/export',
    data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 批量提醒
 */
export const eprDeclareNotice = (data) => {
  return request({
    url: '/workorder/management/epr/declare/sms/notify',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 批量提醒
 */
export const eprDeclareRel = (data) => {
  return request({
    url: '/workorder/management/vat/epr/relSimple',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 提交epr申报
 */
export const submitDeclaration = (data) => {
  return request({
    url: '/workorder/management/epr/declare/submit/declaration',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 提交epr申报完成
 */
export const completeDeclaration = (data) => {
  return request({
    url: '/workorder/management/epr/declare/complete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 提交epr申报
 */
export const exportDeclaration = (data) => {
  return request({
    url: '/workorder/management/epr/declare/detail/export',
    params: data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 获取weee关联极简工单
 */
export const queryWeee = (id) => {
  return request({
    url: '/workorder/management/epr_simple_rel/weee/' + id,
    method: 'get',
  });
};

/**
 * 获取电池法关联极简工单
 */
export const queryBat = (id) => {
  return request({
    url: '/workorder/management/epr_simple_rel/batteryInfos/' + id,
    method: 'get',
  });
};

/**
 * 查看历史购买信息
 */
export const queryDeclareHistoryList = (params) => {
  return request({
    url: '/workorder/management/epr/declare/query/history',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/** 查找之前的续费 */
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
 * 查看历史购买信息
 */
export const batchDeclaration = (params) => {
  return request({
    url: '/workorder/management/epr/declare/batch/declaration',
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
export const getHistoryList = (params) => {
  return request({
    url: '/workorder/management/vat/epr/history',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 查看历史购买信息(电池法)
 */
export const getBatHistoryList = (params) => {
  return request({
    url: '/workorder/management/vat/epr/batteryHistory',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 上传账单识别
 * @param {*} params 参数，
 */
export function readBankInfoApi(data) {
  return request({
    url: '/workorder/management/vat/epr/readBankInfo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 上传缴费凭证
 * @param {*} params 参数，
 */
export function uploadPaymentVoucher(data) {
  return request({
    url: '/workorder/management/vat/epr/uploadPaymentVoucher',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 电池法填写的申报资料
 * @param {*} params 参数，
 */
export function getBatteryList(params) {
  return request({
    url: '/workorder/management/epr/declare/battery/info',
    method: 'get',
    params,
  });
}

/**
 * EPR续费工单列表
 * @param {*} params 参数，
 */
export function getEprRenewListAPI(data) {
  return request({
    url: '/workorder/management/epr/renew/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * EPR续费工单列表详情
 */
export const getWeeeInfo = (data) => {
  return request({
    url: '/workorder/management/epr/renew/detail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * EPR续费工单列表详情 提交编辑的weee产品信息
 */
export const saveWeeePro = (data) => {
  return request({
    url: '/workorder/management/epr/renew/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * weee导出
 */
export const eprWeeeExport = (data) => {
  return request({
    url: '/workorder/management/epr/renew/export',
    data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * EPR续费， 操作-》 服务单详情, 保存续费品类明细
 */
export const weeeSave = (data) => {
  return request({
    url: '/workorder/client/epr/renew/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * EPR续费， 操作-》 服务单详情, 审核
 */
export const approvalWeee = (data) => {
  return request({
    url: '/workorder/management/epr/renew/approval',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * EPR续费， 操作-》 服务单详情, 完成续费
 */
export const completelWeee = (data) => {
  return request({
    url: '/workorder/management/epr/renew/complete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * EPR续费， 操作-》 服务单详情 上传回执
 * @param {*} params 参数，
 */
export function uploadWeeeFile(data) {
  return request({
    url: '/workorder/management/epr/renew/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**
 * EPR续费， 操作-》 服务单详情 下载资料
 */
export const downloadWeee = (data) => {
  return request({
    url: '/workorder/management/downloadTemplate/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * EPR续费， 操作-》 服务单详情 短信提醒
 */
export const sendSmsWeee = (data) => {
  return request({
    url: '/workorder/management/epr/renew/sendSms?serviceNos=' + data.serviceNos,
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * EPR注册， 操作-》 服务单详情 新增关联极简续费功能，获取
 */
export const simRenew = (data) => {
  return request({
    url: '/workorder/management/sim/renew/find',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * EPR注册， 操作-》 服务单详情 新增关联极简续费功能，保存
 */
export const simSave = (data) => {
  return request({
    url: '/workorder/management/sim/renew/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/** epr续费 保存资料 */
export const saveRenew = (data) => {
  return request({
    url: '/workorder/management/service_work_order/save_material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/** epr续费 提交资料 */
export const commitRenew = (data) => {
  return request({
    url: '/workorder/management/service_work_order/commit_material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/** 待审核回收费 审核 */
export const auditRecycling = (data) => {
  return request({
    url: '/workorder/management/vat/epr/auditVoucherFiles',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
