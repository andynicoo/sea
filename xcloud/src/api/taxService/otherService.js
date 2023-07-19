import request from "@/libs/request";

/**
 * 查询国家列表
 * @returns
 */
export const getCountyList = () => {
  return request({
    url: "/etax/otherWorkOrder/searchCountrys",
    method: "post"
  });
};

/**
 * 查询商品名称列表
 * @returns
 */
export const getProductList = () => {
  return request({
    url: "/etax/otherWorkOrder/searchProductNames",
    method: "post"
  });
};

/**
 * 查询工单列表
 * @param {*} data
 * @returns
 */
export const getOrderList = data => {
  return request({
    url: "/etax/otherWorkOrder/list",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 查询列表tab的统计数量
 * @param {*} data
 * @returns
 */
export const getTabStatis = data => {
  return request({
    url: "/etax/otherWorkOrder/statistics",
    data,
    method: "post"
  });
};

/**
 * 工单列表 Poptip 弹出用的订单详情接口
 * @param {*} data
 * @returns
 */
export const getPoptipOrderDetail = data => {
  return request({
    url: "/etax/otherWorkOrder/orderList",
    data,
    method: "post"
  });
};

/**
 * 工单列表操作点击详情的接口
 * @param {*} data
 * @returns
 */
export const getOrderDetail = data => {
  return request({
    url: "/etax/otherWorkOrder/detail",
    data,
    method: "post"
  });
};

/**
 * 税务经理批量认领
 * @param {*} data
 * @returns
 */
export const taxClaim = data => {
  return request({
    url: "/etax/otherWorkOrder/fRBatchClaim",
    data,
    method: "post"
  });
};

/**
 * 税务经理批量更改
 * @param {*} data
 * @returns
 */
export const taxUpdate = data => {
  return request({
    url: "/etax/otherWorkOrder/frBatchExchange",
    data,
    method: "post"
  });
};

/**
 * 供应链批量认领
 * @param {*} data
 * @returns
 */
export const supllyClaim = data => {
  return request({
    url: "/etax/otherWorkOrder/supplyChainBatchClain",
    data,
    method: "post"
  });
};

/**
 * 供应链批量更改
 * @param {*} data
 * @returns
 */
export const supllyUpdate = data => {
  return request({
    url: "/etax/otherWorkOrder/supplyChainBatchExchange",
    data,
    method: "post"
  });
};

/**
 * 添加进度
 * @param {*} data
 * @returns
 */
export const addProcess = data => {
  return request({
    url: "/etax/otherWorkOrder/addProgress",
    data,
    method: "post"
  });
};

/**
 * 工单列表操作详情-查看进度记录
 * @param {*} data
 * @returns
 */
export const getProcessRecord = data => {
  return request({
    url: "/etax/otherWorkOrder/progressList",
    data,
    method: "post"
  });
};

/**
 * 删除进度
 * @param {*} data
 * @returns
 */
export const deleteProcess = data => {
  return request({
    url: "/etax/otherWorkOrder/deleteProgress",
    data,
    method: "post"
  });
};

/**
 * 提交到服务商
 * @param {*} data
 * @returns
 */
export const submitServiceProvider = data => {
  return request({
    url: "/etax/otherWorkOrder/submitServiceProvider",
    data,
    method: "post"
  });
};

/**
 * 工单状态标记已完成
 * @param {*} data
 * @returns
 */
export const markComplete = data => {
  return request({
    url: "/etax/otherWorkOrder/markComplete",
    data,
    method: "post"
  });
};
/**
 * 根据角色查询对应的人员下拉列表
 * @param {*} data
 * @param roleCode 传参如下：
 * 税务经理  tax_manager
 * 税务专员  tax_commissioner
 * 税务主管  tax_supervisor
 * 供应链专员 supply_commissioner
 * 供应链主管 supply_supervisor
 * 超级管理员 admin
 * @returns
 */
export const getUserRoleList = data => {
  return request({
    url: "/etax/user/management/roleusers",
    params: data,
    method: "get"
  });
};

/**
 * 获得当前登录人的角儿
 * @param {*} data
 * @returns
 */
export const currentRole = data => {
  return request({
    url: "/etax/otherWorkOrder/getRole",
    data,
    method: "post"
  });
};

/**
 * 修改公司名称
 * @param {*} data
 * @returns
 */
export const changeCompanyName = data => {
  return request({
    url: "/etax/otherWorkOrder/changeCompanyName",
    data,
    method: "post"
  });
};
