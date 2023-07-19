import request from "@/libs/request";

/**
 * 修改服务商分配编码
 * @param {*} params
 * serviceId 服务id
 */
export function getList(params) {
  return request({
    url: "/workorder/official-fee-work-order/list",
    method: "post",
    data: params
  });
}

/**
 * 批量付款
 * @param {*} params
 * ids 官费ids
 */
export function rejectVerificationCode(params) {
  return request({
    url: "/workorder/official-fee-work-order/rejectVerificationCode",
    method: "post",
    data: params
  });
}

/**
 * 导出
 * @param {*} params
 */
export function exportExcel(params) {
  return request({
    url: "/workorder/official-fee-work-order/export",
    method: "post",
    data: params,
    responseType: "blob",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}
