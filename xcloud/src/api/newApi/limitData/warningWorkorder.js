import request from "@/libs/request";

/**
 * 预警工单服务列表
 */
 export const serviceOrderWarnList = data => {
  return request({
    url: "/workorder/management/serviceOrderWarn/list",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 预警工单导出
 */
 export const excelList = data => {
  return request({
    url: "/workorder/management/serviceOrderWarn/list/excelList",
    data,
    method: "post",
    responseType: 'blob',
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};