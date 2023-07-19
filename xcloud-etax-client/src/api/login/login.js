import request from "@/utils/request";

const src = "plat/";
/**
 * 获取验证码
 */
export const getYzm = (obj) => {
  const data = obj;
  return request({
    url: src + "user/get/smscode",
    data,
    method: "post",
  });
};
/**
 * 注册
 */
export const register = (obj) => {
  const data = obj;
  return request({
    url: src + "user/register",
    data,
    method: "post",
  });
};
// 手机验证码注册
export const inviteRegister = (obj) => {
  const data = obj;
  return request({
    url: "/custuser/client/register/register",
    data,
    method: "post",
  });
};
/**
 *用户平台 账号密码登录
 */
export const loginPass = (obj) => {
  const data = obj;
  return request({
    url: src + "user/login/password",
    data,
    method: "post",
  });
};
/**
 * 用户平台验证码登录
 */
export const loginYzm = (obj) => {
  const data = obj;
  return request({
    // url: src + "user/login/smscode",
    url: "custuser/client/login/mobile/code",
    data,
    method: "post",
  });
};
/**
 * vat客户端登录
 */
export const loginClient = (obj) => {
  const data = obj;
  return request({
    url: "/work_client/user/sign_in",
    data,
    method: "post",
  });
};
/**
 * 找回密码
 */
export const getPass = (data) => {
  return request({
    url: "/custuser/client/register/reset/password",
    data,
    method: "post",
  });
};
/**
 * 获取用户信息
 */
export const getInfo = () => {
  return request({
    url: "/work_client/user/info",
    method: "post",
  });
};
/**
 * 修改密码
 */
export const changePass = (data) => {
  return request({
    url: "/custuser/client/user/update/password",
    data,
    method: "post",
  });
};
/**
 * 验证旧手机
 */
export const changeNext = (data) => {
  return request({
    url: src + "user/verify/OldMobile",
    data,
    method: "post",
  });
};
/**
 * 更换绑定手机
 */
export const changePhone = (data) => {
  return request({
    url: src + "user/update/mobile",
    data,
    method: "post",
  });
};
/**
 * sellerOS登录回调
 */
export const callbackSellerOS = (data) => {
  return request({
    url: "plat/user/third/sellerOS/callback",
    data,
    method: "post",
  });
};
/**
 * 第三方账号绑定用户中心账号
 * sellerOS
 */
export const bindSellerOS = (data) => {
  return request({
    url: "plat/user/third/bind",
    data,
    method: "post",
  });
};
/**
 * 第三方账号登录token获取
 * sellerOS
 */
export const getSellerToken = (data) => {
  return request({
    url: "plat/user/third/login",
    data,
    method: "post",
  });
};

/**
 * 生成图片验证码
 */
export const getImgCodeApi = () => {
  return request({
    url: "/plat/user/image/code",
    method: "post",
  });
};

/**
 * 更换手机
 */
export const newChangePhone = (data) => {
  return request({
    url: "/etax/user/update/mobile",
    data,
    method: "post",
  });
};

/**
 * 公众号二维码
 */
export const getQRcode = () => {
  return request({
    // url: "/plat/wx/gzh/create/qrcode",
    url: "/custuser/wx/gzh/create/qrcode",
    method: "post",
  });
};

/**
 * 公众号登录
 */
export const estimateLogin = (data) => {
  return request({
    // url: "/plat/wx/gzh/get/qrcode",
    url: "/custuser/wx/gzh/get/qrcode",
    data,
    method: "post",
  });
};

/**
 * 注册并绑定用户中心账号
 */
export const bindTel = (data) => {
  return request({
    // url: "/etax/wx/gzh/regbind",
    url: "/custuser/wx/gzh/qrcode/regbind",
    data,
    method: "post",
  });
};

/**
 * 手机密码登录(滑动验证码)
 */
export const slidingPWLogin = (data) => {
  return request({
    url: "/custuser/client/login/mobile/password",
    data,
    method: "post",
  });
};

/**
 * 手机密码登录(滑动验证码)
 */
export const slidingSMSLogin = (data) => {
  return request({
    url: "/custuser/client/sms/send/smscode",
    data,
    method: "post",
  });
};
/**
 * 退出登录
 */
 export const logout = () => {
  return request({
    url: "/custuser/client/user/logout",
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/**
 * 注销账号
 */
 export const destroyAccount = () => {
  return request({
    url: "/custuser/client/user/destory/account",
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};