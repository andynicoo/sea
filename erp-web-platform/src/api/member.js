import { get, post, del } from '@/util/request'

const Member = {
  getInvitedList: (p) => get('/user/member/info/invitation/list', p), //获取邀请列表

  feedback: (p) => post('/erp/content-feedback/add-feedback', p), //发布意见

  handleAddMemberRule: (p) => post('/user/member-role/add', p), //添加角色

  getMemberRuleList: (p) => get('/user/member-role/list/', p), //获取角色列表

  getMemberRuleMenuList: (p) => get('/member-role/memu/list/' + p), //获取角色可用菜单

  getMemberRuleMenuStoreList: (p) => get('/user/member-role/detail/list/' + p), //获取角色可用菜单和店铺

  handleUpdateRuleInfo: (p) => post('/member-role/menu/edit', p), //更新角色信息

  handleUpdateRuleStoreInfo: (p) => post('/user/member-role/detail/edit', p), //更新角色店铺信息

  getMemberRulePage: (p) => get('/user/member-role/page', p), //获取角色分页

  handleDeleteRule: (p) => del('/user/member-role/', p), //删除角色

  handleAddSubMember: (p) => post('/user/member/account/add', p), //添加子账号

  getSubMemberList: (p) => post('/user/member-role/get/list', p), // 获取子账号列表

  getSubMember: (p) => post('/user/member/account/get', p), // 获取子账号详情

  handleDeleteMember: (p) => post('/user/member/account/delete', p), // 删除子账号

  handleUpdateMember: (p) => post('/user/member/account/edit', p), //更新子账号

  getMemeberInfo: (p) => get('/user/member/info/self', p), // 获取用户账户信息

  getMemberListinfo: (p) => post('/user/memberSetMealConfigInfo/get/info', p), //获取套餐详情介绍

  getMemeberLevelInfo: (p) => get('/user/memberSetMealInfo/get/config/info', p), // 获取当前会员详情

  getWangbi: (p) => get('/user/memberSetMealConfig/current/balance', p), // 获取当前旺币

  getMemberList: (p) => get('/user/memberSetMealConfig/list', p), // 订购套餐列表

  buyMemberNow: (p) => post('/user/memberSetMealInfo/buy/now', p), // 立即购买-续费升级-升级

  getMemberListType: (p) => get('/user/memberSetMealInfo/page', p), // 获取套餐订购列表

  getEditImgLimit: (p) => get('/user/memberSetMealInfo/codeLimit', p), // 获取套餐订购列表

  handleImgnumAdd: (p) => get('/user/memberSetMealInfo/codeIncrement', p), // 在线修图数量自增

  getExtensionImage: () =>
    get('/user/memberSetMealActivityRecord/getExtensionImage'), // 获取分享海报

  getMemberCouponUnusedPage: (data) =>
    get('/user/memberCoupon/unused/page', data), // 未使用优惠券列表

  getMemberCouponUsedPage: (data) => get('/user/memberCoupon/used/page', data), // 已使用优惠券列表

  getMemberCouponExpiredPage: (data) =>
    get('/user/memberCoupon/expired/page', data), // 已过期优惠券列表

  applyMemberCouponUseCoupon: (data) =>
    post('/user/memberCoupon/use/coupon', data), // 使用优惠券

  rebateGet: (data) => get('/mg/mg-advertising/rebate/get', data), //获取返利描述

  couponExchange: (data) => post('/user/memberCoupon/coupon/exchange ', data), //兑换优惠券

  memberCouponUsable: (data) => post('/user/memberCoupon/usable', data), // 可用优惠券

  memberSetMealInfoGetSetMealAmount: (data) =>
    post('/user/memberSetMealInfo/getSetMealAmount', data) // 获取套餐价格
}

export default Member
