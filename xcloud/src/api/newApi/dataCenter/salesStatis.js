import request from "@/libs/request";

/**
 * 销售统计-列表
 */
 export const salePage = params => {
  return request({
    url: "/orderproduct/management/orderView/salePage",
    params,
    method: "get"
  });
};

/**
 * 销售统计-汇总
 */
 export const saleTotalStatistic = params => {
  return request({
    url: "/orderproduct/management/orderView/saleTotalStatistic",
    params,
    method: "get"
  });
};

/**
 * 销售统计-导出
 */
 export const saleExport = params => {
  return request({
    url: "/orderproduct/management/orderView/saleExport",
    params,
    method: "get",
    responseType: 'blob'
  });
};