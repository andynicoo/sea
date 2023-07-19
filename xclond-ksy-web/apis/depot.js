import config from "../static/config";
let depot = {
  // 获取TOP律师排行
  getLawyerRanking: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/attorney/ranking",
    methods: "post",
  },
  // 获取分类
  getCate: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/not/recommended/lexicon",
    methods: "post",
  },
  // 获取不建议注册词库
  getWordBrand: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/famous/brands/lexicon",
    methods: "post",
  },
  // 注册商标库（美标申请概况，美标申请分布）
  getRegisgerDepot: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/general/situation",
    methods: "post",
  },
  // 注册商标库（审查律师分配分析）
  getDistribution: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/attorney/allot/analysis",
    methods: "post",
  },
  // 注册商标库（美标申请趋势）
  getTrend: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/general/situation/trend",
    methods: "post",
  },
  // 注册商标库（美标申请时效）
  getApplicationTime: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/apply/prescription",
    methods: "post",
  },
  // 注册商标库（根据大类查商标/换一换）
  getSearchTrademark: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/exchange",
    methods: "post",
  },
  // 注册商标库（申请人持有商标数量TOP 500）
  getTopTrademark: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/top/apply/possessor",
    methods: "post",
  },
  // 注册商标库（律师代理商标数量TOP 500）
  getTopLawyer: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/top/attorney",
    methods: "post",
  },
  // 注册商标库（TOP 500 小类）
  getTopSmallCategory: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/top/category",
    methods: "post",
  },
  // 国家列表（仅中文）
  getCountryList: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/get/country",
    methods: "get",
  },
  // 申请时效走势
  getApplyPrescriptionTrendList: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/apply/prescription/trend",
    methods: "post",
  },
  // 律师列表
  getAttorneyList: {
    url: "/api/xcloudtrademarkclient/trademark/search/utils/base/lawyer/list",
    methods: "post",
  },
};

export default depot;
