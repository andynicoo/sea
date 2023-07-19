import request from "@/libs/request";

/**
 * VAT注册异常工单服务列表
 */
 export const serviceOrderRegisterWarnList = data => {
  return request({
    url: "/workorder/management/serviceOrderRegisterWarn/list",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * VAT注册异常工单导出
 */
 export const excelList = data => {
  return request({
    url: "/workorder/management/serviceOrderRegisterWarn/list/excelList",
    data,
    method: "post",
    responseType: 'blob',
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};