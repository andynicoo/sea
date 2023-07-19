const indexApi = {
  // 产品集合
  productList: {
    url: "/api/information/client/serviceRecommend/getRecommendProductList",
    methods: "GET",
  },

  // 优惠券活动列表
  activityList: {
    url: "/api/marketingcenter/coupon/activity/list",
    methods: "post",
  },

  // 活动列表 type=7 限时秒杀
  officialWebsiteList: {
    url: "/api/marketingcenter/marketingActivity/officialWebsite/list",
    methods: "post",
  },
};

export default indexApi;
