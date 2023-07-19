import request from '@/libs/request';

/**
 * 用户平台验证码登录
 */
export const handleMobileCodeLogin = (obj) => {
  const data = obj;
  return request({
    url: '/custuser/client/login/mobile/code',
    data,
    method: 'post',
  });
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request({
    url: '/custuser/client/user/info',
    method: 'post',
  });
};

/**
 * 滑动获取验证码
 */
export const getSlidingSmscode = (data) => {
  return request({
    url: '/custuser/client/sms/send/smscode',
    data,
    method: 'post',
  });
};

/**
 * 退出登录
 */
export const logout = (data) => {
  return request({
    url: '/custuser/client/user/logout',
    data,
    method: 'post',
  });
};
