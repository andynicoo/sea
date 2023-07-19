//请求参数
export interface QueryParams {
  current?: number;
  size?: number;
  [key: string]: any;
}

//接口响应
export interface ResponseVO<T> {
  code: number;
  message: string;
  path: string;
  data: T;
  extra: any;
  timestamp: string;
}

//接口响应data
export interface ResponseDataVO<T> {
  requirementResultDTO(requirementResultDTO: any): unknown;
  records: T[];
  total: number;
  size: number;
  current: string;
  orders: any[];
  hitCount: boolean;
  searchCount: boolean;
  pages: string;
}

//所有用户信息的用户信息详情
export interface UsersInfoVO {
  userId: string;
  departmentName: string;
  nickName: string;
  mobile: string;
}

//商品经理
export interface commodityManagerVo {
  label?: string;
  value?: string;
  key?: string;
}

//主体
export interface EnterpriseVo {
  createTime: string;
  updateTime: string;
  id: number;
  name: string;
  code: string;
  status: number;
  createId: string;
  createName: string;
  legalPerson: string;
  contactPerson: string;
  remark: string;
  dingCorpId: string;
  mobile: string;
  smsSigName: string;
  clientDomainName: string;
  publicIdNumber: string;
  productName: string;
  companyName: string;
  companyAddress: string;
  email: string;
  serviceHotline: string;
  privacyPolicyLink: string;
  serviceAgreementLink: string;
  copyrightInfo: string;
  icpRecordNo: string;
  recordLink: string;
  browserIco: string;
  logo: string;
  lightColourLogo: string;
  bottomLogo: string;
  communityQrCode: string;
  gzhQrCode: string;
  taxpayerType: string;
  taxSaleYear: number;
}
