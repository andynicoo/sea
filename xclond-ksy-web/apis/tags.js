

let tags = {
  // 获取标签列表
  getTagsList: {
    url: "/api/information/label/client/getPageByCharacter",
    methods: "post",
  },
  // 获取标签相关推荐列表
  getTagsRelateList: {
    url: "/api/information/label/client/details/label",
    methods: "post",
  },
  // 获取标签详情
  getTagsDetails: {
    url: "/api/information/label/client/details",
    methods: "get",
  },
  // 获取标签相关内容精选
  getTagsContent: {
    url: "/api/information/label/client/details/concentration",
    methods: "post",
  },
  // 获取标签相关案列
  getTagsClass: {
    url: "/api/information/label/client/details/relatedCases",
    methods: "post",
  },
  // 获取标签相关文章
  getTagsArticle: {
    url: "/api/information/label/client/details/article",
    methods: "post",
  },
   // 获取标签产品
   getTagsProduct: {
    url: "/api/information/label/client/details/product",
    methods: "post",
  },
};

export default tags;
