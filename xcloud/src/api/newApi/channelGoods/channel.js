import request from "@/libs/request";

/**
 * 获取渠道用户列表
 */
 export const getList = data => {
    return request({
      url: "/productcenter/management/productChannel/getChannelCustomerList",
      data,
      method: "post",
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

  /**
 * 新增渠道商品
 */
 export const addEditorUser = data => {
    return request({
      url: "/productcenter/management/productChannel/updateProductChannel",
      data,
      method: "post",
      headers: {
        "Content-Type": "application/json" 
      }
    });
  };

  /**
 * 获取用户的商品
 */
 export const getuserGoods = id => {
  return request({
      url: '/productcenter/management/productChannel/getById?userId='+ id,
      method: 'get'
  })
}

/**
 * 获取所有的服务分类
 */
 export function categoryList(data) {
  return request({
    url: '/productcenter/productCategory/getPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取服务商品表
 * @param obj
 */
 export function getproductInfoList(data) {
  return request({
    url: "/productcenter/productInfo/channel/product/list",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}