import route from "./modulevi/route.vi"
import navbar from "./modulevi/navbar.vi"
import login from "./modulevi/login.vi"
import form from "./modulevi/form.vi"
import common from "./modulevi/common.vi"


import productCatalogLang from "./modulevi/productCatalogLang.vi"
import collectLang from "./modulevi/collectLang.vi"
import masterSkuLang from "./modulevi/masterSkuLang.vi"

//仓库模块
import storage from './modulevi/storage.vi'

//包材管理
import material from './modulevi/material.vi'
//品牌管理
import brand from './modulevi/brand.vi'

// 员工列表
import member from "./modulevi/member.vi"

// 角色
import role from "./modulevi/role.vi"

// 合同
import purchase from "./modulevi/purchase.vi"

// 订单
import order from "./modulevi/order.vi"

// 本地SKU
import storageSku from "./modulevi/storageSku.vi"

// 首页overview
import overView from "./modulevi/overview.vi"

// 授权
import store from "./modulevi/store.vi"

// 营销
import discount from "./modulevi/discount.vi"

// 店铺商品搜索组件
import searchForm from "./modulevi/searchForm.vi"

// 商品编辑页面
import toBeEdit from "./modulevi/toBeEdit.vi"

// 商品列表组件
import commodityList from "./modulevi/commodityList.vi"

// 在线商品页面
import onSale from "./modulevi/onSale.vi"
import faild from "./modulevi/faild.vi"
import task from './modulevi/task.vi'
import copy from './modulevi/copy.vi'
import cate from './modulevi/cate.vi'
import viewStorageSku from "./modulevi/viewStorageSku.vi"
import batchEdit from './modulevi/batchEdit.vi'
import edit from "./modulevi/edit.vi"

// 服务
import other from "./modulevi/other.vi"

// 物流
import packages from "./modulevi/package.vi"

import goodsCollection from "./modulevi/goodsCollection.vi"
import productList from "./modulevi/productList.vi"

export default {
  route,
  navbar,
  login,
  form,
  common,
  productCatalog: productCatalogLang,
  collect: collectLang,
  storage,
  masterSku: masterSkuLang,
  material,
  member,
  brand,
  role,
  purchase,
  order,
  storageSku,
  overView,
  store,
  discount,
  searchForm,
  toBeEdit,
  commodityList,
  onSale,
  faild,
  task,
  copy,
  cate,
  viewStorageSku,
  batchEdit,
  other,
  packages,
  edit,
  goodsCollection,
  productList
}