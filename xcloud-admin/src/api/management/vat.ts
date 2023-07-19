import axios from '@/utils/axios';
import type Types from './type';
export * from './type.d';

// 我的VAT-统计
export const getVatCount = (data: Partial<Types.VatCommitCountCountParams>) => {
  return axios.post('/workorder/management/vat/self/myVat/count', data) as unknown as Promise<Types.VatCount>;
};

// 待客户提交-统计
export const getVatCommitCountCount = (data: Partial<Types.VatCommitCountCountParams>) => {
  return axios.post(
    '/workorder/management/vat/self/vatCommitCount/count',
    data
  ) as unknown as Promise<Types.VatCommitCountCountRes>;
};

// 待客户提交-列表
export const getVatCommitPage = (data: Partial<Types.VatCommitCountCountParams>) => {
  return axios.post(
    '/workorder/management/vat/self/vatCommitPage/page',
    data
  ) as unknown as Promise<Types.VatCommitListRes>;
};

// 待客户提交-导出
export const vatCommitExport = (data: Partial<Types.VatCommitCountCountParams>) => {
  return axios.post('/workorder/management/vat/self/vatCommitCount/export', data, {
    responseType: 'blob',
  }) as unknown as Promise<Blob>;
};

// 待客户提交-修改时间     planServiceTime:计划服务时间  workId:工单ID
export const setVatServiceTime = (planServiceTime: string | null, workId: string) => {
  return axios.post('/workorder/management/vat/self/planServiceTime/update', {
    planServiceTime,
    workId,
  });
};

// 已下号/转代理列表统计
export const getvatTaxNumber = (data: Partial<Types.VatCommitCountCountParams>) => {
  return axios.post(
    '/workorder/management/vat/self/vatTaxNumber/count',
    data
  ) as unknown as Promise<Types.VatTaxNumberRes>;
};

// 已下号导出
export const vatTaxNumberExport = (data: Partial<Types.VatCommitCountCountParams>) => {
  return axios.post('/workorder/management/vat/self/vatTaxNumber/export', data, {
    responseType: 'blob',
  }) as unknown as Promise<Blob>;
};

// 已下号/转代理列表统计
export const getvatTaxNumberPage = (data: Partial<Types.VatCommitCountCountParams>) => {
  return axios.post(
    '/workorder/management/vat/self/vatTaxNumber/page',
    data
  ) as unknown as Promise<Types.VatTaxNumberRes>;
};

/** 申报详情 */
export const getdeclareDetail = (serviceId: string) => {
  return axios.get('/workorder/management/vat/self/declare/detail', {
    params: { serviceId },
  }) as unknown as Promise<Types.DeclareDetailRes>;
};

//资料被驳回-列表
export const getListPage = (data: any) => {
  return axios({
    url: '/workorder/management/vat/self/vatRejectPage/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//资料被驳回-统计
export const getListCount = (data: any) => {
  return axios({
    url: '/workorder/management/vat/self/vatRejectCount/count',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//资料被驳回-导出
export const getListExport = (data: any) => {
  return axios.post('/workorder/management/vat/self/vatRejectCount/export', data, {
    responseType: 'blob',
  }) as unknown as Promise<Blob>;
};

/**
 * 添加预警跟进
 * @param data
 */
export const getWarningRecords = (data = {}) => {
  return axios({
    url: '/workorder/workPendingItem/track/record',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 详情
 * @param {integer} workOrderId 工单id
 */
export const serviceWorkOrderDetail = (workOrderId: string) => {
  return axios({
    url: '/workorder/management/service_work_order/detail/' + workOrderId,
    method: 'get',
  });
};

/**
 * 服务状态列表
 */
export const serviceStatus = () => {
  return axios({
    url: '/workorder/serviceStatus',
    method: 'GET',
  });
};
// 进度
export const serviceProgress = (params: any) => {
  return axios({
    url: '/workorder/management/vat/workorder/nodes',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/** 添加预警跟进 */
export const saveFollow = (data = {}) => {
  return axios({
    url: '/workorder/workPendingItem/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 超时交付列表
export const timeoutDeliveryPage = (data: any) => {
  return axios({
    url: '/workorder/management/vat/self/timeoutDelivery/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 超时交付列表统计
export const timeoutDeliveryCount = (data: any) => {
  return axios({
    url: '/workorder/management/vat/self/timeoutDelivery/count',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 超时交付列表导出-导出
export const timeoutDeliveryExport = (data: any) => {
  return axios({
    url: '/workorder/management/vat/self/timeoutDelivery/export',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};
