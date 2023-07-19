import request from "@/libs/request";

/**
 * 交付数据列表
 */
 export const serviceDeliveryDataList = data => {
  return request({
    url: "/workorder/management/serviceDeliveryData/list",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 交付数据导出
 */
 export const excelList = data => {
  return request({
    url: "/workorder/management/serviceDeliveryData/list/excelList",
    data,
    method: "post",
    responseType: 'blob',
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};