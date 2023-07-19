export const progressBarObj = {
  WAIT_UPLOAD: 'NODE0361',
  WAIT_REVIEW: 'NODE0362',
  REVIEWED: 'NODE0363',
  REGISTERING: 'NODE0364',
  WAIT_RECOVER: 'NODE0365',
  AUTH_RECOVER: 'NODE0366',
  REGISTER_COMPLETE: 'NODE0367',
};
export const progressBarList = [
  { label: '待提交续费申请', value: progressBarObj.WAIT_UPLOAD },
  { label: '待开启续费通道', value: progressBarObj.WAIT_REVIEW },
  { label: '待续费', value: progressBarObj.REVIEWED },
  { label: '续费中', value: progressBarObj.REGISTERING },
  { label: '待缴纳回收费', value: progressBarObj.WAIT_RECOVER },
  { label: '待审核回收费', value: progressBarObj.AUTH_RECOVER },
  { label: '续费完成', value: progressBarObj.REGISTER_COMPLETE },
];
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
