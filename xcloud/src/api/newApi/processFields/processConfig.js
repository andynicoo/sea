import request from '@/libs/request';

/**
 * 查询所有商品类目列表
 */
export const findProducts = (data) => {
  return request({
    url: '/orderproduct/management/category/get/functionCodeList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 查询所有国家列表
 */
export const findCountrys = (data) => {
  return request({
    url: '/order/management/country/countryList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 分页查询服务商/律师列表
 */
export const findSuppliers = (data) => {
  return request({
    url: '/workorder/management/supplier/pageSuppliers',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 查询状态列表
 */
export const findStatuses = (params) => {
  return request({
    url: '/workorder/management/serviceWorkflow/listAuditStatus',
    params,
    method: 'get',
  });
};

/**
 * 分页查询流程节点列表
 */
export const findProcesses = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const newfindProcesses = (data) => {
  return request({
    url: '/workorder/management/base/supplier/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 查询所有流程节点列表
 */
export const findNodes = (data) => {
  return request({
    url: '/workorder/management/serviceNode/serverNodeWithFunctionCode',
    data,
    method: 'post',
  });
};
/**
 * 获得流程详情
 */
export const getProcessDetail = (data) => {
  return request({
    url: `/workorder/management/serviceWorkflow/getWorkFlowDetail/${data.flowId}`,
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 添加服务流程
 */
export const addProcess = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 修改服务流程
 */
export const updateProcess = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/update',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 已发布的更新服务流程
 */
export const publishProcess = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/publishedAdd',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 审核流程
 */
export const auditProcess = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/audit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 下载模板列表
 */
export const downloadTemplate = (data) => {
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
 * 根据ID查找下载数据
 */
export const getDownload = (params) => {
  return request({
    url: '/workorder/management/downloadTemplate/get',
    params,
    method: 'get',
  });
};

/**
 * 添加/编辑模板数
 */
export const editTemp = (data) => {
  return request({
    url: '/workorder/management/downloadTemplate/edit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 模板-定位到字段
 */
export const applyClient = (data) => {
  return request({
    url: '/workorder/management/downloadTemplate/apply/client',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 通过国家、服务商等获取节点信息
 */
export const getFlowInfo = (params) => {
  return request({
    url: '/workorder/management/serviceWorkflow/flowInfo',
    params,
    method: 'get',
  });
};

/**
 * 下载模板
 */
export const downloadTemp = (serviceId) => {
  return request({
    url: '/workorder/management/vat/download/' + serviceId,
    // params,
    method: 'get',
  });
};

// 税确列表
export const taxConfirmTemplate = (data) => {
  return request({
    url: '/workorder/management/taxConfirmTemplate/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 根据ID查找税确数据
 */
export const getTax = (params) => {
  return request({
    url: '/workorder/management/taxConfirmTemplate/get',
    params,
    method: 'get',
  });
};

/**
 * 添加/编辑税确
 */
export const editTax = (data) => {
  return request({
    url: '/workorder/management/taxConfirmTemplate/edit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 数据中心-数据概览-变化趋势
 */
export const trendView = (params) => {
  return request({
    url: '/orderproduct/management/orderView/trendView',
    params,
    method: 'get',
  });
};

/**
 * 数据中心-销售统计-数据汇总
 */
export const getLineData = (params) => {
  return request({
    url: '/orderproduct/management/orderView/saleTotalStatistic',
    params,
    method: 'get',
  });
};

/**
 * 各业务销售额数据看板-前10业务分类及变化趋势
 */
export const saleView = (data) => {
  return request({
    url: '/reportserver/management/orderView/saleView',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 数据概览-整体看板及变化趋势
 */
export const totalView = (data) => {
  return request({
    url: '/reportserver/management/orderView/totalView',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取申报周期格式列表
 */
export const getTaxConfirmTemplateApi = (params) => {
  return request({
    url: '/workorder/management/taxConfirmTemplate/list/format',
    params,
    method: 'get',
  });
};

/**
 * 获取已发布节点的服务商
 */
export const getActivatedApi = (data) => {
  return request({
    url: '/workorder/management/supplier/query/activated',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取已发布节点的服务商
 */
export const copyWorkFlowApi = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/copyWorkFlow',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 查询服务商
 */
export const getSuppliers = (data) => {
  return request({
    url: '/workorder/management/vat/apostille/query/supplier',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**-------------------------------------------------------- 流程管理 ------------------------------------------------------- */
export const getWorkCategory = () => {
  return request({
    url: '/workorder/management/workCategory',
    method: 'get',
  });
};

export const getListByWork = () => {
  return request({
    url: '/workorder/management/workFunction/listByWork',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 复制流程
 * @returns
 */
export const serviceWorkflowCopy = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/copy',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 停用工作流
 * @returns
 */
export const stopWorkFlow = (params) => {
  return request({
    url: '/workorder/management/serviceWorkflow/stopWorkFlow',
    params,
    method: 'get',
  });
};

/**
 * 删除工作流
 * @returns
 */
export const deleteWorkFlow = (params) => {
  return request({
    url: '/workorder/management/serviceWorkflow/deleteWorkFlow',
    params,
    method: 'get',
  });
};

/**
 * 取消工作流
 * @returns
 */
export const changeWorkFlowStatus = (params) => {
  return request({
    url: '/workorder/management/serviceWorkflow/changeWorkFlowStatus',
    params,
    method: 'get',
  });
};

/**
 * 取消工作流
 * @returns
 */
export const getServiceWorkflow = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/cancel/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const workOrderWarnConfigSave = (data) => {
  return request({
    url: '/workorder/workOrderWarnConfig/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const getWarnConfig = (data) => {
  return request({
    url: '/workorder/workOrderWarnConfig/getWarnConfig',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const clearPythonCache = () => {
  return request({
    url: '/workorder/management/trademark/workorder/manual/python/advice',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 历史停用工单列表
 * @returns
 */
export const historyStopWorkOrders = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/historyStopWorkOrders',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 工单转入
 * @returns
 */
export const workOrderTransfer = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/workOrderTransfer',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};


/**
 * 工单转入记录
 * @returns
 */
export const workOrderTransferRecord = (data) => {
  return request({
    url: '/workorder/management/service-work-change/page/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 导出转入工单明细
 */



export const exportWorkorderDetails = params => {
  return request({
    url: "/workorder/management/service-work-change/exportDetails",
    params,
    method: "get",
    responseType: 'blob'
  });
};

/**
 * 工单流程
 * @returns
 */
export const workOrderRelatelist = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/relatelist',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};