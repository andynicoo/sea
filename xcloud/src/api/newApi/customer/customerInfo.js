import request from "@/libs/request";

/**
 * 客户管理-列表
 * @param {*} params  type 类型 0查询客户信息 1查询我的跟进客户信息
 * @returns
 */
export function getList(params) {
  let headers = {}
  if (params.needsMenuid) {
    let menuid = localStorage.getItem("userInfoMenuid");
    headers = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "menuid": menuid
    }
  } else {
    headers = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    };
  }
  return request({
    url: "/custuser/management/user/list",
    method: "post",
    data: params,
    headers
  });
}
/**
 * 客户管理-详情基本信息
 * @param {*} params    userId 用户id / enterpriseId企业id
 * @returns
 */
export function getUserInfo(params) {
  return request({
    url: "/custuser/management/user/info",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}
/**
 * 客户管理-添加跟进记录
 * @param {*} params
 * @returns
 */
export function addRecord(params) {
  return request({
    url: "/custuser/managament/followrecord/addfollowrecord",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}
/**
 * 客户管理-修改基本信息
 * @param {*} params
 * @returns
 */
export function updateInfo(params) {
  return request({
    url: "/custuser/management/user/update",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}
/**
 * 客户管理-跟进人/邀请人下拉列表
 * @param {*} params
 * @returns
 */
export function userList(params) {
  return request({
    url: "/base/user/all",
    method: "GET",
    data: params
  });
}

/**
 * 客户管理-修改跟进人
 * @param {*} params enterpriseId企业Id   followUserId跟进人id  followUserName名称   userId
 * @returns
 */
export function addFollowUser(params) {
  return request({
    url: "/custuser/management/user/addOrUpdateFollowUser",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}
/**
 * 客户管理-批量修改跟进人
 * @param {*} params newUserId   userId
 * @returns
 */
export function batchEditFollowUser(params) {
  return request({
    url: "/custuser/management/user/batchAddOrUpdateFollowUser",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

/**
 * 客户管理-修改邀请人
 * @param {*} params enterpriseId企业Id   inviteUserId跟进人id  inviteUserName名称   userId
 * @returns
 */
export function addInviteUser(params) {
  return request({
    url: "/custuser/management/user/addOrUpdateInviteUser",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}
/**
 * 客户管理-跟进记录
 * @param {*} params
 * @returns
 */
export function getRecordList(params) {
  return request({
    url: "/custuser/managament/followrecord/list",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
}

/**
 * 客户信息列表（新）
 * @param {*} data
 * @returns
 */
export function getCustomerList(data) {
  return request({
    url: "/custuser/management/user/query/userStatistics",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

/**
 * 客户管理-开户
 * @param {*} params
 * @returns
 */
 export function addUserAccount(params) {
  return request({
    url: "/custuser/management/userTransferAccount/add",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
}


/**
 * 客户管理-开户-更新
 * @param {*} params
 * @returns
 */
 export function updateUserAccount(params) {
  return request({
    url: "/custuser/management/userTransferAccount/update",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

/**
 * 客户管理-开户-获取
 * @param {*} params
 * @returns
 */
 export function getUserAccount(params) {
  return request({
    url: "/custuser/management/userTransferAccount/info",
    method: "post",
    params,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
/**
 * 客户信息 详情-基本信息 积分查询
 * @param {*} data
 * @returns
 */
 export function getUserInegralAccount(data) {
  return request({
    url: "/custuser/user-integral/getUserInegralAccount",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}


/**
 * 客户信息 详情-基本信息 积分修改
 * @param {*} data
 * @returns
 */
 export function optAdminUserIntegral(data) {
  return request({
    url: "/custuser/user-integral/optAdminUserIntegral",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}
