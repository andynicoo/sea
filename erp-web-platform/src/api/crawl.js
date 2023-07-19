import { post, get } from '@/util/request'

const Basic = {
  getCrawlPFList: (p) => get('/crawl/product/crawl/pf-list', p), // 平台采集列表(站点列表)

  getCrawlPFQuery: (p) => post('/crawl/product/crawl/pf-query-ms', p), //平台采集

  addCrawlPFProduct: (p) => post('/crawl/product/crawl/pf-add', p), // 平台采集放入采集箱

  addCrawlWithLink: (p) => post('/crawl/product/crawl/with-link', p), // 根据Url采集

  handCrawlRetry: (p) => post('/crawl/product/crawl/retry', p), //采集重试

  addCrawlWithShopLink: (p) => post('/crawl/product/crawl/with-shop-link', p), // 店铺链接采集

  getCrawlCofig: (p) => post('/crawl/product/crawl/member/get-crawl-config', p), //获取当前用户采集配置

  updateCrawlCofig: (p) =>
    post('/crawl/product/crawl/member/update-crawl-config', p), //更改当前用户采集配置

  crawlTodayCount: (p) => post('/crawl/product/crawl/crawlTodayCount', p), //今天采集数量

  updateCrawlTemplate: (p) =>
    post('/crawl/product/crawl/member/update-crawl-template', p), //更改当前用户采集模板(新增&&修改)

  deleCrawlTemplate: (p) =>
    post('/crawl/product/crawl/member/dele-crawl-template', p), //删除当前用户采集模板
  getCrawlTemplate: (p) =>
    post('/crawl/product/crawl/member/get-crawl-template', p), //模板id获取当前采集模板
  listCrawlTemplate: (p) =>
    post('/crawl/product/crawl/member/list-crawl-template', p), //获取当前用户采集模板列表
  updateCrawlTemplateName: (p) =>
    post('/crawl/product/crawl/member/batch-update-crawl-template-name', p), //更改当前用户采集模板名

  addClaimTemplate: (p) => post('/product-claim-template/add', p), //产品认领配置新增
  editClaimTemplate: (p) => post('/product-claim-template/edit', p), //产品认领配置编辑
  deleClaimTemplate: (p) => post('/product-claim-template/delete/' + p), //产品认领配置删除
  getClaimTemplateList: () => get('/product-claim-template/list'), //产品认领配置列表
  getClaimTemplate: (p) => get('/product-claim-template/get/' + p), //产品认领配置查询
  editClaimTemplateName: (p) => post('/product-claim-template/batch/edit', p), //产品认领配置批量编辑
  getLastPluginVersion: () =>
    post('/crawl/product/crawl/member/query-last-version'), //获取最新插件

  getCountSuccessCrawlToday: () =>
    post('/crawl/product/crawl/countSuccessCrawlToday'), //获取用户当天采集数量

  getPlugInCrawlUseConfig: () =>
    post('/crawl/product/crawl/getPlugInCrawlUseConfig') //获取使用接口或者插件采集配置信息
}
export default Basic
