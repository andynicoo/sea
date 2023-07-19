import Request from '@/util/request'

const Lazada = {
  getLazadaCategoryTree: (params) => {
    console.log(params)
    return Request.get('/lazadaGoods/goodsLazadaCategory/get/category', {
      params
    })
  },
  getLazadaCategoryAttribute: (params) =>
    Request.get('/lazadaGoods/goodsLazadaCategory/get/category/attribute', {
      params
    }),

  //Lazada商品发布列表
  getGoodsLazadaProductPage: (params) =>
    Request.get('/lazadaGoods/goodsLazadaProductRecord/page', { params }),
  //Lazada商品删除
  deleteLazadaProduct: (params) =>
    Request.post('/lazadaGoods/goodsLazadaProductRecord/delete', params),
  //Lazada商品发布
  publishLazadaProduct: (params) =>
    Request.post('/lazadaGoods/goodsLazadaProductRecord/publish', params),
  //Lazada在线商品列表
  getGoodsLazadaOnSalePage: (params) =>
    Request.get('/lazadaGoods/goodsLazadaProduct/page', { params }),
  //Lazada商品下架
  goodsLazadaProductUnlist: (params) =>
    Request.post('/lazadaGoods/goodsLazadaProduct/batch/unlist', params),
  //Lazada商品更新
  goodsLazadaProductUpdate: (params) =>
    Request.post('/lazadaGoods/goodsLazadaProduct/sync/by/item', params),
  //Lazada商品同步
  goodsLazadaProductSync: (params) =>
    Request.post('/lazadaGoods/goodsLazadaProduct/sync', params),
  //Lazada商品同步进度
  goodsLazadaProductSyncProgress: (params) =>
    Request.post('/lazadaGoods/goodsLazadaProduct/get/sync/progress', params),

  //Lazada在线商品删除
  goodsLazadaProductDelete: (params) =>
    Request.post('/lazadaGoods/goodsLazadaProduct/delete', params),

  getLazadaDetails: (id) =>
    Request.get(`/lazadaGoods/goodsLazadaProductRecord/get/${id}`),
  /**商品保存 */
  putLazadaProduct: (data) =>
    Request.post('/lazadaGoods/goodsLazadaProductRecord/edit', data),
  /**商品保存并发布 */
  lazadaProductSaveAndPublish: (data) =>
    Request.post('/lazadaGoods/goodsLazadaProductRecord/edit/publish', data),
  /**lazada图片上传 */
  lazadaImagePush: (data) =>
    Request.post('/lazadaGoods/goodsLazadaProduct/upload/image', data),
  /**lazada在线商品 */
  getOnlineLazadaProduct: (id) =>
    Request.get(`/lazadaGoods/goodsLazadaProduct/get/${id}`),
  /**lazada更新商品 */
  updateOnlineLazadaProduct: (data) =>
    Request.post('/lazadaGoods/goodsLazadaProduct/update/product', data),

  /**lazada商品来源 */
  collectionSource: (data) =>
    Request.post(
      '/lazadaGoods/goodsLazadaProduct/update/collection/source',
      data
    ),
  /**商品推荐类目 */
  lazadaCategoryAttrSuggestion: (storeId, name) =>
    Request.get(
      '/lazadaGoods/goodsLazadaCategoryAttribute/get/suggestion/new/tree',
      { params: { storeId, name } }
    )
}

export default Lazada
