import { get, post, http } from '../util/request'

const Order = {
  getOrderList: (p) => get('/order/order/shopee/order/getPage', p), //获取订单列表

  getOrderInfo: (p) => get('/order/order/shopee/order/getOne', p), //获取单个订单信息

  syncOrderAll: (p) =>
    post('/order/order/shopee/order/synchronizationOrder', p), //批量同步订单

  syncOrder: (p) =>
    post('/order/order/shopee/order/synchronizationByOrdersn', p), //按订单同步

  appealOrder: (p) => post('/order/order/shopee/order/getWaybillNumber', p), //获取运单号

  printOrder: (p) => post('/order/order/shopee/order/printSheet', p), //打印面单

  handleSyncLogistics: (p) =>
    get('/order/order/shopee/order/synchronizationLogistics', p), //同步并获取物流

  getOrderShopeeLogisticsMessage: (p) =>
    get('/order/order/shopee/order/get/logistics/message', p), // 获取物流跟踪信息

  asyncShopeeOrderSync: (p) => post('/order/order/shopee/order/sync', p), // 同步订单

  getOrderStatusType: (p) => get('/order/order/shopee/order/get/type', p), //获取订单类型

  setOrderRemark: (p) => post('/order/order/shopee/order/set/remarks', p), //修改备注

  setOrderLabel: (p) => post('/order/order/shopee/order/set/label', p), //设置标签

  getOrderColorTags: () => get('/order/order-color-tags/list'), // 获取色值标签

  setOrderColorTags: (p) => post('/order/order-color-tags/set-tags', p), // 设置标签值

  orderShopeeSyncProgress: (p) =>
    post('/order/order/shopee/order/get/sync/progress', p), // 获取同步进度

  orderFmBind: (p) => post('/order/order/shopee/order/fm/bind', p), // 首公里预报订单绑定old

  orderFmInfo: (p) => get('/order/order/shopee/order/fm/info', p), // 首公里预报详情old

  orderFmCancel: (p) => post('/order/order/shopee/order/fm/cancel', p), // 首公里预报订单取消old

  memberAddressAdd: (p) => post('/user/member-address/add', p), // 新增地址

  memberAddressList: (p) => get('/user/member-address/list', p), // 地址列表

  memberAddressDel: (p) => post('/user/member-address/delete/' + p), // 删除地址

  orderPurchasePlace: (p) => post('/order/order-purchase/place', p), // 一键下单

  orderPurchaseGetPage: (p) => post('/order/order-purchase/getPage', p), //代发采购单列表

  quitRelation: (p) => post('/order/order-purchase/quit/relation', p), //取消关联

  asyncOrderExpressNo: (p) =>
    post('/order/order-purchase/sync/expressTrackingNumber', p), // 获取同步物流号

  handleUpdateExpressInfo: (p) =>
    post('/order/order-purchase/updateExpressInfo', p), //同步采购单物流状态

  getOrderSendType: (p) =>
    post('/order/order/shopee/order/getOrderSendType', p), //查询订单的可发货类型

  getWaybillNumberOne: (p) =>
    post('/order/order/shopee/order/getWaybillNumberOne', p), //   单个获取物流号

  deliverGoodsList: (p) => post('/overseas/deliver-goods/list', p), //   第三方海外仓库-发货列表

  transport: (p) => post('/overseas/sea-store/transport', p), //  根据仓库ID获取运输方式

  deliverGoods: (p) => post('/overseas/deliver-goods/deliver', p), //  第三方海外仓库-发货

  saveGoodsPrintCfg: (p) => post('/order/order-print-cfg/saveGoodsPrintCfg', p), //  保存会员商品打印面单配置

  getOrderPrintCfg: (p) => post('/order/order-print-cfg/getOrderPrintCfg', p), //  获取打印配置

  getOrderPrintDetailSheet: (p) =>
    post('/order/order-print-cfg/getOrderPrintDetailSheet', p), //  获取会员商品打印信息

  generateFirstMileTrackingNumber: (p) =>
    post('/order/order/shopee/order/fm/generateFirstMileTrackingNumber', p), //  生成揽货批次号

  // getListChannel: (p) => post('/order/order/shopee/order/fm/listChannel', p), //  首公里预报渠道列表

  addFirstMileAddress: (p) =>
    post('/order/order/shopee/order/fm/addFirstMileAddress', p), //  增加首公里地址

  listFirstMileAddress: (p) =>
    post('/order/order/shopee/order/fm/listFirstMileAddress', p), //  首公里地址列表

  // getListChannel: (p) => post('/order/order/shopee/order/fm/listChannel', p), //  首公里渠道列表

  listUnbindOrder: (p) =>
    post('/order/order/shopee/order/fm/listUnbindOrder', p), //  首公里未绑定列表

  listGenerateTrackingNumber: (p) =>
    post('/order/order/shopee/order/fm/listGenerateTrackingNumber', p), //  首公里批次号列表

  deleFirstMileAddress: (p) =>
    post('/order/order/shopee/order/fm/deleFirstMileAddress', p), //  删除首公里地址

  listShopeeFirstMileBind: (p) =>
    post('/order/order/shopee/order/v2/fm/listShopeeFirstMileBind', p), //  首公里绑定解绑列表

  unbindFirstMileTrackingNumber: (p) =>
    post('/order/order/shopee/order/v2/fm/unbindFirstMileTrackingNumber', p), //  首公里解绑

  listShopeeFirstMileBindLog: (p) =>
    post('/order/order/shopee/order/fm/listShopeeFirstMileBindLog', p), //  首公里绑定记录

  bindFirstMileTrackintNumber: (p) =>
    post('/order/order/shopee/order/v2/fm/bindFirstMileTrackintNumber', p), //  首公里绑定
  batchBindFirstMileTrackintNumber: (p) =>
    post('/order/order/shopee/order/v2/fm/batchBindFirstMileTrackintNumber', p), //  批量首公里绑定（发货预报）
  /* 以下为2.0接口 */
  handleSyncLogisticsV2: ({ storeId, shopId }) =>
    http({
      url: '/order/order/shopee/order/v2/synchronizationLogistics',
      hideError: true,
      params: { storeId, shopId }
    }), //同步并获取物流

  cancelOrder: (p) => post('/order/order/shopee/order/cancelOrder', p), //  取消订单

  handleBuyerCancellation: (p) =>
    post('/order/order/shopee/order/handleBuyerCancellation', p), //  售后订单处理

  OrderCancelLog: (p) =>
    post('/order/order/shopee/order/listOrderShopeeOrderCancelOperationLog', p), //  售后订单处理日志

  getOrderShopOrderCanelDetail: (p) =>
    post('/order/order/shopee/order/getOrderShopOrderCanelDetail', p), //  售后订单详情

  orderExportExcel: (data) =>
    http({
      url: '/order/order/shopee/order/v2/exportExcel',
      method: 'post',
      data,
      responseType: 'arraybuffer'
    }), //虾皮订单导出
  orderSplitOrder: (p) => post('/order/order/shopee/order/v2/splitOrder', p), //  订单拆单

  orderUnSplitOrder: (p) =>
    post('/order/order/shopee/order/v2/unSplitOrder', p), //  取消订单拆单

  batchApplyWaybillNumber: (p) =>
    post('/order/order/shopee/order/batchApplyWaybillNumber', p), // 批量申请运单号 /单个

  downLoadOrderPrintDocument: (data) =>
    http({
      url: '/order/order-print-cfg/downLoadOrderPrintDocument',
      method: 'post',
      data,
      responseType: 'arraybuffer'
    }), //打印面单获取pdf
  shopeeProductExt: (p) => get('/goods-shopee-product-ext/remark/' + p) // 获取采集来源
}

export default Order
