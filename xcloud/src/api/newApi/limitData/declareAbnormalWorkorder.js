import request from "@/libs/request";

/**
 * 申报异常工单服务列表
 */
 export const serviceOrderDeclareWarnList = data => {
  return request({
    url: "/workorder/management/serviceOrderDeclareWarn/list",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 申报异常工单导出
 */
 export const excelList = data => {
  return request({
    url: "/workorder/management/serviceOrderDeclareWarn/list/excelList",
    data,
    method: "post",
    responseType: 'blob',
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 申报异常工单批量发送短信提醒
 */
 export const smsBatch = data => {
  return request({
    url: "/workorder/management/serviceOrderDeclareWarn/send/smsBatch",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};