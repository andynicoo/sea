let common = {
  // 头部导航
  newslist: {
    url: "/api/information/client/nav/getNav",
    methods: "get",
  },

  // 产品服务-优选服务 1：产品服务 2：优选服务
  getNavServiceData: {
    url: "/api/information/client/nav/getNavServiceData",
    methods: "get",
  },

  // 根据广告位获取广告
  getAdByAdPositionKey: {
    url: "/api/information/client/ad/getAdByAdPositionKey",
    methods: "get",
  },

  // 广告位
  adPosition: {
    url: "/api/information/ad_position/getById",
    methods: "get",
  },

  // 广告查询
  getAdList: {
    url: "/api/information/client/ad/getAd",
    methods: "get",
  },

  // 合作伙伴
  getPartnerList: {
    url: "/api/information/client/friend_link/getList",
    methods: "post",
  },

  // 一键算税拉取所有国家
  getAllCountry: {
    url: "/api/order/client/country/list?applySit=1",
    methods: "post",
  },

  // 一键算税，切换国家，获取报税周期信息等
  getCycle: {
    url: "/api/workorder/client/baseinfo/list/baseInfoByCondition",
    methods: "get",
  },

  // 分页获取商品列表
  getOrderProductList: {
    url: "/api/productcenter/client/productInfo/list",
    methods: "post",
  },

  // 官网导航权限列表
  getModuleList: {
    url: "/api/information/module_config/getModuleConfigList",
    methods: "get",
  },

  // 官网模块权限列表
  getModuleLists: {
    url: "/api/information/module_config/getModuleConfigLists",
    methods: "get",
  },

  // 查询网站信息
  getWebsitInfo: {
    url: "/api/custuser/enterprise/getEnterpriseInfo",
    methods: "get",
  },

  // 根据页面位置获取弹窗数据
  getMessage: {
    url: "/api/information/client/announcement/getPopUpByPagePosition",
    methods: "get",
  },

  // 获取用户信息
  getUserInfo: {
    url: "/api/custuser/client/user/info",
    methods: "Post",
  },

  // 发送反馈建议
  sendFeedBack: {
    url: "/api/custuser/client/user/feedback",
    methods: "Post",
  },

  // 获取员工企微二维码
  getEmployeeCode: {
    url: "/api/custuser/client/user/get/emp/qrCode",
    methods: "get",
  },

  // 获取购物车数量
  getCarNum: {
    url: "/api/order/client/cart/count",
    methods: "post",
  },

  // 跨企云首页留资
  setUserData: {
    url: "/api/custuser/data-customer-lead/createCustomerLead",
    methods: "post",
  },
};

export default common;
