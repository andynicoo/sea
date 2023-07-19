let login = {
  // 获取验证码
  slidingSMSLogin: {
    url: "/api/custuser/client/sms/send/smscode",
    methods: "post",
  },
  // 用户平台验证码登录
  loginYzm: {
    url: "/api/custuser/client/login/mobile/code",
    methods: "post",
  },
  // 手机密码登录
  slidingPWLogin: {
    url: "/api/custuser/client/login/mobile/password",
    methods: "post",
  },
  // 找回密码
  getPass: {
    url: "/api/custuser/client/register/reset/password",
    methods: "post",
  },
  // 注册接口
  inviteRegister: {
    url: "/api/custuser/client/register/register",
    methods: "post",
  },
  // 获取小程序登录码
  getQRcode: {
    url: "/api/custuser/client/login/getQRCode",
    methods: "get",
  },
  // 获取小程序登录状态
  getQRStatus: {
    url: `/api/custuser/client/login/getQRStatus/`,
    methods: "get",
  },
};

export default login;
