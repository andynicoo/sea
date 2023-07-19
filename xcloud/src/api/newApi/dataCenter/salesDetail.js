import request from "@/libs/request";
import qs from 'qs'

/**
 * 销售明细列表
 */
 export const saleDetailPage = params => {
  return request({
    url: "/orderproduct/management/orderView/saleDetailPage",
    params,
    method: "get",
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  });
};

/**
 * 销售明细汇总
 */
 export const saleDetailTotal = params => {
  return request({
    url: "/orderproduct/management/orderView/saleDetailTotal",
    params,
    method: "get",
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  });
};

/**
 * 销售明细-导出
 */
 export const saleDetailExport = params => {
  return request({
    url: "/orderproduct/management/orderView/saleDetailExport",
    params,
    method: "get",
    responseType: 'blob'
  });
};

/**
 * 销售明细-导出
 */
 export const saleFinanceExport = params => {
  return request({
    url: "/orderproduct/management/orderView/financeDetailExport",
    params,
    method: "get",
    responseType: 'blob'
  });
};