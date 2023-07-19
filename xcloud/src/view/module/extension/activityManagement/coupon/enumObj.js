// 优惠券类型列表
export const couponTypeList = [
  { label: '满减券', value: 'FULL_REDUCTION' },
  { label: '折扣券', value: 'DISCOUNT' },
];
// 优惠券类型枚举
export const couponTypeEnum = {
  FULL_REDUCTION: 'FULL_REDUCTION',
  DISCOUNT: 'DISCOUNT',
};

// 优惠券状态列表
export const statusList = [
  { label: '未开始', value: 'NOT_STARTED' },
  { label: '进行中', value: 'PROCESSING' },
  { label: '已结束', value: 'FINISHED' },
];
// 优惠券状态枚举
export const statusEnum = {
  NOT_STARTED: 'NOT_STARTED',
  PROCESSING: 'PROCESSING',
  FINISHED: 'FINISHED',
};

// 活动类型列表
export const activityTypeList = [
  { label: '专享礼券（官网首页可见）', value: 'VIP_COUPON' },
  { label: '领券中心（客户端和小程序/可见）', value: 'VOUCHER_CENTER_PC' },
  { label: '领券活动（用户不可见）', value: 'POLITE_INVITATION' },
];
// 活动类型枚举
export const activityTypeEnum = {
  VIP_COUPON: 'VIP_COUPON',
  VOUCHER_CENTER_PC: 'VOUCHER_CENTER_PC',
  POLITE_INVITATION: 'POLITE_INVITATION',
};

// 可用商品列表
export const applyProductTypeList = [
  { label: '所有服务商品', value: 'ALL_PRODUCT' },
  { label: '指定商品可用', value: 'SPECIFIED_PRODUCT_ENABLE' },
  { label: '指定商品不可用', value: 'SPECIFIED_PRODUCT_DISABLE' },
];
// 可用商品枚举
export const applyProductTypeEnum = {
  ALL_PRODUCT: 'ALL_PRODUCT',
  SPECIFIED_PRODUCT_ENABLE: 'SPECIFIED_PRODUCT_ENABLE',
  SPECIFIED_PRODUCT_DISABLE: 'SPECIFIED_PRODUCT_DISABLE',
};

// 限领次数列表
export const receiveLimitTypeList = [
  { label: '不限次数', value: 'NO_LIMIT' },
  { label: '限制领取', value: 'RESTRICTED_COLLECTION' },
  { label: '每天限制领取', value: 'DAILY_LIMIT' },
];
// 限领次数枚举
export const receiveLimitTypeEnum = {
  NO_LIMIT: 'NO_LIMIT',
  RESTRICTED_COLLECTION: 'RESTRICTED_COLLECTION',
  DAILY_LIMIT: 'DAILY_LIMIT',
};

// 用券时间列表
export const useTimeTypeList = [
  { label: '固定时间', value: 'FIXED_TIME' },
  { label: '发券当日起生效', value: 'TERM_EFFECTIVE' },
  { label: '发券次日起生效', value: 'VALID_AFTER_EXPIRATION' },
];
// 用券时间枚举
export const useTimeTypeEnum = {
  // 固定时间
  FIXED_TIME: 'FIXED_TIME',
  // 领/发券后立即生效,y天内可用
  TERM_EFFECTIVE: 'TERM_EFFECTIVE',
  // 领/发券后x天后生效,y天内可用
  VALID_AFTER_EXPIRATION: 'VALID_AFTER_EXPIRATION',
};

// 标签列表
export const labelList = [
  { label: '不使用标签', value: 'NO_USE_LABEL' },
  { label: '新人专享', value: 'EXCLUSIVE_FOR_NEWCOMERS' },
  { label: '每天限制领取', value: 'DAILY_LIMIT' },
];
// 标签枚举
export const labelEnum = {
  NO_USE_LABEL: 'NO_USE_LABEL',
  EXCLUSIVE_FOR_NEWCOMERS: 'EXCLUSIVE_FOR_NEWCOMERS',
  DAILY_LIMIT: 'DAILY_LIMIT',
};

// 优惠叠加列表
export const couponSuperposeList = [
  { label: '优惠券仅原价购买时可用', value: 'ORIGINAL_PRICE' },
  { label: '活动商品可用', value: 'ACTIVITY_PRODUCT' },
];
// 优惠叠加枚举
export const couponSuperposeEnum = {
  ORIGINAL_PRICE: 'ORIGINAL_PRICE',
  ACTIVITY_PRODUCT: 'ACTIVITY_PRODUCT',
};

// 使用门槛列表
export const useThresholdTypeList = [
  { label: '无使用门槛', value: 'NO_THRESHOLD' },
  { label: '订单满指定金额可用', value: 'USE_CONDITION_BY_MONEY' },
  { label: '订单满指定件数可用', value: 'USE_CONDITION_BY_PIECE' },
];
// 使用门槛枚举
export const useThresholdTypeEnum = {
  NO_THRESHOLD: 'NO_THRESHOLD',
  USE_CONDITION_BY_MONEY: 'USE_CONDITION_BY_MONEY',
  USE_CONDITION_BY_PIECE: 'USE_CONDITION_BY_PIECE',
};

// 领取人列表
export const receiveConditionList = [
  { label: '不限制，所有人可领', value: 'ALL_PERSON' },
  { label: '新客户可用', value: 'NEW_PERSON' },
];
// 领取人枚举
export const receiveConditionEnum = {
  ALL_PERSON: 'ALL_PERSON',
  NEW_PERSON: 'NEW_PERSON',
};

// 来源方式列表
export const sourceList = [
  { label: '系统发放', value: 'MANUAL' },
  { label: '客户领取', value: 'GET' },
  { label: '活动发放', value: 'ACTIVITY' },
  { label: '抽奖获得', value: 'DRAW' },
  { label: '转赠', value: 'TRANSFER' },
  { label: '积分兑换', value: 'INTEGRAL' },
];

// 来源方式枚举
export const sourceEnum = {
  MANUAL: 'MANUAL', // 手动发放
  ACTIVITY: 'ACTIVITY', // 活动创建
};

// 领取记录

// 使用状态列表
export const useStatusList = [
  { label: '未使用', value: 'UNUSED', class: 'text' },
  { label: '已使用', value: 'USED', class: 'text-blue' },
  { label: '已过期', value: 'INVALID', class: 'text-warning' },
  { label: '已作废', value: 'VOIDED', class: 'text-warning' },
  { label: '未生效', value: 'UN_TAKE_EFFECT', class: '' },
  { label: '已转赠', value: 'TRANSFERRED', class: 'text-warning' },
  { label: '转赠中', value: 'TRANSFERRING', class: 'text-warning' },
];
// 使用状态枚举
export const useStatusEnum = {
  UNUSED: 'UNUSED',
  USED: 'USED',
  INVALID: 'INVALID',
  VOIDED: 'VOIDED',
  UN_TAKE_EFFECT: 'UN_TAKE_EFFECT',
};

// 使用范围列表
export const useRangeList = [
  { label: '适用所有', value: 'ALL_PRODUCT' },
  { label: '指定商品可用', value: 'SPECIFIED_PRODUCT_ENABLE' },
  { label: '指定商品不可用', value: 'SPECIFIED_PRODUCT_DISABLE' },
];

export const newUserUsedList = [
  { label: '否', value: 0 },
  { label: '是', value: 1 },
];
