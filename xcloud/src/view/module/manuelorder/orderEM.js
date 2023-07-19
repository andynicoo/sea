/**
 * 付款类型
 */
export const PAYMENTTYPE = {
  /**正常付款(全款支付)  */
  NORMAL: 'NORMAL',
  /**分期付款(支付定金)  */
  PART: 'PART',
};
/**
 * 订单类型
 */
export const ORDERTYPE = {
  /**正常订单 */
  NORMAL: 'NORMAL',
  /**项目制订单 */
  PROJECT: 'PROJECT',
  /**溢价订单 */
  PREMIUM: 'PREMIUM',
  /**退换货订单 */
  EXCHANGE: 'EXCHANGE'
};

/**
 * 订单来源
 */
export const ORDERSOURCE = {
  PC: 'PC',
  H5: 'H5',
  /**手工录入 */
  IN: 'IN',
  /**渠道系统 */
  CS: 'CS',
};
