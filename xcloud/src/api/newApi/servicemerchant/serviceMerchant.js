import request from '@/libs/request';

/**
 * 商品服务表导出
 * @param obj
 * @param url
 */
export function exportServiceMerchantList(params) {
  return request({
    url: '/orderproduct/management/productInfo/export',
    method: 'post',
    responseType: 'blob',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// export const exportServiceMerchantList = (obj, url) => {
//   let formData = new FormData();
//   formData.append("productName", obj.productName);
//   formData.append("productType", obj.productType);
//   formData.append("serviceCategory", obj.serviceCategory);
//   formData.append("status", obj.status);
//   formData.append("countryCode", obj.countryCode);
//   formData.append("applySit", obj.applySit);
//   formData.append("strTime", obj.time[0]);
//   formData.append("endTime", obj.time[1]);
//   // 获取时间戳
//   let timestamp = new Date().getTime();
//   // 获取XMLHttpRequest
//   let xmlResquest = new XMLHttpRequest();
//   xmlResquest.open(
//     "post",
//     url + "/orderproduct/management/productOffer/export",
//     true
//   );
//   // 设置请求token
//   xmlResquest.setRequestHeader(
//     "Authorization",
//     request.defaults.headers["Authorization"]
//   );
//   xmlResquest.setRequestHeader(
//     "enterpriseCode",
//     request.defaults.headers["enterpriseCode"]
//   );
//   xmlResquest.responseType = "blob";
//   // 返回
//   xmlResquest.onload = function(oEvent) {
//     let content = xmlResquest.response;
//     // 组装a标签
//     let elink = document.createElement("a");
//     // 设置下载文件名
//     elink.download = timestamp + ".xlsx";
//     elink.style.display = "none";

//     let blob = new Blob([content]);
//     elink.href = URL.createObjectURL(blob);
//     document.body.appendChild(elink);
//     elink.click();
//     document.body.removeChild(elink);
//   };

//   xmlResquest.send(formData);
// };

/**
 * 商品上下架
 * @param id
 */
export const productUpstatus = (id) => {
  return request({
    url: '/orderproduct/management/productInfo/update/status/' + id,
    method: 'get',
  });
};

/**
 * 新增修改商品发布
 * @param obj
 */
export const addproductOffer = (obj) => {
  const data = obj;
  return request({
    url: '/orderproduct/management/productOffer/add',
    data,
    method: 'post',
  });
};

/**
 * 获取商品类目2-服务类型 1-服务分类
 * @param id
 */
export const getCategorylist = (id) => {
  const data = {
    categoryType: id,
  };
  return request({
    url: '/orderproduct/management/category/list',
    data,
    method: 'post',
  });
};

/**
 * 商品属性分类列表
 */
export const getattributeCategory = () => {
  return request({
    url: '/orderproduct/management/attributeCategory/list',
    method: 'get',
  });
};

/**
 * 商品属性项目列表
 * @param id
 * @param page
 * @param limit
 */
export const getproductAttributelist = (id, page, limit) => {
  const data = {
    attibuteTypeId: id,
    page: page,
    limit: limit,
  };
  return request({
    url: '/orderproduct/management/productAttribute/list',
    data,
    method: 'post',
  });
};

/**
 * 类目启用禁用
 * @param id
 */
export const updateCategoryStatus = (id) => {
  const params = {
    id: id,
  };
  return request({
    url: '/orderproduct/management/category/updateCategoryStatus',
    params,
    method: 'post',
  });
};

/**
 * 商品属性值启用禁用
 * @param id
 */
export const updateproductAttributeStatus = (id) => {
  const params = {
    id: id,
  };
  return request({
    url: '/orderproduct/management/productAttribute/updateCategoryStatus',
    params,
    method: 'post',
  });
};

/**
 * 类目删除
 * @param id
 */
export const removeCategoryStatus = (id) => {
  const params = {
    id: id,
  };
  return request({
    url: '/orderproduct/management/category/remove',
    params,
    method: 'post',
  });
};

/**
 * 商品属性值删除
 * @param id
 */
export const removeproductAttributeStatus = (id) => {
  const params = {
    id: id,
  };
  return request({
    url: '/orderproduct/management/productAttribute/remove',
    params,
    method: 'post',
  });
};

/**
 * 获取工单流程编码
 */
export const getCategoryOA = () => {
  return request({
    url: 'orderproduct/management/category/getCategory',
    method: 'post',
  });
};

/**
 * 新增商品类目
 * @param obj
 */
export const addOrUpdatecategory = (obj) => {
  const data = {
    id: obj.id,
    categoryName: obj.name,
    parentId: obj.parentId,
    status: obj.state,
    functionCode: obj.functionCode,
    isLeaf: obj.isLeaf,
  };
  return request({
    url: '/orderproduct/management/category/addOrUpdate',
    data,
    method: 'post',
  });
};

/**
 * 新增商品属性
 * @param obj
 */
export const addOrupdateproductAttribute = (obj) => {
  const data = {
    id: obj.id,
    attibuteTypeId: obj.parentId,
    attributeName: obj.name,
    attributeStatus: obj.state,
    attributeCode: obj.code,
  };
  return request({
    url: '/orderproduct/management/productAttribute/addOrupdate',
    data,
    method: 'post',
  });
};

/**
 * 获取所有的父子类目列表
 */
export const getallcategory = (data) => {
  return request({
    url: '/orderproduct/management/category/all/category',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取商品属性分类和属性值列表
 */
export const getcategoryAndValue = (params) => {
  return request({
    url: '/orderproduct/management/productAttribute/get/categoryAndValue',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 添加商品信息
 * @param obj
 */
export const addproductInfo = (obj) => {
  const data = obj;
  return request({
    url: '/orderproduct/management/productInfo/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取服务商品表
 * @param obj
 */
export function getproductInfoList(data) {
  return request({
    url: '/orderproduct/management/productInfo/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
//saas平台管理获取服务商品表
export function clientProductInfoList(data) {
  return request({
    url: '/productcenter/client/productInfo/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 获取服务商品表(新)
 * @param obj
 */
export function getProductList(data) {
  return request({
    url: '/productcenter/client/productInfo/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 获取服务商品分类(新)
 * @param obj
 */
export function getProductCategory(data) {
  return request({
    url: '/productcenter/productCategory/getPage',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取商品详情
 * @param productId
 */
export function getOne(productId) {
  return request({
    url: '/orderproduct/management/productInfo/getOne/' + productId,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**
 * 获取商品详情
 * @param productId
 */
export function relationProduct(params) {
  return request({
    url: '/orderproduct/management/productInfo/join/product/list',
    data: params,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 添加商品竞品价格
 * @param productId
 */
export function addProductInfoSkuCompetitionApi(params) {
  return request({
    url: '/orderproduct/management/productInfo/addProductInfoSkuCompetition',
    data: params,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 获取商品竞价信息
 * @param productId
 */
export function productInfoPriceListApi(params) {
  return request({
    url: '/orderproduct/management/productInfo/price/list',
    data: params,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

//新商品根据属性查询商品规格
export const getProductSpecsByAttribute = (data) => {
  return request({
    url: '/productcenter/client/productInfo/getProductSpecsByAttribute',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//新商品根据属性查询商品规格
export const getLastInvoice = (data) => {
  return request({
    url: '/order/management/invoice/lastInvoice',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//商机编号列表
export const getQywxOpportunity = (params) => {
  return request({
    url: '/data/qy/wx/getQywxOpportunity',
    params,
    method: 'get',
  });
};

//销售订单列表-编辑商机
export const editOpportunity = (data) => {
  return request({
    url: '/order/management/order/editOpportunity',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 未开通手机号权限账号在我的续费列表去续费时，手机号被加密无法续费 新增接口
export const getUserMobile = (params) => {
  return request({
    url: '/custuser/management/user/userMobile',
    params,
    method: 'get',
  });
};
