import type { PaginationRes } from '@/types';

// 我的AVT服务-统计
interface VatCount {
  /** 待客户提交 */
  vatCommitCount: number;
  /** 我的VAT服务超时交付 */
  vatDeclareCount: number;
  /** 资料被驳回 */
  vatRejectCount: number;
  /** 下号转代理 */
  vatTaxNumberCount: number;
}

export interface VatCommitCountCountParams {
  /** 公司名称 */
  companyNameZh: string;
  /** 国家编码 */
  countryCode: string[];
  /** 部门 */
  departmentIds: number[];
  /** 企业ID */
  enterpriseIds: number[];
  /** 功能码 2:VAT转代理 5:VAT注册 23:IOSS注册 */
  functionCodes: number[];
  /** 未处理天数-结束 */
  handerTimeEnd: string;
  /** 未处理天数-开始 */
  handerTimeStart: string;
  /** 每页显示多少条数据 */
  limit: number;
  /** 资料提交时间-结束 YYYY-MM-dd HH:mm:ss */
  materialSubmitEnd: string;
  /** 资料提交时间-开始 YYYY-MM-dd HH:mm:ss */
  materialSubmitStart: string;
  nodeCodes: string[];
  orderAttributorId: number[];
  /** 当前数据页码 */
  page: number;
  /** 服务生成时间-结束 YYYY-MM-dd HH:mm:ss */
  serviceCreateEnd: string;
  /** 服务生成时间-开始 YYYY-MM-dd HH:mm:ss */
  serviceCreateStart: string;
  /** 服务ID集合,勾选导出 */
  serviceIds: number[];
  /** 服务名称 */
  serviceName: string;
  /** 客户手机号/订单号/服务号/税号 */
  serviceNo: string;
  /** 服务状态 */
  status: number[];
  userIds: number[];
}

/** 待客户提交-列表 统计 */
export interface VatCommitCountCountRes {
  /** day16T30 16-30天 */
  day16T30: number;
  /** day1T7 1-7天 */
  day1T7: number;
  /** day31T60 31-60天 */
  day31T60: number;
  /** day61T 超过60天 */
  day61T: number;
  /** day8T15 8-15天 */
  day8T15: number;
  /** daySum 全部 */
  daySum: number;
  /** dayTo 全部 */
  dayTo: number;
}

/** 待客户提交-列表 */
export interface VatCommitListRes {
  attributionId: number;
  /** 跟进人名称（订单归属人） */
  attributionName: string;
  /** 公司名称（英文） */
  companyNameEn: string;
  /** 公司名称（中文） */
  companyNameZh: string;
  consoleDepId: number;
  /** 所属部门 */
  consoleDepName: string;
  /** 国家Code */
  countryCode: string;
  /** 国家中文名称 */
  countryNameZh: string;
  /** 服务创建时间 */
  createTime: string;
  /** 当前等待天数 */
  currentDeliveryDay: number;
  /** 节点 */
  currentNodeCode: string;
  /** 客户资料url */
  customerData: string;
  /** 客户发送邮箱时间 */
  customerDataSendTime: string;
  /** 预计交付时长 */
  deliveryDay: number;
  /** 是否发送邮件 true/false */
  emailSend: boolean;
  enterpriseId: number;
  /** 是否存在驳回 */
  existReject: boolean;
  /** 是否存在备注 */
  existRemark: boolean;
  /** 服务过期时间 */
  expirationTime: string;
  /** 首次提交资料时间 */
  firstCommitTime: string;
  /** 是否上传了资料 true/false */
  flagCustomerData: boolean;
  /**  服务类型 2=VAT转代理  5=VAT注册   23=IOSS注册 */
  functionCode: 2 | 5 | 23;
  gatewayId: string;
  gatewayPassword: string;
  /** 处理人 */
  handler: string;
  /** 处理人用户Id */
  handlerUserId: string;
  /** 工单基础ID */
  id: number;
  /** 标签Id */
  labelId: number;
  /** 标签名 */
  labelName: string;
  mobile: string;
  /** 订单号 */
  orderNo: string;
  orderRemark: string;
  /** 流程朝向(1:正常 2:驳回) */
  progressBar: 1 | 2;
  secret: string;
  /** 服务完成时间 */
  serviceCompleteTime: string;
  /** 服务名 */
  serviceId: number;
  serviceName: string;
  /** 服务号 */
  serviceNo: string;
  /** 服务对象 */
  serviceObj: string;
  /** 最新跟进记录 */
  situationContent: string;
  /** 最新跟进时间 */
  situationTime: string;
  /** 是否发送短信 true/false */
  smsSend: boolean;
  /** 服务状态 */
  status: number;
  /** 提交服务商时间 */
  submitServiceTime: string;
  /** 服务商分配编码 */
  supplierAssignsCode: string;
  /** 服务商id */
  supplierId: number;
  /** 服务商 */
  supplierName: string;
  timeout: boolean;
  /** 跟单数 */
  trackTotal: number;
  /** 客户id */
  userId: number;
  /** 客户等级 普通客户:0 1:SMB客户 2:KA客户 3:品牌客户 4:渠道客户 */
  userLevel: '0' | '1' | '2' | '3' | '4';
  /** 客户手机号 */
  userMobile: string;
  /** 税号 */
  vatTaxNumber: string;
  /** 预警值天数 */
  warnDay: number;
  /** 预警值 */
  warnValue: number;
  /** 工单号 */
  workNo: string;
  /** 工单状态(1.正常 2.已取消) */
  workStatus: 1 | 2;
  /** 流程id */
  workflowId: number;
}

/**  已下号/转代理列表统计 */
export interface VatTaxNumber {
  /** "CURRENTDAY"当天  "CURRENTWEEK"当周  "CURRENTMONTH" 当月  "TOTAL"总数  */
  name: 'CURRENTDAY' | 'CURRENTWEEK' | 'CURRENTMONTH' | 'TOTAL';
  serviceId: number;
  status: number;
  value: number;
}
export type VatTaxNumberRes = VatTaxNumber[];

/**  已下号/转代理列表 */
export interface VatTaxNumberPage {
  attributionId: number;
  /** 跟进人名称（订单归属人） */
  attributionName: string;
  /** 服务公司 */
  companyNameEn: string;
  companyNameZh: string;
  /** 完成申报数量 */
  completeDeclareCount: number;
  /** 所属部门 */
  consoleDepId: number;
  consoleDepName: string;
  /** 国家Code */
  countryCode: string;
  countryNameZh: string;
  /** 服务创建时间 */
  createTime: string; //string(date-time)
  /** 节点 */
  currentNodeCode: string;
  /** 客户资料url */
  customerData: string;
  /** 客户发送邮箱时间 */
  customerDataSendTime: string; //string(date-time)
  dateGroupStr: string;
  /** 申报周期类型(0:月报 1:季报 2:年报) */
  declarePeriod: number;
  /** 是否发送邮件 true/false */
  emailSend: boolean;
  enterpriseId: number;
  enterpriseName: string;
  /** 是否存在驳回 */
  existReject: boolean;
  /** 是否存在备注 */
  existRemark: boolean;
  expirationTime: string; //string(date-time)
  /** 首次提交资料时间 */
  firstCommitTime: string; //string(date-time)
  /** 是否上传了资料 true/false */
  flagCustomerData: boolean;
  /** 功能吗 */
  functionCode: number;
  gatewayId: string;
  gatewayPassword: string;
  handler: string;
  handlerUserId: string;
  /** 工单基础ID */
  id: number;
  labelId: number;
  labelName: string;
  localTaxNumber: string;
  mobile: string;
  orderNo: string;
  orderRemark: string;
  /** 待申报数量 */
  pendingDeclareCount: number;
  /** 待缴税数量 */
  pendingPayDeclareCount: number;
  /** 流程朝向(1:正常 2:驳回) */
  progressBar: number;
  rejectContent: string;
  /** 被驳回数量 */
  rejectDeclareCount: number;
  /** 驳回时间 */
  rejectTime: string; //string(date-time)
  /** 剩余服务日期(天) */
  remainingDay: number;
  secret: string;
  /** 服务完成时间 */
  serviceCompleteTime: string; //string(date-time)
  serviceId: string;
  serviceName: string;
  serviceNo: string;
  serviceObj: string;
  /** 最新跟进记录 */
  situationContent: string;
  /** 最新跟进时间 */
  situationTime: string; //string(date-time)
  /** 是否发送短信 true/false */
  smsSend: boolean;
  /** 服务状态 */
  status: number;
  /** 提交服务商时间 */
  submitServiceTime: string; //string(date-time)
  supplierAssignsCode: string;
  /** 服务商id */
  supplierId: number;
  supplierName: string;
  /** 税号生效日期 */
  taxEffectiveDate: string; //string(date-time)
  /** 税率 */
  taxRate: string;
  /** 跟单数 */
  trackTotal: number;
  /** 客户id */
  userId: number;
  userLevel: number;
  /** 客户手机号 */
  userMobile: string;
  /** 欧盟税号 */
  vatTaxEuNumber: string;
  /** 税号 */
  vatTaxNumber: string;
  /** 预警值天数 */
  warnDay: number;
  /** 预警值 */
  warnValue: number;
  /** 工单号 */
  workNo: string;
  /** 工单状态(1.正常 2.已取消) */
  workStatus: number;
  /** 流程id */
  workflowId: number;
}
export type VatTaxNumberPageRes = PaginationRes<VatTaxNumberPage[]>;

/** 申报详情 */
export interface VatDeclareDetailVO {
  /** 申报周期开始时间 */
  beginTime: string;
  /** 申报回执 */
  declareReceipt: string;
  /** 申报周期结束时间 */
  endTime: string;
  /** 工单状态(10:待提交申报 13:待缴纳税金 16:申报完成 18:待提交申报(驳回) 19:待缴纳税金(驳回)) */
  status: 10 | 13 | 16 | 18 | 19;
  /** 工单编号 */
  taxWorkNo: string;
  /** 税局税号 */
  vatTaxNumber: string;
  /** 工单状态(1.正常 2.已取消) */
  workStatus: 1 | 2;
}
export interface DeclareDetailRes {
  companyNameZh: string;
  /** 国家中文名称 */
  countryNameZh: string;
  /** 申报详情 */
  declareDetailVOList: VatDeclareDetailVO[];
  /** 申报周期(0、月报 1、季报 2、年报) */
  declarePeriod: '0' | '1' | '2';
  /** 订单号 */
  orderNo: string;
  /** 服务号 */
  serviceNo: string;
  /** 服务状态 1、服务中 2、待续费 3、税号注销 4 已转出 9.已取消 10 封存 11取消中 12.已续费 13.确认转出 */
  status: 1 | 2 | 3 | 4 | 9 | 10 | 11 | 12 | 13;
  /** 税号生效日期 */
  taxEffectiveDate: string;
  /** 税号下发日期 */
  taxIssueDate: string;
  /** 税号 */
  vatTaxNumber: string;
  /** 税号证书 */
  vatTaxNumberFile: string;
  /** 工单号 */
  workNo: string;
}
