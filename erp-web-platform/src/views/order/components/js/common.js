// 校验状态值
export function checkStatus(status = [], obj = {}, key = 'orderCode') {
  return status.some((item) => item === obj[key])
}
// 状态颜色映射
export const colorMap = {
  READY_TO_SHIP2: '#FF4A4A', //待发货
  READY_TO_SHIP: '#FF4A4A', //已拿货待发货
  UNPAID: '#FF4A4A', //未付款
  RETRY_SHIP: '#FF6B38', //重新发货
  SHIPPED: '#FFAD42', //运送中
  COMPLETED: '#F0F9EB', //已完成
  CANCELLED: '#F4F4F5', //已取消
  IN_CANCEL: '#5AA0FF', //取消中
  TO_RETURN: '#FF6B38' //退货/退款
}
