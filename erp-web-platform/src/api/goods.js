import { get, post, del, http } from '@/util/request'
import { Message } from 'ant-design-vue'

const Goods = {
  getShopeeCategoryList: (p) => get('/goods/shopee/category/list', p), //获取虾皮类目列表

  getShopeeCategoryAttribute: (p) =>
    get('/goods/shopee/category/attribute/' + p), //获取虾皮类目属性

  handleSyncShopeeCategory: (p) => get('/goods/shopee/category/sync/' + p), //同步虾皮类目

  handleBatchPull: (p) => post('/goods/shopee/product/image/pull/batch', p), //图片一键拉伸

  handleSyncProduct: (p) => post('/goods/shopee/product/v2/syscProduct', p), //商品同步,更改为V2

  handleSyncProductById: (p) =>
    post('/goods/shopee/product/v2/syncProductById', p), //根据商品id同步，更改为V2

  getShopeeProductDetail: (id) => get('/goods/shopee/product/' + id), //获取虾皮商品详情

  updateShopeeProduct: (p) => post('/goods/shopee/product/edit', p), //虾皮数据编辑

  handlePublishToShopee: (p) => post('/goods/shopee/product/publish', p), //发布到虾皮

  handleBatchPublishToShopee: (p) =>
    post('/goods/shopee/product/publish/batch', p), //批量发布到虾皮(批量发布时返回200状态码，逻辑判断成功、失败、进度) 王权

  handleUpdateToShopee: (p) => post('/goods/shopee/product/renew', p), //更新商品信息

  handleClaimToShopee: (p) => post('/goods/shopee/product/claim', p), //认领到虾皮

  getProductList: (p) => get('/goods/shopee/product/v2/getPage', p), //商品列表，更改为V2

  deleteProductList: (p) => post('/goods/shopee/product/v2/deleteLocal', p), //删除商品列表,更改为V2

  deleteProductOnLine: (p) => post('/goods/shopee/product/v2/deleteOnline', p), //删除在线商品列表,V2

  sureProductTop: (p) => post('/goods/shopee/product/v2/topping', p), //置顶,更改为V2

  OnTheShelves: (p) => post('/goods/shopee/product/v2/unList', p), //上架下架,更改为V2

  sureProductIssue: (p) => post('/goods/shopee/product/publish', p), //发布

  saveAndPublish: (p) => post('/goods/shopee/product/editAndPublish', p), //保存并发布

  getDiscountPage: (p) => get('/goods/shopee/discount/page', p), //获取营销活动列表

  getDiscountParamList: (p) => get('/goods/shopee/discount/getList', p), //根据店铺营销活动列表

  getDiscountList: (p) => get('/goods/shopee/discount/list', p), //获取接下来及未过期的活动

  handleAddDisCount: (p) => post('/goods/shopee/discount/addDiscount', p), // 添加营销活动

  handleSyncDiscount: (p) => get('/goods/shopee/discount/sync', p), //营销活动同步

  getViableDiscountGoods: (p) => get('/goods/shopee/discount/goods/page', p), //获取可添加的商品列表

  updateDiscount: (p) => post('/goods/shopee/discount/updateDiscount', p), //编辑折扣活动

  handleDeleteDiscount: (p) => post('/goods/shopee/discount/deleteDiscount', p), // 删除活动

  disableDiscount: (p) => post('/goods/shopee/discount/endDiscount', p), //    结束活动

  getDiscountDetail: (p) => get('/goods/shopee/discount/getDiscountDetail', p), //获取折扣详情

  handleMoveStore: (p) => post('/goods/shopee/product/storeMove', p), //店铺搬家

  handleMoveStoreCnsc: (p) =>
    get('/goods/cnsc/goods/shopee/product/product/move', p), //cnsc店铺搬家

  handleGetCateShop: (p) => get('/goods/shopee/shop/category/getPage', p), //店铺分类列表

  handleEditCate: (p) => post('/goods/shopee/shop/category/edit', p), // 分类编辑

  handleSyncCate: (p) => get('/goods/shopee/shop/category/sync', p), //分类同步

  handleBatchAbleCate: (p) => post('/goods/shopee/shop/category/batch', p), //起停用商品分类

  handleAddCate: (p) => post('/goods/shopee/shop/category/add', p), //新增分类

  getCateDetail: (p) => get('/goods/shopee/shop/category/get', p), // 获取类目详情

  setTimedReleaseTime: (p) =>
    post('/goods/shopee/product/setTimedReleaseTime', p), //设置定时发布

  setPlaceTopTime: (p) => post('/goods/shopee/product/set/top/time', p), //设置定时置顶时间

  getGoodsBatchDetail: (p) => get('/goods/shopee/product/batch/' + p), //批量获取商品详情

  handleEditBatch: (p) => post('/goods/shopee/product/v2/edit/batch', p), //批量编辑操作,改成V2

  getSite: (p) => post('/tool-express-price/get-site-list', p), //获取站点;

  getSiteLogistics: (p) =>
    post('/tool-express-price/get-express-list-by-siteCode', p), //获取站点的物流；

  setPriceCalTool: (p) => post('/tool-express-price/cal-price-tool', p), //定价工具计算；

  deleteDisItem: (p) => post('/goods/shopee/discount/delete/discount/items', p), //删除活动商品

  getWatermarkTemplate: (p) =>
    post('/goods/shopee/template/watermark/getPage', p) /**水印模板分页 */,

  addWatermarkTemplate: (p) =>
    post('/goods/shopee/template/watermark/add', p) /**水印模板新增 */,

  getWatermarkTemplateById: (templateId) =>
    post(
      '/goods/shopee/template/watermark/' + templateId
    ) /**根据id获取水印模板信息 */,

  setWatermarkTemplateById: (data) =>
    post('/goods/shopee/template/watermark/edit', data) /**修改水印模板信息 */,

  delWatermarkTemplateById: (data) =>
    post('/goods/shopee/template/watermark/del', {
      templateIds: data
    }) /**删除水印模板信息 */,

  discountSingleSync: (p) => get('/goods/shopee/discount/singleSync', p), //批量获取商品详情

  discountConditionsSync: (p) =>
    get('/goods/shopee/discount/conditionsSync', p), //按条件同步营销折扣

  addPriductPriceTemplate: (data) =>
    post('/product-price-template/add', data) /**新增定价模板 */,

  getPriductPriceTemplateList: (p) => get('/product-price-template/list/' + p), //定价模板列表

  getPriductPriceTemplateListPage: (p) =>
    get('/product-price-template/list/page', p), //定价模板列表Page

  getPriductPriceTemplateDetails: (p) => get('/product-price-template/' + p), //定价模板详情

  usePriductPriceTemplate: (data) => post('/product-price-template/use', data), //使用定价模板

  editPriductPriceTemplate: (data) =>
    post('/product-price-template/edit', data), //编辑定价模板

  delPriductPriceTemplate: (p) => del('/product-price-template/', p), //删除定价模板

  getCategoryProductlist: (data) =>
    post('/goods/batch/get/category/product/list', data), // 查询店铺分类商品

  addShopCategory: (data) => post('/goods/batch/add/shop/category', data), // 商品店铺分类(加入新分类)

  updateShopCategory: (data) => post('/goods/batch/update/shop/category', data), // 商品店铺分类(替换原有分类)

  deleteShopCategory: (data) => post('/goods/batch/delete/shop/category', data), // 商品店铺分类(退出选中分类)
  /**
   * 修改标题、详情、主SKU、是否预购、物流、重量、店内分类
   * 封装错误提示
   */
  goodsBatchUpdate: (data) =>
    new Promise((resolve, reject) => {
      post('/goods/batch/update', data)
        .then((res) => {
          const {
            data: { result, message }
          } = res
          if (!result) {
            Message.error(message)
          }
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    }),

  goodsBatchUpdatePrice: (data) => post('/goods/batch/update/price', data), // 修改价格

  stockBatchUpdatePrice: (data) => post('/goods/batch/update/stock', data), // 修改库存

  unListBatchUpdatePrice: (data) => post('/goods/batch/unList', data), // 上下架

  deleteBatchUpdatePrice: (data) => post('/goods/batch/delete', data), // 删除

  productReleaseTemplateEdit: (p) => post('/product-release-template/edit', p), //产品发布配置编辑

  getProductReleaseTemplateAll: () =>
    get('/product-release-template/getTemeplate/all'), //产品发布全部配置

  getProductReleaseTemplate: (p) =>
    get('/product-release-template/getTemeplate/' + p), //产品发布配置

  goodsBootsConfigSave: (p) => post('/goods/boots/config/save', p), // 自动置顶保存置顶设置

  getGoodsBootsConfig: (p) => get('/goods/boots/config/get', p), // 自动置顶获取置顶信息

  getGoodsProductBootsPage: (p) => get('/goods/product/boots/page', p), // 置顶推广明细

  goodsProductBootsQuit: (p) => post('/goods/product/boots/quit', p), // 置顶推广取消置顶

  handpickAdd: (data) => post('/store/store/handpick/add', data), // 创建精选

  handpickConfigPage: (data) => get('/store/store/handpick/config/page', data), // 精选列表

  handpickRecordPage: (data) => get('/store/store/handpick/record/page', data), // 自动精选列表

  handpickEnableById: (data) =>
    post('/store/store/handpick/enableById/' + data), //开启精选

  handpickConfigDelete: (data) =>
    post('/store/store/handpick/config/delete/' + data), //删除精选

  handpickDisableById: (data) =>
    post('/store/store/handpick/disableById/' + data), //删除精选

  handpickAutoConfig: (data) => post('/store/store/handpick/auto/config', data), //自动精选设置

  handpickRecordDelete: (data) =>
    post('/store/store/handpick/record/delete/' + data), //删除精选记录

  handpickAutoEdit: (data) => post('store//store/handpick/auto/edit', data), //编辑自动精选设置

  handpickAutoQuery: (data) => post('/store/store/handpick/auto/query', data), //获取自动精选设置

  handpickDisableBatch: (data) =>
    post('/store/store/handpick/disable/batch', data), //一键停用

  handpickEnableBatch: (data) =>
    post('/store/store/handpick/enable/batch', data), //同步精选

  handpickConfigQueryBatch: (data) =>
    post('/store/store/handpick/config/query/batch', data), //根据店铺ID查询店铺精选(短查询)(批量)

  handpickPeriodOperateBatch: (data) =>
    post('/store/store/handpick/period/operate/batch', data), //批量修改&新增店铺定时设置

  handpickPeriodPage: (data) => get('/store/store/handpick/period/page', data), //定时配置分页列表

  handpickPeriodDelete: (data) =>
    post('/store/store/handpick/period/delete/batch', data), //删除定时设置(批量)

  productPublish: (data) => post('/goods/shopee/product/productPublish', data), //商品发布（转成发布中）

  cancelPublish: (data) => post('/goods/shopee/product/cancelPublish', data), //发布中商品取消发布

  productBatchEditAndPublish: (data) =>
    post('/goods/shopee/product/productBatchEditAndPublish/batch', data), //批量编辑并发布商品（转成发布中）

  getCount: (data) => get('/goods/shopee/product/early/getCount', data), // 商品发布状态数量统计

  analysisUnsalable: (data) =>
    post('/goods/shopee/product/analysis/unsalable', data), //滞销分析

  unsalableGetPage: (data) => get('/goods/product/unsalable/getPage', data), //滞销清理列表

  unsalableLock: (data) => post('/goods/product/unsalable/lock', data), //滞销清理锁定-解锁

  productIds: (data) => get('/goods/product/unsalable/get/product/ids', data), //滞销清理列表ids

  goodsProductBootsList: (data) => get('/goods/product/boots/list', data), //置顶推广明细列表

  getPublishCount: (data) => get('/goods/shopee/product/early/getCount', data), //商品发布状态数量统计

  getGoodsListCount: (data) =>
    get('/goods/shopee/product/getGoodsListCount', data), // 商品上下架数量统计

  updateRemark: (data) => post('/goods-shopee-product-ext/update', data), // 在线商品更新备注
  /* 以下为2.0接口 */
  savaOrPublishV2: (data) =>
    post('/goods/shopee/product/v2/editAndPublish', data), //保存并发布
  getShopeeProductDetailV2: (id) => get(`/goods/shopee/product/v2/${id}`), //获取虾皮商品详情
  getShopeeProductDetailV2Batch: (id) =>
    get(`/goods/shopee/product/v2/batch/${id}`), //获取虾皮商品批量详情
  handleEditV2Batch: (p) => post('/goods/shopee/product/v2/edit/batch', p), //批量编辑v2操作
  getBrandV2: (id, countryCode) =>
    get(`/goods-shopee-category-en/brand/list/${id}/${countryCode}`), //获取品牌
  updateShopeeProductV2: (p) => post('/goods/shopee/product/v2/edit', p), //虾皮数据编辑

  getCategoryListV2: (p) => get('/goods-shopee-category-en/categoryList', p), // 获取分类
  getItemLimit: (id) =>
    http({
      url: `/goods/shopee/product/v2/getItemLimit/${id}`
      // hideError: true
    }), //获取价格限制
  productPublishV2: (data) =>
    post('/goods/shopee/product/v2/productPublish', data), //商品发布（转成发布中）

  getEarlyProductList: (p) => get('/goods/shopee/product/early/getPage', p), // 获取早期商品列表（商品发布目录下）
  getEarlyCount: (p) => get('/goods/shopee/product/early/getCount', p), // 获取早期商品各状态数量（商品发布目录）
  getEarlyShopeeProductDetail: (id) => get(`/goods/shopee/product/early/${id}`), // 获取早期商品详情（商品发布目录）
  getEarlyProductBatchDetail: (id) =>
    get(`/goods/shopee/product/early/batch/${id}`), // 批量获取早期商品详情（商品发布目录）
  getEarlyProductDetailEdit: (p) => post('/goods/shopee/product/early/edit', p), // 编辑早期商品（商品发布目录）
  getEarlyProductDetailBatchEdit: (p) =>
    post('/goods/shopee/product/early/edit/batch', p), // 批量编辑早期商品（商品发布目录）
  deleteEarlyProductList: (p) => post('/goods/shopee/product/early/delete', p), // 批量删除早期商品（商品发布目录）
  updatesEarlyProduct: (p) =>
    post('/goods/shopee/product/v2/editAndUpdatePublish', p), // 更新已发布商品（商品发布目录）

  chooseCategory: (p) => post('/goods-shopee-category-en/category/choose', p), // 每次选择类目时，选中值返回给后端

  updateRemarks: (p) => post('/goods-shopee-product-ext/update', p), // 编辑商品备注 来源

  addRemarks: (p) => post('/goods-shopee-product-ext/add', p), // 新增商品备注 来源

  deleteRemarks2: (id) => get(`/goods-shopee-product-ext/${id}`), // 删除商品备注 来源

  listSelectionCategorySite: () =>
    post(`/selection/selection/listSelectionCategorySite`), // 选品站点
  listSelectionCategory: (p) =>
    post(`/selection/selection/listSelectionCategory`, p), // 获取选品类目
  listHotItem: (p) => post(`/selection/selection/listHotItem`, p) // 获取选品类目
}
export default Goods
