//工单列表入参
export interface IWorkorderQueryParams {
  serviceNo?: string;
  mobile?: string;
  applyName?: string;
  orderNo?: string;
  acceptNum?: string;
  trademarkNameEn?: string;
  countryCode?: string;
  serviceName?: string;
  servicesStatus?: number;
  handleUserName?: string;
  orderSource?: number;
  attorneyId?: string;
  attributionId?: string;
  createEndTime?: string;
  createStartTime?: string;
  updateEndTime?: string;
  updateStartTime?: string;
  acceptEndTime?: string;
  acceptStartTime?: string;
  isProxy?: boolean;
  platformAuditEndDate?: string;
  platformAuditStartDate?: string;
  progressBar?: string;
  nodeCode?: string;
  nodeServiceProgressKey?: string;
  creatTime?: string[];
  updateTime?: string[];
  acceptTime?: string[];
  platformAuditTime?: string[];
}

//工单节点返回
export interface INodeRecord {
  nodeCode: string;
  nodeName?: string;
  nodeServiceProgress?: number;
  nodeServiceProgressName?: string;
}

//服务商律师返回
export interface ISupplierRecord {
  id: string;
  shortName: string;
}

//工单返回
export interface IWorkorderRecord {
  servicesId?: string;
  serviceId?: string;
  serviceNo?: string;
  workOrderId?: string;
  serviceName?: string;
  productId?: string;
  userId?: string;
  orderNo?: string;
  userMobile?: string;
  trademarkNameEn?: string;
  countryCode?: string;
  countryNameZh?: string;
  countryNameEn?: string;
  supplierId?: number;
  supplierName?: string;
  applyType?: number;
  companyNameEn?: string;
  companyNameZh?: string;
  proposerLastNameEn?: string;
  proposerLastNameZh?: string;
  proposerFullNameEn?: string;
  proposerFullNameZh?: string;
  applyName?: string;
  nodeCode?: string;
  serviceStatus?: number;
  serviceStatusStr?: string;
  progressBar?: number;
  serviceProgress?: number;
  serviceProgressStr?: string;
  acceptNum?: string;
  acceptTime?: string;
  trademarkType?: number;
  trademarkCategory?: string;
  trademarkCategoryOneNum?: string;
  createTime?: string;
  updateTime?: string;
  orderRemark?: string;
  workorderHandlerList?: WorkorderHandlerList[];
  workorderHandlerListStr?: string;
  productFunctionCode?: string;
  attorneyName?: string;
  newDownloadTime?: string;
  warningLastTime?: string;
  deliveryDeadline?: string;
  exceedWarningTime?: number;
  exceedDelivery?: number;
  monitorTime?: string;
  attributionId?: string;
  attributionName?: string;
  trademarkStatus?: string;
  trademarkStatusDate?: string;
  platformAuditDate?: string;
}

export interface WorkorderHandlerList {
  createTime?: string;
  updateTime?: string;
  id?: string;
  serviceId?: string;
  workOrderId?: number;
  workNo?: string;
  serviceType?: number;
  countryCode?: string;
  handlerUserId?: string;
  handlerUserName?: string;
  handleTypeName?: string;
  handleType?: number;
  enterpriseId?: number;
}
