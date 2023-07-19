import request from "@/libs/request";

/**财务管理/收款-导出excl
 * @param {*} data
 * @returns
 */
export function exportExcel(data) {
  return request({
    url: "/order/management/orderPayment/download",
    method: "post",
    responseType: "blob",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}
/**财务管理-收款列表
 * @param {*} data
 * @returns
 */
export function getList(data) {
  return request({
    url: "/order/management/orderPayment/list",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}
/**财务管理-金额合计列表
 * @param {*} data
 * @returns
 */
export function paymentList(data) {
  return request({
    url: "/order/management/orderPayment/statistics",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}
