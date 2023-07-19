import request from "@/libs/request";

/**财务管理-退款列表
 * @param {*} data
 * @returns
 */
export function getList(data) {
  return request({
    url: "/order/management/orderRefund/detailList",
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
export function orderRefundList(data) {
  return request({
    url: "/order/management/orderRefund/statistics",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}
/**财务管理/退款-导出excl
 * @param {*} data
 * @returns
 */
export function exportExcel(data) {
  return request({
    url: "/order/management/orderRefund/detailDownLoad",
    method: "post",
    data,
    responseType: "blob",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}
