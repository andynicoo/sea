import Axios, { http, get, post } from '../util/request'

export default {
  addStorage: (data) => post('/storage/info/add', data), // 新增仓库
  getStorage: (data) => get('/storage/info/page', data), // 仓库列表
  editStorage: (data) => post('/storage/info/edit', data), // 仓库编辑
  delStorage: (data) => post('/storage/info/del', data), // 删除编辑
  setDefaultStorage: (data) => post('/storage/info/set/default-storage', data), // 设置默认仓库

  getStorageShelves: (data) => post('/storage/shelves/list', data), // 仓库下的货架
  addStorageShelves: (data) => post('/storage/shelves/add', data), // 新增货架
  delStorageShelves: (data) => post('/storage/shelves/del', data), // 删除货架

  editStorageShelves: (data) => post('/storage/shelves/edit', data), // 编辑货架

  getStoragePosition: (data) => get('/storage/position/list', data), // 货架下的仓位

  getStockDetail: (data) => get('/storage/info/stock/detail', data), // 货架下的仓位

  getProductGoods: (data) => get('/product/item/product/page', data), // 产品-在线商品
  updateProductPair: (data) => post('/product/item/update/pair', data), // 产品-在线商品-更换配对
  getDownloadPairExcel: () =>
    http({
      url: '/product/item/downloadPairExcel',
      method: 'get',
      responseType: 'arraybuffer'
    }), // 产品-在线商品-导入模板下载
  importProductPair: (data) => post('/product/item/importPair', data), // 产品-在线商品-入文件匹配
  profitProductPrice: (data) => post('/product-price-template/profit', data), // 产品-在线商品-估计利润
  productExport: (data) =>
    Axios.get('/product/product/item/export/product', {
      params: data,
      responseType: 'blob'
    }), // 仓储-在线商品-匹配主SKU-导出商品
  autoMatch: (productIds) => post('/product/item/matchingSku', productIds) // 自动匹配
}
