import { get, post, del, http } from '@/util/request'

const Discount = {
  getShopeeDiscountList: (p) => post('/goods/shopee/discountv2/page', p), //获取营销活动列表

  addDiscount: (p) => post('/goods/shopee/discountv2/addDiscount', p), //新增折扣活动

  getGoodsPage: (p) => get('/goods/shopee/discountv2/goods/page', p), // 获取可添加活动商品列表

  deleteDiscount: (p) => post('/goods/shopee/discountv2/deleteDiscount', p), //删除活动

  getDiscountDetail: (p) =>
    get('/goods/shopee/discountv2/getDiscountDetail', p), // 获取折扣详情

  deleteDiscountProduct: (p) =>
    post('/goods/shopee/discountv2/delete/discount/items', p), // 删除活动商品

  conditionsSync: (p) => get('/goods/shopee/discountv2/conditionsSync', p), // 获取折扣详情

  updateDiscount: (p) => post('/goods/shopee/discountv2/updateDiscount', p), // 编辑折扣活动

  updateDiscountProduct: (p) =>
    post('/goods/shopee/discountv2/update/discount/items', p), // 编辑折扣活动的产品

  endDiscount: (p) => post('/goods/shopee/discountv2/endDiscount', p), // 结束活动

  singleSync: (p) => get('/goods/shopee/discountv2/singleSync', p), // 单个同步营销折扣

  syncDiscount: (p) => post('/goods/shopee/discountv2/sync', p), // 同步店铺营销折扣
  getSyncProgress: (p) => post('/goods/shopee/discountv2/get/sync/progress', p), // 获取同步进度

  getFlollowList: (p) => post('/goodsShopeeFollowPrize/list', p), // 获取关注有礼列表

  editFollow: (p) => post('/goodsShopeeFollowPrize/save', p), // 新增-修改关注有礼

  syncFollowList: (p) => post('/goodsShopeeFollowPrize/syncFollowPrize', p), // 关注有礼列表

  getFollowDetail: (p) => post('/goodsShopeeFollowPrize/detail', p), // 关注有礼列表-编辑-获取详情

  deleteFollowDetail: (p) => post('/goodsShopeeFollowPrize/delete', p), // 关注有礼列表-删除

  endFollowDetail: (p) => post('/goodsShopeeFollowPrize/end', p), // 关注有礼列表-终止

  getVoucherList: (p) => post('/goodsShopeeVoucher/list', p), // 获取优惠券列表

  syncVoucherList: (p) => post('/goodsShopeeVoucher/syncVoucher', p), // 获取同步进度

  editCoupon: (p) => post('/goodsShopeeVoucher/save', p), // 新增-修改优惠券

  getCouponDetail: (p) => post('/goodsShopeeVoucher/detail', p), // 优惠券列表-编辑-获取详情

  deleteCouponDetail: (p) => post('/goodsShopeeVoucher/delete', p), // 优惠券列表-删除

  endCouponDetail: (p) => post('/goodsShopeeVoucher/end', p), // 优惠券列表-终止

  getSetmealList: (p) => post('/goodsShopeeBundleDeal/list', p), // 获取套餐优惠列表

  syncSetmealList: (p) => post('/goodsShopeeBundleDeal/syncVoucher', p), // 获取套餐优惠同步进度

  editSetmeal: (p) => post('/goodsShopeeBundleDeal/save', p), // 新增-修改套餐优惠

  getSetmealDetail: (p) => post('/goodsShopeeBundleDeal/detail', p), // 套餐优惠列表-编辑-获取详情

  deleteSetmealDetail: (p) => post('/goodsShopeeBundleDeal/delete', p), // 套餐优惠列表-删除

  endSetmealDetail: (p) => post('/goodsShopeeBundleDeal/end', p), // 加购优惠列表-终止

  getAddOnDealList: (p) => post('/goodsShopeeAddOnDeal/list', p), // 获取加购优惠列表

  syncAddOnDealList: (p) => post('/goodsShopeeAddOnDeal/syncVoucher', p), // 获取加购优惠同步进度

  editAddOnDeal: (p) => post('/goodsShopeeAddOnDeal/save', p), // 新增-修改加购优惠

  getAddOnDeallDetail: (p) => post('/goodsShopeeAddOnDeal/detail', p), // 套餐加购优惠-编辑-获取详情

  deleteAddOnDealDetail: (p) => post('/goodsShopeeAddOnDeal/delete', p), // 套餐加购优惠-删除

  endAddOnDealDetail: (p) => post('/goodsShopeeAddOnDeal/end', p) // 套餐加购优惠-终止
}
export default Discount
