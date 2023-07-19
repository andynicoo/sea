export const billStatus = (status) => {
  return status == 'WAIT_SETTLE' ? '待结算' : status == 'PART_SETTLE' ? '部分结算' : status == 'SETTLED' ? '已结算' : '已取消';
};

export const BILLSUMMARY = [
  {
    prop: 'billNo',
    label: '账单号',
  },
  {
    prop: 'billDateStr',
    label: '账单日',
  },
  {
    prop: 'billType',
    label: '账单类型',
  },
  {
    prop: 'billAmount',
    label: '账单金额',
  },
  {
    prop: 'settledAmount',
    label: '已结算金额',
  },
  {
    prop: 'surplusAmount',
    label: '剩余结算金额',
  },
  {
    prop: 'billStatus',
    label: '状态',
  },
  {
    prop: 'settleTime',
    label: '结算日期',
  },
];

export const BILLPAYSUMMARY = [
  {
    prop: 'billNo',
    label: '账单号',
  },
  {
    prop: 'billDateStr',
    label: '账单日',
  },
  {
    prop: 'billType',
    label: '账单类型',
  },
  {
    prop: 'billAmount',
    label: '账单金额',
  },
  {
    prop: 'settledAmount',
    label: '已结算金额',
  },

  {
    prop: 'surplusAmount',
    label: '剩余结算金额',
  },
];

export const CHECKOPTiON = [
  { label: '不开票', value: 'NONE' },
  { label: '增值税普通发票(个人)', value: 'GENERAL_PERSON' },
  { label: '增值税普通发票(公司)', value: 'GENERAL_ENTERPRISE' },
  { label: '增值专用发票', value: 'SPECIAL' },
];

export function setInvocieType(param) {
  let val = 'NONE';
  if (!Object.keys(param).length == 0) {
    let { invoiceType, subjectType } = param;
    if (invoiceType == 'SPECIAL') {
      val = 'SPECIAL';
    } else {
      val = subjectType == 'PERSON' ? 'GENERAL_PERSON' : 'GENERAL_ENTERPRISE';
    }
  }
  let invoce = CHECKOPTiON.find((item) => item.value == val);
  return invoce.label;
}

export function setUserinfo(customerInfo) {
  let userInfo = { name: undefined, product: undefined, materials: undefined };
  try {
    let obj = JSON.parse(customerInfo);
    if (typeof obj == 'object') return obj;
  } catch (e) {
    return userInfo;
  }
}

//         WECHAT_SCAN_CODE    微信扫码
// ALIPAY_SCAN_CODE    支付宝扫码
// WECHAT_OFFICIAL_ACCT    微信公众号
// WECHAT_MINI_PROGRAM    微信小程序
// PERSONAL_EBANK    个人网银
// ENTERPRISE_EBANK    企业网银
// WECHAT_H5    微信H5支付
// WEIXIN    微信
// ALIPAY    支付宝
// UNIONPAY    银联
// VIRTUAL    虚拟支付
export const PAYMODE = [
  { key: 'WECHAT_SCAN_CODE', label: '微信扫码' },
  { key: 'ALIPAY_SCAN_CODE', label: '支付宝扫码' },
  { key: 'WECHAT_OFFICIAL_ACCT', label: '微信公众号' },
  { key: 'WECHAT_MINI_PROGRAM', label: '微信小程序' },
  { key: 'PERSONAL_EBANK', label: '个人网银' },
  { key: 'ENTERPRISE_EBANK', label: '企业网银' },
  { key: 'WECHAT_H5', label: '微信H5支付' },
  { key: 'WEIXIN', label: '微信' },
  { key: 'ALIPAY', label: '支付宝' },
  { key: 'UNIONPAY', label: '银联' },
  { key: 'VIRTUAL', label: '虚拟支付' },
  { key: 'OFFLINE_PAYMENT', label: '转账支付' },
];
