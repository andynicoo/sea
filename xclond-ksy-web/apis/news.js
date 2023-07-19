import config from "../static/config";
let news = {
  // 获取热点资讯列表
  getHotNews: {
    url: "/api/information/management/newsDocument/hotNews",
    methods: "get",
  },

  // 获取热门服务推荐列表
  getHotService: {
    url: "/api/information/client/nav/getHotService",
    methods: "get",
  },

  // 获取服务推荐列表
  getServiceList: {
    url: "/api/information/service/recommend/getServiceList",
    methods: "post",
  },

  // 查询所有的新闻分类
  allDocumentCategory: {
    url: `/api/information/feign/newsDocument/allDocumentCategory?enterprisecode=${
      config[process.env.NODE_PLA].enterprisecode
    }&enterpriseId=${config[process.env.NODE_PLA].enterpriseId}`,
    methods: "get",
  },

  // 资讯条件分页查询
  getNewsByCate: {
    url: `/api/information/feign/newsDocument/findByPage?enterprisecode=${
      config[process.env.NODE_PLA].enterprisecode
    }&enterpriseId=${config[process.env.NODE_PLA].enterpriseId}&newsType=INFORMATION`,
    methods: "get",
  },

  // 根据ID查询资讯详情
  getNewsById: {
    url: "/api/information/client/newsDocument/item",
    methods: "get",
  },

  // 根据ID查询资讯标签
  getLablesById: {
    url: "/api/information/client/newsDocument/recommendLabel",
    methods: "post",
  },

  // 根据ID查询最新资讯
  getLastNewsById: {
    url: "/api/information/client/newsDocument/recommendDocument",
    methods: "post",
  },
};

export default news;
