import type { INodeRecord, ISupplierRecord, IWorkorderQueryParams, IWorkorderRecord } from '@/types/trademark';
import { request } from '@/utils/axios';

// 分页查询工单列表
export const workorderListAPI = (data: IWorkorderQueryParams): Promise<IWorkorderRecord[]> => {
  return request({
    url: '/workorder/management/trademark/workorder/pagelist',
    data,
    method: 'post',
  });
};

//查询所有流程节点列表
export const findNodes = (data: { functionCode: number }): Promise<INodeRecord[]> => {
  return request({
    url: '/workorder/management/serviceNode/serverNodeWithFunctionCode',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 获取商标注册所有注册进度
export const getAllServiceProgressAPI = (data: { functionCode: number }): Promise<INodeRecord[]> => {
  return request({
    url: '/workorder/management/trademark/workorder/getAllServiceProgress',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 商标工单封存/取消封存
export const changeSealedAPI = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/sealed',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 商标工单列表下载资料
export const importListAPI = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/importList',
    data,
    method: 'post',
    responseType: 'blob',
  });
};

// python查询日志
export const pythonLogApi = () => {
  return request({
    url: '/workorder/management/trademark/workorder/get/pythonLog',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//情况缓存
export const clearPythonCache = () => {
  return request({
    url: '/workorder/management/trademark/workorder/manual/python/advice',
    method: 'post',
  });
};

// 调用python脚本接口限制提醒
export const checkPythonRequest = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/cheak/pythonRequest',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 执行脚本
export const executeScript = (url: string, params: any) => {
  return request({
    url,
    params,
    method: 'get',
  });
};

//新获取服务商列表
export const newSupplierList = (data: {
  supplierType: number;
  functionCode: string;
  countryCode: string;
}): Promise<ISupplierRecord[]> => {
  return request({
    url: '/workorder/management/base/supplier/list',
    data,
    method: 'post',
  });
};

// 获取国家商标注册详情  serviceId
export const getTrademarkDetailInfo = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/detail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//供应商列表查询
export const getSupplierList = (data: any) => {
  return request({
    url: '/settlementcenter/management/base/supplier/supplierFunctionCode/list',
    data,
    method: 'post',
  });
};

//批量修改律师
export const batchUpdAttorneyApi = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/batchUpdAttorney',
    data,
    method: 'post',
  });
};

//美国、欧盟、英国下载资料
export const dowloadWordOrder = (params: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/standard/zipdowload',
    params,
    method: 'get',
    responseType: 'blob',
  });
};

// 验证受理号
export const closeWorkOrder = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/closeWorkOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 商标工单节点状态变更
export const updateNodeAPI = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/updateNode',
    data,
    method: 'post',
  });
};

//取消工单
export const cacelWordOrder = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/cancel',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 资料导入
export const dataImportModal = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/brandDataImport',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 上传文件(创建OA工单)
export const addFileOaAPI = (data: any) => {
  return request({
    url: '/workorder/management/workOrder/oa/add/fileOa',
    data,
    method: 'post',
  });
};

// 修改文件(创建OA工单)
export const updateFileOaAPI = (data: any) => {
  return request({
    url: '/workorder/management/workOrder/oa/update/fileOa',
    data,
    method: 'post',
  });
};

// 获取所有大类
export const getAllCategoryList = () => {
  return request({
    url: '/workorder/management/trademark/category/allList',
    method: 'post',
  });
};

// 查询小类
export const getPageSubCategory = (data: any) => {
  return request({
    url: '/workorder/management/trademark/category/pageSubCategory',
    data,
    method: 'post',
  });
};

// 翻译暂停信
export const translateStopLetterAPI = (data: any) => {
  return request({
    url: '/workorder/management/workOrder/oa/translate/stopLetter',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 取消暂停信
export const cancelLetterAPI = (data: any) => {
  return request({
    url: '/workorder/management/workOrder/oa/cancel/stopLetter',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 删除官方文件
export const delFileOaAPI = (data: any) => {
  return request({
    url: '/workorder/management/workOrder/oa/del/fileOa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

//---------------------------合规紧急需求------------------start---------------------
// 查询客户邮件  functionCode，countryCode，enterpriseId
export const getEmailConfig = (data: any) => {
  return request({
    url: '/workorder/management/work-email-config/getEmailConfig',
    data,
    method: 'post',
  });
};

// 客户上传资料弹窗 smsSend 是否发送短信  customerData资料URL   {serviceId}或者${workId==id}  ${functionCode}
export const sendCustomFile = (data: any) => {
  return request({
    url: '/workorder/management/service_work_order/sms/send/service',
    data,
    method: 'post',
  });
};

// 是否发送邮件弹窗  ${emailSend} ${functionCode}  (${serviceId} ${workId==id})
export const sendEmail = (data: any) => {
  return request({
    url: '/workorder/management/service_work_order/email/send/service',
    data,
    method: 'post',
  });
};
//---------------------------合规紧急需求----------------end-----------------------

// 商标脚本更新记录列表
export const getTrademarkAutoOperateLog = (data: any) => {
  return request({
    url: '/workorder/management/trademark/workorder/trademarkAutoOperateLog/pagelist',
    data,
    method: 'post',
  });
};

// 商标核名备注列表
export const getTrademarkeRemark = (data: any) => {
  return request({
    url: '/workorder/trademark-search-record-remark/page',
    data,
    method: 'post',
  });
};

// 修改核名备注
export const updateTrademarkRemark = (data: any) => {
  return request({
    url: '/workorder/trademark-search-record-remark/update',
    data,
    method: 'post',
  });
};

// 删除核名备注
export const delTrademarkRemark = (data: any) => {
  return request({
    url: '/workorder/trademark-search-record-remark/del',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 新增核名备注
export const addTrademarkRemark = (data: any) => {
  return request({
    url: '/workorder/trademark-search-record-remark/add',
    data,
    method: 'post',
  });
};

// 查询核名备注详情
export const getTrademarkeRemarkInfo = (data: any) => {
  return request({
    url: '/workorder/management/trademark-search-record-remark/info',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

// 商标核名记录详情
export const getTrademarkDetail = (id: string) => {
  return request({
    url: `/workorder/management/trademarkSearchRecord/detail/${id}`,
    params: { id },
    method: 'get',
  });
};

// 商标核名记录
export const getTrademarkRecordList = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/pageList',
    data,
    method: 'post',
  });
};

// 分配核名专员
export const handleEditCheck = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/edit/check',
    data,
    method: 'post',
  });
};

// 分配当前处理人
export const handleEditCurCheck = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/edit/curCheck',
    data,
    method: 'post',
  });
};

// 编辑核名记录
export const EditTrademarkRecord = (data: any) => {
  return request({
    url: `/workorder/management/trademarkSearchRecord/edit`,
    data,
    method: 'post',
  });
};

// 分配客服
export const handleEditCustomer = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/edit/customer',
    data,
    method: 'post',
  });
};

// 分配销售
export const handleEditSale = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/edit/sale',
    data,
    method: 'post',
  });
};

// 查询商标核名报告
export const getPassRateList = (params: any) => {
  return request({
    url: '/workorder/trademark-search-record-report/passRate/list',
    params,
    method: 'post',
  });
};

// 创建核名
export const handleTrademarkRecordCreate = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/create',
    data,
    method: 'post',
  });
};

// 创建核名(终核创建)
export const handleTrademarkRecordLastCreate = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/create/last',
    data,
    method: 'post',
  });
};

// 批量核名
export const handleTrademarkRecordBatchCreate = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/create/batch',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 批量核名模板下载
export const handleDownloadTemplete = () => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/template',
    method: 'get',
  });
};

// 删除核名
export const handleTrademarkRecordDelete = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/delete',
    data,
    method: 'post',
  });
};

// 获取核名同名信息
export const getTrademarkSameByName = (data: any) => {
  return request({
    url: '/workorder/management/trademarkSearchRecord/getTrademarkByName',
    data,
    method: 'post',
  });
};

// 查询商标核名报告
export const getTrademarkAllReport = (id: any) => {
  return request({
    url: '/workorder/trademark-search-record-report/all',
    data: {
      recordId: id,
    },
    method: 'post',
  });
};

// 保存/提交商标核名报告
export const saveTrademarkRecordReport = (data: any) => {
  return request({
    url: '/workorder/trademark-search-record-report/save',
    data,
    method: 'post',
  });
};

export const addTrademarkRecordReport = (data: any) => {
  return request({
    url: '/workorder/trademark-search-record-report/add',
    data,
    method: 'post',
  });
};

// 查询商标核名报告详情
export const saveTrademarkRecordReportInfo = (id: string) => {
  return request({
    url: '/workorder/trademark-search-record-report/info',
    data: {
      recordId: id,
    },
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 查询商标核名通过率列表
export const getTrademarkPassRateList = (type: number) => {
  return request({
    url: '/workorder/trademark-search-record-report/passRate/list',
    data: {
      type,
    },
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 生成商标核名报告链接
export const createTrademarkReportLink = (reportId: string) => {
  return request({
    url: '/workorder/trademark-search-record-report/generate/link',
    data: {
      reportId,
    },
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 商标记录提交复核
export const recheckTrademarkReport = (recordId: string) => {
  return request({
    url: '/workorder/trademark-search-record-report/recheck',
    data: {
      recordId,
    },
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 商标名称前缀检索
export const getPrefixTrademarkName = (data: any) => {
  return request({
    url: '/xcloudtrademarkclient/management/trademark/search/utils/prefix/trademarkName',
    data,
    method: 'post',
  });
};

// 线下确认报告
export const handleReportConfirm = (data: any) => {
  return request({
    url: '/workorder/trademark-search-record-report/deliverConfirm',
    data,
    method: 'post',
  });
};
