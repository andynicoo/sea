export const progressBarObj = {
  WAIT_UPLOAD: 'NODE0060',
  WAIT_REVIEW: 'NODE0061',
  REVIEWED: 'NODE0062',
  WAIT_AUTHORIZE: 'NODE0063',
  AUTHORIZE_WAIT_CONFIRM: 'NODE0064',
  REGISTERING: 'NODE0065',
  WAIT_RECOVER: 'NODE0365',
  AUTH_RECOVER: 'NODE0366',
  REGISTER_COMPLETE: 'NODE0066',
};
export const progressBarList = [
  { label: '待上传资料', value: progressBarObj.WAIT_UPLOAD },
  { label: '待审核', value: progressBarObj.WAIT_REVIEW },
  { label: '已审核', value: progressBarObj.REVIEWED },
  { label: '待授权', value: progressBarObj.WAIT_AUTHORIZE },
  { label: '授权待确认', value: progressBarObj.AUTHORIZE_WAIT_CONFIRM },
  { label: '注册中', value: progressBarObj.REGISTERING },
  { label: '待缴纳回收费', value: progressBarObj.WAIT_RECOVER },
  { label: '待审核回收费', value: progressBarObj.AUTH_RECOVER },
  { label: '注册完成', value: progressBarObj.REGISTER_COMPLETE },
];

export const weeeObj = {
  productCategory: '',
  productLogo: '',
  productName: '',
  saleWeight: '',
  sideMaxSize: '',
  effectDate: '',
};

export const battObj = {
  productName: '',
  batteryType: '',
  materialType: '',
  isCharge: '',
  unitWeight: '',
  yearDeliveryNum: '',
  batteryBrand: '',
};

export const productFunctionCodeMap = {
  weee: 3108,
  // 纺织法
  textile: 3103,
  // 电池法
  batt: 3101,
  // 包装法
  pack: 3102,
  // 家具法
  furnishing: 3104,
  // 印刷法
  printing: 3105,
  // 轮胎法
  tire: 3106,
  // 玩具法
  toy: 3107,
};
