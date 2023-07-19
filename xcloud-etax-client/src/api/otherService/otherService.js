import request from "@/utils/request";
/**
 * 极简工单条件分页查询
 */
export const getPageList = (data) => {
  return request({
    url: "/workorder/client/simpleWorkOrder/page",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

/**
 * 极简工单详情
 */
export const getSimpleWorkOrderDetail = (data) => {
  return request({
    url: "/workorder/client/simpleWorkOrder/detail/" + data,
    method: "get",
  });
};

/**
 * 极简工单上传客户资料
 */
export const simpleWorkOrderSubmit = (data) => {
  return request({
    url: "/workorder/client/simpleWorkOrder/material",
    data: data,
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * 极简工单状态修改
 */
export const simpleWorkOrderStatus = (data) => {
  return request({
    url: "/workorder/client/simpleWorkOrder/status",
    method: "put",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * 极简工单下载资料
 * id 工单ID
 * materialType 资料类型(1:资料清单 2:客户资料 3:回执)
 */
export const simpleWorkOrderDown = (params) => {
  return request({
    url: "/workorder/client/simpleWorkOrder/material/down",
    method: "get",
    responseType: "blob",
    params,
  });
};