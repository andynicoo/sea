import request from '@/libs/request'

// eslint-disable-next-line no-unused-vars
const src = ''
/**
 * 修改个人资料
 */
export const updateInfo = params => {
  return request({
    url: '/trademark/currentuser/update/userinfo',
    params,
    method: 'get'
  })
}
/**
 * 查看个人信息
 *
 */
export const getInfo1 = params => {
  return request({
    // url: "/trademark/currentuser/userinfo",
    url: '/custuser/client/user/info',
    method: 'POST',
    params
  })
}

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
    url: '/trademark/currentuser/personalCenterIndex',
    method: 'GET'
  })
}

/**
 * pc端邀请链接访问数量统计
 *
 */
export const visitStatic = data => {
  return request({
    // url: "/trademark/user/pc/browse/count",
    url: '/custuser/client/invate/browse/count',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
