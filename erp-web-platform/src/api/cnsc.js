import { get, post } from '@/util/request'

const Cnsc = {
  handleBatchClaimToCnscMerchant: (data) =>
    post('/product/cnsc/product/general/batchClaim', data), //批量认领到cnsc商户

  getMerchantPublishable: () =>
    post('/goods/cnsc/goods/shopee/product/merchant/publishable'), //获取可添加产品的商户

  getStorePublishable: (data) =>
    post(
      '/goods/cnsc/goods/shopee/product/shop/publishable?merchantId=' + data
    ), //获取可发布产品的店铺

  handlePublishToMerchant: (data) =>
    post('/goods/cnsc/goods/shopee/product/product/publish/merchant', data), //发布产品到商户

  handlePublishProductsToStore: (data) =>
    post('/goods/cnsc/goods/shopee/product/product/publish/task', data), //发布产品到cnsc店铺

  handleSyncProduct: (data) =>
    post('/goods/cnsc/goods/shopee/product/syscProduct', data), // 同步

  getCnscGoodsPage: (data) =>
    get('/goods/cnsc/goods/shopee/product/getPage', data), //获取商品分页列表

  getCnscCateList: (data) =>
    get('/goods/cnsc/goods/shopee/category/list', data), // 获取类目

  getCnscCateAllList: () => get('/goods/cnsc/goods/shopee/category/list/all'), // 获取全部类目

  getCnscBrandList: (data) =>
    get('/goods/cnsc/goods/shopee/category/brand/list/' + data), // 获取品牌

  getAttribute: (data) =>
    get('/goods/cnsc/goods/shopee/category/attribute/' + data), // 获取属性

  getCnscProductDetail: (data) =>
    get('/goods/cnsc/goods/shopee/product/' + data), // 商品详情

  handleUpdateProduct: (data) =>
    post('/goods/cnsc/goods/shopee/product/edit', data), // 更新商品

  deleteProducts: (data) =>
    post('/goods/cnsc/goods/shopee/product/delete', data), // 删除商品

  syscProductSingle: (data) =>
    post('/goods/cnsc/goods/shopee/product/syscProduct/single', data), // 单个商品同步(全球商品)
  syscStoreProduct: (data) =>
    post('/goods/cnsc/goods/shopee/product/syscStoreProduct', data), // 单个商品同步(店铺商品)
  updateProductMerchant: (data) =>
    post('/goods/cnsc/goods/shopee/product/publish/update/merchant', data), // 保存全球产品到商户
  updateProductShop: (data) =>
    post('/goods/cnsc/goods/shopee/product/publish/update/shop', data), // 保存全球产品到店铺
  unListProductShop: (data) =>
    post('/goods/cnsc/goods/shopee/product/unList', data), // 商品上架下架(店铺商品)

  getEarlyCnscProductDetail: (id) =>
    get(`/goods/goods/shopee/product/early/cnsc/${id}`), // 商品详情
  handleEarlyUpdateProduct: (data) =>
    post('/goods/goods/shopee/product/early/cnsc/edit', data) // 更新商品
}
export default Cnsc
