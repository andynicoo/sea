import http from '@/utils/request'

// 优惠券分页列表
function mgCouponPage(data = {}) {
  return http({
    url: '/mg/mgCoupon/page',
    method: 'post',
    data
  })
}

// 优惠券新增-编辑
function mgCouponEdit(data = {}) {
  return http({
    url: '/mg/mgCoupon/saveOrEdit',
    method: 'post',
    data
  })
}

// 优惠券明细列表
function mgCouponDetailList(data = {}) {
  return http({
    url: '/mg/mgCoupon/detail/list',
    method: 'post',
    data
  })
}

// 优惠券明细(数量统计)
function mgCouponDetail(data = {}) {
  return http({
    url: '/mg/mgCoupon/detail',
    method: 'post',
    data
  })
}

// 赠送优惠券分页列表
function mgCouponGivePage(data = {}) {
  return http({
    url: '/mg/mgCouponGive/page',
    method: 'post',
    data
  })
}

// 新增赠送优惠券
function mgCouponGiveSave(data = {}) {
  return http({
    url: '/mg/mgCouponGive/save',
    method: 'post',
    data
  })
}

// 可用优惠券列表
function mgCouponList(data = {}) {
  return http({
    url: '/mg/mgCoupon/list',
    method: 'post',
    data
  })
}

// 预览-人员明细
function mgCouponGiveGrant(data = {}) {
  return http({
    url: '/mg/mgCouponGive/grant',
    method: 'post',
    data
  })
}

// 发送记录分页列表
function mgCouponGiveRecordPage(data = {}) {
  return http({
    url: '/mg/mgCouponGiveRecord/page',
    method: 'post',
    data
  })
}

// 补发-发送
function mgCouponGiveRecordGrant(data = {}) {
  return http({
    url: '/mg/mgCouponGiveRecord/grant',
    method: 'post',
    data
  })
}

// 导出优惠券
function mgCouponExportCoupon(data = {}) {
  return http({
    url: '/mg/mgCoupon/export/coupon',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 导出优惠券明细
function mgCouponExportCouponDetail(data = {}) {
  return http({
    url: '/mg/mgCoupon/export/coupon/detail',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 导出赠送优惠券记录
function mgCouponGiveExportGiveCoupon(data = {}) {
  return http({
    url: '/mg/mgCouponGive/export/give/coupon',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 导出发送记录
function mgCouponGiveRecordExportGiveCouponRecord(data = {}) {
  return http({
    url: '/mg/mgCouponGiveRecord/export/give/coupon/record',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 回收
function mgCouponGiveRecordRecovery(data = {}) {
  return http({
    url: '/mg/mgCouponGiveRecord/recovery',
    method: 'post',
    data
  })
}

export {
  mgCouponPage,
  mgCouponEdit,
  mgCouponDetailList,
  mgCouponDetail,
  mgCouponGivePage,
  mgCouponGiveSave,
  mgCouponList,
  mgCouponGiveGrant,
  mgCouponGiveRecordPage,
  mgCouponGiveRecordGrant,
  mgCouponExportCoupon,
  mgCouponExportCouponDetail,
  mgCouponGiveExportGiveCoupon,
  mgCouponGiveRecordExportGiveCouponRecord,
  mgCouponGiveRecordRecovery
}
