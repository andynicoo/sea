import request from "@/libs/request";

/**
 * 分页查询商标结算数据列表
 */
export const getCollectList = (data) => {
  return request({
    url: "/workorder/management/workorder/accounts/collect/page/list",
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
    url: "/workorder/management/workorder/accounts/collect/list/excel",
    data,
    method: "post",
    responseType: "blob",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
