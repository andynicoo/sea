import request from "@/libs/request";

/**
 * 分页获取服务分类列表
 */
export function getProductAttrlist(data) {
  return request({
    url: "/orderproduct/management/category/list",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

/**
 * 获取工单流程编码
 */
export function getFunctionCode(data) {
  return request({
    url: "/orderproduct/management/category/get/functionCode",
    method: "post",
    data
  });
}

/**
 * 添加或修改类目
 */
export function categoryAddOrUpdate(data) {
  return request({
    url: "/orderproduct/management/category/addOrUpdate",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

/**
 * 类目启用禁用
 */
export function updateCategoryStatus(data) {
  return request({
    url: "/orderproduct/management/category/updateCategoryStatus",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}

/**
 * 删除服务分类
 */
export function delCategoryStatus(data) {
  return request({
    url: "/orderproduct/management/category/remove",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}

/**
 * 获取所有商品属性列表
 */
export function productAttribute(params) {
  return request({
    url: "/orderproduct/management/productAttribute/list",
    method: "POST",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

/**
 * 添加或修改商品属性 父级
 */
export function addProductAttribute(params) {
  return request({
    url: "/orderproduct/management/productAttribute/category/add",
    method: "POST",
    data: params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

/**
 * 启用或禁用商品属性
 * @param id
 */
export function updateAttrStatus(params) {
  return request({
    url: "/orderproduct/management/productAttribute/category/update/status",
    method: "POST",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}

/**
 * 添加或者修改商品属性值  子级
 * @param {}
 */
export function addOrupdate(params) {
  return request({
    url: "/orderproduct/management/productAttribute/addOrupdate",
    method: "POST",
    data: params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

/**
 * 启用或禁用商品属性值
 * @param id
 */
export function updateStatus(params) {
  return request({
    url: "/orderproduct/management/productAttribute/updateCategoryStatus",
    method: "POST",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}

/**
 * 删除服务属性
 */
export function delProductAttr(data) {
  return request({
    url: "/orderproduct/management/productAttribute/delProductAttributeCategoryById",
    method: "POST",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}

/**
 * 删除商品分类
 */
export function delProductCate(data) {
  return request({
    url: "/orderproduct/management/productAttribute/delProductCategoryById",
    method: "POST",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}
