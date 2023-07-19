import { get, del, post, http } from '@/util/request'
const Product = {
  getGeneralPage: (p) => get('/product/general/page', p), //获取采集数据列表

  deleteGeneralItem: (p) => del('/product/general/', p), //删除采集数据

  updateGeneralItem: (p) => post('/product/general/edit', p), //编辑采集数据

  getProductDetail: (id) => get('/product/general/' + id), // 获取产品详情

  handleClaim: (p) => post('/product/general/claim', p), //认领商品到店铺

  getGeneralSourceList: (p) => get('/crawl/product/crawl/source/list', p), //获取产品采集列表

  handleBatchDelete: (p) => post('/product/general/delete/batch', p), //批量删除

  handleBatchClaim: (p) => post('/product/general/claim/batch', p), //批量认领

  getPostCralByUrl: (p) => post('/product/crawl/postCrawl', p), //解析前端数据

  getCralByUrl: (p) => post('/product/crawl/urlCrawl', p), //根据url采集

  getProductMaterialList: (p) => post('/product-material/page', p), // 包材列表

  listProductMaterialList: (p) => post('/product-material/list', p), // 包材列表

  addProductMaterial: (p) => post('/product-material/add', p), // 新增包材

  editProductMaterial: (p) => post('/product-material/edit', p), // 编辑包材

  delProductMaterial: (p) => post('/product-material/del', p), // 删除包材

  // switchProductMaterialStatus: (p) => post("/product-material/status/switch", { id: p }), // 停用或启用包材

  getProductBrand: (p) => post('/product-brand/get', p), // 品牌列表

  listProductBrand: (p) => post('/product-brand/list', p), // 品牌列表(不分页)

  addProductBrand: (p) => post('/product-brand/add', p), // 新增品牌

  delProductBrand: (p) => post('/product-brand/del', p), // 删除品牌

  editProductBrand: (p) => post('/product-brand/edit', p), // 品牌编辑

  getProductCatalog: (p) => get('/product/catalog/page', p), // 类目列表

  getProductCatalogDesc: (p) => get('/product/catalog/get', p), // 类目详情

  listProductCatalog: (p) => post('/product/catalog/list'), // 目录列表（不分页）

  addProductCatalog: (p) => post('/product/catalog/add', p), // 新增类目

  delProductCatalog: (p) => post('/product/catalog/del', { id: p }), // 删除类目

  editProductCatalog: (p) => post('/product/catalog/edit', p), // 编辑类目

  getMasterSkuProduct: (p) => get('/product/item/page', p), // 主SKU列表

  listMasterSkuProduct: (p) => post('/product/item/sku/sku/list', p), // 主SKU列表（不分页）

  getMasterSkuProductItem: (p) => get('/product/item/get/item/sku', p), // 主SKU详情

  addMasterSkuProduct: (p) => post('/product/item/add/item/sku', p), // 添加主SKU

  editMasterSkuProduct: (p) => post('/product/item/edit/item/sku', p), // 编辑主SKU

  delMasterSkuProduct: (p) => post('/product/item/delete', { itemIds: p }), // 删除主SKU

  applicationStockSkuByCatalog: (p) =>
    post('/product/item/application/catalog/stock/sku', p), // 应用到本地SKU（商品类别）

  applicationStockSkuAssist: (p) =>
    post('/product/item/application/assist/stock/sku', p), // 应用到本地SKU（辅助信息）

  syncStockSku: (p) =>
    post('/product/general/sync/sku/batch', { productIds: p }), // 同步到本地SKU

  batchUpdateMasterSkuProductCatalog: (p) =>
    post('/product/item/sku/batch/update/sku/catalog', p), // 批量修改类别

  bindStockSkuProduct: (p) => post('/product/item/sku/relation/stock/sku', p), // 主SKU关联本地SKU

  unBindStockSkuProduct: (p) => post('/product/item/sku/dismiss/stock/sku', p), // 主SKU解除关联本地SKU

  mergeProductVariationsSku: (p) => post('/product/variations/merge/sku', p), // 合并本地SKU

  addProductVariations: (p) => post('/product/variations/add', p), // 添加本地SKU

  getProductStockSku: (p) => post('/product/variations/page', p), // 本地SKU列表

  getProductStockSkuItem: (p) => post('/product/variations/get', p), // 本地SKU详情

  addProductStockSku: (p) => post('/product/variations/sku/add', p), // 添加本地SKU

  productItemSyncSku: (p) => post('/product/item/sku/sync/sku', p), // 批量同步本地SKU

  editProductStocksku: (p) => post('/product/variations/edit', p), // 编辑本地SKU

  delProductStocksku: (p) => post('/product/variations/delete', p), // 删除本地SKU

  getRecommendCategory: (p) =>
    post('/product/general/claim/recommend-category', p), //获取推荐分类

  getGeneralCrawlDoing: (p) => get('/product/general/crawl-doing', p), //是否正在采集中

  getBrandPage: (p) => get('/product-brand/page', p), // 获得品牌列表(分页)

  getLastPluginVersion: () => post('/product/crawl/member/query-last-version'), //获取最新插件

  generalcounts: (data) => get('/product/general/counts', data), //采集数统计

  /* 以下为2.0 */
  getCategorySelectV2: (params) =>
    http({
      url: '/goods-shopee-category-en/categoryList',
      params
    }), //获取所有类目

  getAttributeV2: (id, code) =>
    get(`/goods-shopee-category-attribute-en/getAttributes/${id}/${code}`), //获取属性
  getCnscAttributeV2: (id, code) =>
    get(`/goods/cnsc/goods/shopee/category/attribute/${id}`), //获取cnsc属性
  /**
   * 获取类目推荐
   * @param {String} countryCode 站点
   * @param {String} name 商品名称
   * @param {String} shopId 商品id
   */
  getCategoryRecommend: (data) =>
    http({
      url: '/goods-shopee-category-en/category/recommend',
      method: 'post',
      data
    }),
  /**
   * 获取发货限制天数
   * @param {number} shopId 虾皮的店铺id
   * @param {String} categoryId 类目id
   */
  getShipLimit: (params) =>
    http({
      url: `/goods-shopee-category-en/syncLimit/${params.shopId}/${params.categoryId}`
    }),
  getProductVariationsList: (data) =>
    get('/product/variations/pair/page', data), // 查询本地sku列表，api

  labelChoose: (data) => post('/product/general/label/choose', data), // 设置标签

  batchLabelChoose: (data) => post('/product/general/label/batchChoose', data), // 批量设置标签

  getPageLabel: (data) => get('/product/general/page/label', data) // 获取标签商品列表
}

export default Product
