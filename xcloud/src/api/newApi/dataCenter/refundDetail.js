import request from "@/libs/request";
import qs from 'qs'

/**
 * 退款明细列表
 */
 export const refundDetailPage = params => {
  return request({
    url: "/orderproduct/management/orderView/refundDetailPage",
    params,
    method: "get",
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  });
};

/**
 * 退款明细汇总
 */
 export const refundDetailTotal = params => {
  return request({
    url: "/orderproduct/management/orderView/refundDetailTotal",
    params,
    method: "get",
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  });
};


/**
 * 退款明细-导出
 */
 export const refundDetailExport = params => {
  return request({
    url: "/orderproduct/management/orderView/refundDetailExport",
    params,
    method: "get",
    responseType: 'blob'
  });
};