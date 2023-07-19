import request from "@/libs/request";

/**
 * 分页查询VAT结算数据列表
 */
export const getVatList = (data) => {
  return request({
    url: "/workorder/management/vat/billing/list",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * 商标结算数据列表导出
 */
export const exportExcel = (data) => {
  return request({
    url: "/workorder/management/vat/billing/download",
    data,
    method: "post",
    responseType: "blob",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
