// import { del, get, post } from '../util/request'

// const Store = {
//   getStoreList: (p) => get('/store/store/info/page', p), //获取店铺列表

//   getAllStore: (p) => post('/store/store/info/list', {}), //获取所有店铺

//   updateStoreInfo: (p) => post('/store/store/info/edit', p), //更新店铺

//   getStoreDetail: (p) => post('/store/store/info/get', p), //获取店铺详情

//   deleteStore: (p) => del('/store/store/info/', p), //删除

//   handleBatchDelete: (p) => post('/store/store/info/delete', p), //批量删除

//   getStoreAuthInfo: () => get('/store/store/info/auth'), //获取店铺授权信息

//   getShopeeAuthUrl: () => get('/store/store/shopee/auth/url'), // 获取虾皮授权Url

//   handleSync: (p) => post('/store/store/info/syncStore', p), // 同步店铺

//   handleApplyStore: (p) => post('/store/store/open/shop/add', p), //申请开店

//   getPreBuyDay: (p) => get('/store/store/info/get/pre-buy-day', p), //获取预购天数

//   getStoreInfoLimit: (storeId) =>
//     get('/store/store/info/get/site/limit', { storeId }), //获取站点限制

//   getAllStoreInfoLimit: () => get('/store/store/info/get/site/limit/all'), //获取全部站点限制

//   getAllSite: () => get('/store/store/info/site/list'), // 获取所有站点

//   getShopeeAuthUrlV2: () => get('/store/store/shopee/auth/v2/url'), // 获取虾皮授权Url v2

//   getShopeeAuthLocalUrl: () => get('/store/store/shopee/auth/local/url') // 获取shopee认证页面
// }

// export default Store

import { del, get, post } from '../util/request'

const Store = {
  getStoreList: (p) => get('/store/store/info/page', p), //获取店铺列表

  getAllStore: (p) => post('/store/store/info/list', p), //获取所有店铺

  // updateStoreInfo: (p) => post('/store/store/info/edit', p), //更新店铺

  // getStoreDetail: (p) => post('/store/store/info/get', p), //获取店铺详情

  deleteStore: (p) => del('/store/store/info/', p), //删除

  // handleBatchDelete: (p) => post('/store/store/info/delete', p), //批量删除

  getStoreAuthInfo: () => get('/store/store/info/auth'), //获取店铺授权信息

  getShopeeAuthUrl: () => get('/store/store/shopee/auth/url'), // 获取虾皮授权Url

  // handleSync: (p) => post('/store/store/info/syncStore', p), // 同步店铺

  handleApplyStore: (p) => post('/store/store/open/shop/add', p), //申请开店

  getPreBuyDay: (p) => get('/store/store/info/get/pre-buy-day', p), //获取预购天数

  getStoreInfoLimit: (storeId) =>
    get('/store/store/info/get/site/limit', { storeId }), //获取站点限制

  getAllStoreInfoLimit: () => get('/store/store/info/get/site/limit/all'), //获取全部站点限制

  getAllSite: () => get('/store/store/info/site/list'), // 获取所有站点

  getShopeeAuthUrlV2: () => get('/store/store/shopee/auth/v2/url'), // 获取虾皮授权Url v2

  getShopeeAuthLocalUrl: () => get('/store/store/shopee/auth/local/url'), // 获取shopee认证页面

  //new
  getStoreListM: (url, p) => get(url, p), //获取店铺列表

  updateStoreInfo: (url, p) => post(url, p), //更新店铺

  handleBatchDelete: (url, p) => post(url, p), //批量删除

  getAuthUrl: (url) => get(url), // 获取授权Url

  handleSync: (url, p) => post(url, p) // 同步店铺
}

export default Store
