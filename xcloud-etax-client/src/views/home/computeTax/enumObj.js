export const statusObj = {
  WAIT_SUBMIT: 10,
  WAIT_AUDIT_DECLARE: 11,
  DECLARING: 12,
  WAIT_PAID: 13,
  WAIT_AUDIT: 14,
  DECLARE_DOCK_COMPLATE: 15,
  DECLARE_COMPLETE: 16,
  VOUCHER_REJECT: 17,
  Sub_REJECT: 18,
  Tax_REJECT: 19,
};
export const statusList = [
  { label: '待提交申报', value: statusObj.WAIT_SUBMIT },
  { label: '待审核申报', value: statusObj.WAIT_AUDIT_DECLARE },
  { label: '申报中', value: statusObj.DECLARING },
  { label: '待缴纳税金', value: statusObj.WAIT_PAID },
  { label: '待审核税金', value: statusObj.WAIT_AUDIT },
  { label: '申报对接完成', value: statusObj.DECLARE_DOCK_COMPLATE },
  { label: '申报完成', value: statusObj.DECLARE_COMPLETE },
  { label: '转出代理', value: statusObj.VOUCHER_REJECT },
  { label: '待提交申报(驳回) ', value: statusObj.Sub_REJECT },
  { label: '待缴纳税金(驳回) ', value: statusObj.Tax_REJECT },
];
export const serviceStatusList = [
  { label: '服务中 ', value: '1' },
  { label: '注销税号 ', value: '3' },
  { label: '转出代理 ', value: '4' },
  { label: '待续费 ', value: '2' },
  { label: '已取消', value: '9' },
  { label: '取消中', value: '11' },
];

export const ruleObj = {
  HAVE_DATA: 0,
  Two_DATA: 1,
  Three_DATA: 2,
};
export const ruleList = [
  // { label: "目的国", value: ruleObj.HAVE_DATA },
  // { label: "发出国", value: ruleObj.Two_DATA },
  { label: '零申报', value: ruleObj.HAVE_DATA },
  { label: '有数据', value: ruleObj.Two_DATA },
];

export const typeList = [
  { label: 'C79/88', value: 1 },
  { label: '发票抵扣', value: 2 },
  { label: 'B2B发票', value: 4 },
  { label: '其它', value: 3 },
];
export const typeListGB = [
  { label: 'C79/88', value: 1 },
  { label: '发票抵扣', value: 2 },
  { label: 'PVA', value: 5 },
  { label: '其它', value: 3 },
];
export const typeListSA = [
  { label: '平台佣金', value: 6 },
  { label: '运费', value: 7 },
  { label: '仓储费', value: 8 },
  { label: '推广费', value: 9 },
  { label: '其它', value: 3 },
];
//27个欧盟国及其税率
export const otherOmCountryList = [
  { countryName: '奥地利', countryCode: 'AT', currency: 'EUR', sales: 0.0 },
  { countryName: '比利时', countryCode: 'BE', currency: 'EUR', sales: '' },
  { countryName: '保加利亚', countryCode: 'BG', currency: 'EUR', sales: '' },
  { countryName: '塞浦路斯', countryCode: 'CY', currency: 'EUR', sales: '' },
  { countryName: '捷克共和国', countryCode: 'CZ', currency: 'EUR', sales: '' },
  { countryName: '德国', countryCode: 'DE', currency: 'EUR', sales: '' },
  { countryName: '丹麦', countryCode: 'DK', currency: 'EUR', sales: '' },
  { countryName: '爱沙尼亚', countryCode: 'EE', currency: 'EUR', sales: '' },
  { countryName: '希腊', countryCode: 'EL/GR', currency: 'EUR', sales: '' },
  { countryName: '西班牙', countryCode: 'ES', currency: 'EUR', sales: '' },
  { countryName: '芬兰', countryCode: 'FI', currency: 'EUR', sales: '' },
  { countryName: '法国', countryCode: 'FR/MC', currency: 'EUR', sales: '' },
  { countryName: '克罗地亚', countryCode: 'HR', currency: 'EUR', sales: '' },
  { countryName: '匈牙利', countryCode: 'HU', currency: 'EUR', sales: '' },
  { countryName: '爱尔兰', countryCode: 'IE', currency: 'EUR', sales: '' },
  { countryName: '意大利', countryCode: 'IT', currency: 'EUR', sales: '' },
  { countryName: '立陶宛', countryCode: 'LT', currency: 'EUR', sales: '' },
  { countryName: '卢森堡', countryCode: 'LU', currency: 'EUR', sales: '' },
  { countryName: '拉脱维亚', countryCode: 'LV', currency: 'EUR', sales: '' },
  { countryName: '马耳他', countryCode: 'MT', currency: 'EUR', sales: '' },
  { countryName: '荷兰', countryCode: 'NL', currency: 'EUR', sales: '' },
  { countryName: '波兰', countryCode: 'PL', currency: 'EUR', sales: '' },
  { countryName: '葡萄牙', countryCode: 'PT', currency: 'EUR', sales: '' },
  { countryName: '罗马尼亚', countryCode: 'RO', currency: 'EUR', sales: '' },
  { countryName: '瑞典', countryCode: 'SE', currency: 'EUR', sales: '' },
  { countryName: '斯洛文尼亚', countryCode: 'SI', currency: 'EUR', sales: '' },
  { countryName: '斯洛伐克', countryCode: 'SK', currency: 'EUR', sales: '' },
];

export const tfnCountryList = [
  { countryName: '英国', countryCode: 'GB', bg: require('@/assets/images/country/GBflag.png') },
  { countryName: '德国', countryCode: 'DE', bg: require('@/assets/images/country/DEflag.png') },
  { countryName: '法国', countryCode: 'FR', bg: require('@/assets/images/country/FRflag.png') },
  { countryName: '意大利', countryCode: 'IT', bg: require('@/assets/images/country/ITflag.png') },
  { countryName: '西班牙', countryCode: 'ES', bg: require('@/assets/images/country/ESflag.png') },
  { countryName: '捷克', countryCode: 'CZ', bg: require('@/assets/images/country/CZflag.png') },
  { countryName: '波兰', countryCode: 'PL', bg: require('@/assets/images/country/PLflag.png') },
  { countryName: '荷兰', countryCode: 'NL', bg: require('@/assets/images/country/NLflag.png') },
  { countryName: '奥地利', countryCode: 'AT', bg: require('@/assets/images/country/ATflag.png') },
  { countryName: '爱尔兰', countryCode: 'IE', bg: require('@/assets/images/country/IEflag.png') },
  { countryName: '爱沙尼亚', countryCode: 'EE', bg: require('@/assets/images/country/EEflag.png') },
  { countryName: '保加利亚', countryCode: 'BG', bg: require('@/assets/images/country/BGflag.png') },
  { countryName: '比利时', countryCode: 'BE', bg: require('@/assets/images/country/BEflag.png') },
  { countryName: '丹麦', countryCode: 'DK', bg: require('@/assets/images/country/DKflag.png') },
  { countryName: '芬兰', countryCode: 'FI', bg: require('@/assets/images/country/FIflag.png') },
  { countryName: '克罗地亚', countryCode: 'HR', bg: require('@/assets/images/country/HRflag.png') },
  { countryName: '拉脱维亚', countryCode: 'LV', bg: require('@/assets/images/country/LVflag.png') },
  { countryName: '立陶宛', countryCode: 'LT', bg: require('@/assets/images/country/LTflag.png') },
  { countryName: '卢森堡', countryCode: 'LU', bg: require('@/assets/images/country/LUflag.png') },
  { countryName: '马耳他', countryCode: 'MT', bg: require('@/assets/images/country/MTflag.png') },
  { countryName: '塞浦路斯', countryCode: 'CY', bg: require('@/assets/images/country/CYflag.png') },
  { countryName: '希腊', countryCode: 'GR', bg: require('@/assets/images/country/GRflag.png') },
  { countryName: '匈牙利', countryCode: 'HU', bg: require('@/assets/images/country/HUflag.png') },
];
