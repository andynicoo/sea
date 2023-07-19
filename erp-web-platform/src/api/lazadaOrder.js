import Request, { get, post, del, http } from '@/util/request'

const Lazada = {
  // getLazadaCategoryTree: (params) =>
  //   Request.get('/lazadaGoods/goodsLazadaCategory/get/category', { params }),
  //获取订单列表
  getLazadaOrderList: (params) =>
    Request.get('/order/orderLazadaOrder/get/order/page', { params }),
  //根据订单号同步订单
  syncLazadaOrderIds: (params) =>
    Request.post('/order/orderLazadaOrder/sync/orderIds', params),
  //取消订单
  cancelLazadaOrder: (params) =>
    Request.delete('/order/orderLazadaOrder/delete/order/set/status/cancel', {
      params
    }),
  //获取发货供应商
  shipmentProviders: (params) =>
    Request.get('/order/orderLazadaOrder/sync/shipmentProviders', {
      params
    }),
  //将商品记为重新包装
  lazadaOrderRePack: (params) =>
    Request.put('/order/orderLazadaOrder/put/order/set/status/re_pack', params),
  //安排物流
  lazadaOrderRts: (params) =>
    Request.put('/order/orderLazadaOrder/put/order/rts', params),

  //订单商品标记为已打包
  lazadaOrderToPack: (params) =>
    Request.post(
      '/order/orderLazadaOrder/put/order/set/status/to_pack',
      params
    ),

  //打印发票清单、发货清单
  orderDocument: (params) =>
    Request.post('/order/orderLazadaOrder/get/order/document', params),

  //订单详情
  LazadaOrderDetails: (params) =>
    Request.get('/order/orderLazadaOrder/get/order/details', {
      params
    }),
  //同步店铺订单
  syncStoreIds: (params) =>
    Request.post('/order/orderLazadaOrder/sync/storeIds', params),

  //同步店铺订单进度
  syncProgress: (params) =>
    Request.post('/order/orderLazadaOrder/order/sync/progress', params),

  //订单包裹跟踪信息
  logisticDetail: (params) =>
    Request.post('/order/orderLazadaOrder/logistic/detail', params),

  //获取各个状态订单总数
  statusCount: (params) =>
    Request.get('/order/orderLazadaOrder/get/order/status/count', {
      params
    }),
  //获取各个状态订单总数
  invoiceNumber: (params) =>
    Request.post('/order/orderLazadaOrder/post/order/invoice/number', params)
}

export default Lazada
