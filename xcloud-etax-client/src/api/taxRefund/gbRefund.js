import request from "@/utils/request";
// 英国退税api接口
/**
 * 根据vat税号查询信息
 */
export const taxNumInfo = (params) => {
  return request({
    url: "/etax/vat/taxRefund/client/taxNumInfo",
    params,
    method: "get",
  });
};
/**
 * 提交退税资料
 */
export const refundSubmit = (data) => {
  return request({
    url: "/etax/vat/taxRefund/client/submit",
    data,
    method: "post",
  });
};
/**
 * 完成退税
 */
 export const finishRefund = (data) => {
  return request({
    // url: "/etax/vat/taxRefund/client/finish",
    url:"/workorder/client/taxRefundWorkOrder/completeRefund",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json"
    }
  });
};
/**
 * 提交退税资料
 */
export const refundDetail = (data) => {
  return request({
    url: "/etax/vat/taxRefund/client/detail",
    data,
    method: "post",
  });
};
