import request from '@/libs/request';

/**
 * 订单销售数据统计分析
 */
export const getAnalyzeList = (data) => {
  return request({
    url: '/orderproduct/datacenter/analyze/order/analyze',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 订单销售数据统计
 */
export const getStatistics = (data) => {
  return request({
    url: '/orderproduct/datacenter/analyze/order/statistics',
    data,
    method: 'post',
  });
};

/**
 * 获取服务商和律师信息
 */
export const getSupplierAttorneyInfoList = (data) => {
  return request({
    url: '/workorder/management/supplier/getSupplierAttorneyInfoList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 商标交付时效 cell数据
 */
export const getTrademarkAgingAll = (data) => {
  return request({
    url: '/workorder/trademark/getTrademarkAgingAll',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 商标交付时效列表
 */
export const getTrademarkAgingList = (data) => {
  return request({
    url: '/workorder/trademark/trademarkAgingList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 商标交付时效列表 -导出
 */
export const getTrademarkExport = (data) => {
  return request({
    url: '/workorder/trademark/export',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

/**
 * 合规交付时效列表
 */
export const eprAgingList = (data) => {
  return request({
    url: '/workorder/aging/eprAgingList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 合规交付时效列表 -导出
 */
export const erpReportExport = (data) => {
  return request({
    url: '/workorder/aging/erpReportExport',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

/**
 * vat交付时效列表
 */
export const vatAgingList = (data) => {
  return request({
    url: '/workorder/aging/vatAgingList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * vat交付时效列表 -导出
 */
export const vatAgingListExport = (data) => {
  return request({
    url: '/workorder/aging/vatAgingListExport',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

/**
 * 交付时效列表
 */
export const agingStatisticsList = (data) => {
  return request({
    url: '/workorder/aging/agingStatistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 交付时效列表 -导出
 */
export const agingStatisticsServiceNoExport = (data) => {
  return request({
    url: '/workorder/aging/agingStatisticsServiceNoExport',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

/**
 * 交付时效列表 -业务类型
 */
export const agingTreeList = (data) => {
  return request({
    url: '/workorder/aging/agingTreeList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 交付时效列表 -查询列表服务弹窗
 */
export const agingStatisticsServiceNo = (data) => {
  return request({
    url: '/workorder/aging/agingStatisticsServiceNo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 客户关系图谱 -根据搜索条件补全搜索结果
 */
export const queryinfo = (data) => {
  return request({
    url: '/relationshipmap/datanode/management/replenish/queryinfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 客户关系图谱 - 获取客户与企业关系信息
 */
export const relationList = (params) => {
  return request({
    url: '/relationshipmap/datanode/relation/list',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 客户关系图谱 - 根据用户节点获取公司信息
 */
export const getUserNodesInfo = (params) => {
  return request({
    url: '/relationshipmap/datanode/management/user/selectDataNodeUserInfo',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 客户关系图谱 - 根据公司节点获取公司信息
 */
export const getCompanyNodesInfo = (params) => {
  return request({
    url: '/relationshipmap/datanode/management/company/selectCompanyInfo',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 客户关系图谱 - 根据条件查询oneId
 */
export const selectOneIdInfo = (params) => {
  return request({
    url: '/relationshipmap/oneId/selectOneIdInfo',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 客户关系图谱 -修改标签
 */
export const updateOneIdInfo = (data) => {
  return request({
    url: '/relationshipmap/oneId/updateOneIdInfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
