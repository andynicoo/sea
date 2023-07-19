let trademark = {
  // 分页类似商标列表
  trademarkPage: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/full/trademarks",
    methods: "post",
  },

  // 商标查询，结果建议[]
  trademarkAdvise: {
    url: "/api/xcloudtrademarkclient/search",
    methods: "post",
  },

  // 商标类别
  trademarkCate: {
    url: "/api/xcloudtrademarkclient/client/rm/trademarkProduct/getOneTrademarkCategoryList",
    methods: "get",
  },

  // 商标注册概率计算
  getProbability: {
    url: "/api/xcloudtrademarkclient/probability",
    methods: "post",
  },

  // 深度查询
  getProbabilityDepth: {
    url: "/api/xcloudtrademarkclient/probabilityAgain",
    methods: "post",
  },

  // 深度查询轮询结果
  getProbabilityDepthResult: {
    url: "/api/xcloudtrademarkclient/probabilityTaskResult",
    methods: "post",
  },

  // 人工核名提交资料
  sendManualData: {
    url: "/api/custuser/data-customer-lead/updateCustomerLead",
    methods: "post",
  },

  // 商标大类列表
  categoryOneList: {
    url: "/api/workorder/client/trademark/category/one/list",
    methods: "post",
  },

  // 商标小类列表
  categoryTwoList: {
    url: "/api/workorder/client/trademark/category/two/pageList",
    methods: "post",
  },

  //商标详情查询
  getTrademarkInfo: {
    url: "/api/xcloudtrademarkclient/trademarkInfo",
    methods: "post",
  },

  //监测商标
  monitTrademark: {
    url: "/api/xcloudtrademarkclient/monit/monitTrademark",
    methods: "post",
  },

  //商标取名 弹窗提交
  getAiName: {
    url: "/api/xcloudtrademarkclient/ai/name",
    methods: "post",
  },

  // 商标取名换一批
  getChangeName: {
    url: "/api/xcloudtrademarkclient/ai/nameChange",
    methods: "get",
  },
  //商标敏感词增强提醒
  searchSensitiveWords: {
    url: "/api/xcloudtrademarkclient/searchSensitiveWords",
    methods: "post",
  },
  // 商标名称收藏
  handleCollect: {
    url: "/api/xcloudtrademarkclient/trademarkRecord/favourite/name",
    methods: "post"
  },

  // 商标名称取消收藏
  handleCollectRemove: {
    url: "/api/xcloudtrademarkclient/trademarkRecord/favourite/cacel",
    methods: "post"
  },

  // 近似商标列表
  getBrandListLikes: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/full/trademarks",
    methods: "post"
  },
  // 搜索商标结果建议
  getProbability: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/probability",
    methods: "post"
  },
  // 商标全文检索高级条件 
  getAdvanceConditions: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/conditions",
    methods: "post"
  },
  //商标小类英文翻译文本
  getTranslationText: {
    url: "/api/workorder/client/trademark/category/category/translation/text",
    methods: "post"
  },
  //商标查询其他国家注册状态
  getTrademarksCountryStatus: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/other/trademarks",
    methods: "post"
  },
  //新商标详情查询
  getTrademarkDetail: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/info",
    methods: "post"
  },
  // 商标风险评估报告
  getRiskReport: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/assessment/report",
    methods: "post"
  },
  // 商标风险评估报告统计
  getReportStatistics: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/assessment/report/statistics",
    methods: "post"
  },
  // 商标全文检索注册统计
  getTargetRisk: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/trademarks/statistics",
    methods: "post"
  },
  // 精准商标检索
  getTargetList: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/match/trademarks",
    methods: "post"
  },
  //查询律师代理商标 
  getLawyerStatics: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/attorneys/statistics",
    methods: "post"
  },
  // TOP律师排行
  getAttorneyRank: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/attorney/ranking",
    methods: "post",
  },
  // 不建议词库/行业分类
  getRecommended: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/famous/brands/lexicon",
    methods: "post"
  },
  // 申请人持有商标查询
  getAnalysis: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/applicant/trademark/analysis",
    methods: "post"
  },
  // 校验律师或申请人是否存在接口
  checkTrademarksName: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/valid/trademarks",
    methods: "post"
  },
  // 获取商标一级状态接口
  getTrademarkStatusLevelOne: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/status/one/list",
    methods: "GET"
  },
  // 获取商标一级状态接口
  getTrademarkStatusLevelTwo: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/status/two/list",
    methods: "GET"
  },
  // 模糊匹配申请人
  getOwnerList: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/base/owner/list",
    methods: "POST"
  },
  // 模糊匹配律师
  getAttorneyList: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/base/lawyer/list",
    methods: "post",
  },
};

export default trademark;
