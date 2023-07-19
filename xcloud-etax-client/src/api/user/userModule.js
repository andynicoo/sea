import request from "@/utils/request";

const src = "";
/**
 * 修改个人资料
 */
export const updateInfo = (params) => {
  return request({
    // url: 'work_client/user/edit',
    // url: "/etax/user/current/update/userinfo",
    url: "/custuser/client/user/update/info",
    params,
    method: "POST",
  });
};
/**
 * 查看个人信息
 *
 */
export const getInfo1 = () => {
  return request({
    url: "/custuser/client/user/info",
    method: "post",
  });
};

/**
 * 查询会员卡信息
 * @param {string} id 会员id
 * @returns 
 */
export const getMembershipCardById = (id)=> {
  const params = { id }
  return request({
    url: "/custuser/client/membershipCard/getMembershipCardById",
    method: "get",
    params
  });
}
/**
 * 初始化个人信息
 *
 */
export const personalCenterIndex = () => {
  return request({
    // url: "/etax/user/current/personalCenterIndex",
    url: "/custuser/client/user/info",
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

/**
 * 初始化个人信息
 *
 */
export const inviteUser = (data) => {
  return request({
    url: "/etax/user/invite/userlogs",
    data,
    method: "post",
  });
};

/**
 * pc端邀请链接访问数量统计
 *
 */
export const visitStatic = (data) => {
  return request({
    url: "/custuser/client/invate/browse/count",
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

/**
 * 授权列表
 */
 export const authorizeList = (params) => {
  return request({
    url: "/pay/authorize/authorizeList",
    params,
    method: "POST",
  });
};