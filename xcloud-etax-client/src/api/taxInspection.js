import request from "@/utils/request";

/**
 * 服务工单详情
 */
export function getDetail(params) {
  return request({
    url: "/workorder/client/taxCheckWorkOrder/serviceDetail",
    method: "get",
    params
  });
}

/**
 * 税务稽查工单提交资料
 */
 export function submitInfo(data) {
  return request({
    url: "/workorder/client/taxCheckWorkOrder/submitInfo",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

/**
 * 获取公司和客户vat税号
 */
 export function taxCustUserVatNumber(params) {
  return request({
    url: "/workorder/client/commonInterface/list",
    method: "get",
    params
  });
}

