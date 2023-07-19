import request from "@/libs/request";
// 英国VAT 退税接口
/**
 * 查询税号国家列表
 */
export const getCountryList = params => {
  return request({
    url: "/etax/workorder/management/register/list/baseinfo",
    params,
    method: "get"
  });
};
/**
 * 查询退税单分页列表
 */
export const getRefundList = data => {
  return request({
    url: "/etax/taxRefund/list",
    data,
    method: "post"
  });
};
/**
 * 根据vat税号查询信息
 */
export const taxNumInfo = params => {
  return request({
    url: "/etax/taxRefund/taxNumInfo",
    params,
    method: "get"
  });
};
/**
 * 查询退税单详情
 */
export const refundDetail = data => {
  return request({
    url: "/etax/services/management/detail",
    data,
    method: "post"
  });
};
/**
 * 提交退税资料
 */
export const refundSubmit = data => {
  return request({
    url: "/etax/taxRefund/submit",
    data,
    method: "post"
  });
};
/**
 * 资料审核通过和不通过
 */
export const auditRefund = data => {
  return request({
    url: "/etax/taxRefund/audit",
    data,
    method: "post"
  });
};
/**
 * 退税资料驳回，和审核资料公用一个接口，status=2代表是资料驳回的
 */
export const rejectRefund = data => {
  return request({
    url: "/etax/taxRefund/audit",
    data,
    method: "post"
  });
};
/**
 * 查看驳回资料详情
 */
export const rejectDetail = data => {
  return request({
    url: "/etax/refuse/list",
    data,
    method: "post"
  });
};
/**
 * 税务经理认领
 * @param {*} data
 * @returns
 */
export const taxManagerRevice = data => {
  return request({
    url: "/etax/services/management/orderServiceClaimTaxManager",
    data,
    method: "post"
  });
};

/**
 * 税务经理批量更改
 * @param {*} data
 * @returns
 */
export const taxManagerUpdate = data => {
  return request({
    url: "etax/services/management/batchUpdateServicesTaxManager",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 添加备注
 */
export const addRemark = data => {
  return request({
    url: "/etax/remark/save",
    data,
    method: "post"
  });
};
/**
 * 查看备注列表
 */
export const getRemarkList = data => {
  return request({
    url: "/etax/remark/list",
    data,
    method: "post"
  });
};
/**
 * 删除备注
 */
export const deleteRemark = data => {
  return request({
    url: "/etax/remark/save",
    data,
    method: "post"
  });
};
