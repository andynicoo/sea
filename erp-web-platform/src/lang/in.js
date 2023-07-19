import route from "./modulein/route.in"
import navbar from "./modulein/navbar.in"
import login from "./modulein/login.in"
import form from "./modulein/form.in"
import common from "./modulein/common.in"


import productCatalogLang from "./modulein/productCatalogLang.in"
import collectLang from "./modulein/collectLang.in"
import masterSkuLang from "./modulein/masterSkuLang.in"

//仓库模块
import storage from './modulein/storage.in'

//包材管理
import material from './modulein/material.in'
//品牌管理
import brand from './modulein/brand.in'

// 员工列表
import member from "./modulein/member.in"

// 角色
import role from "./modulein/role.in"

// 合同
import purchase from "./modulein/purchase.in"

// 订单
import order from "./modulein/order.in"

// 本地SKU
import storageSku from "./modulein/storageSku.in"

// 首页overview
import overView from "./modulein/overview.in"

// 授权
import store from "./modulein/store.in"

// 营销
import discount from "./modulein/discount.in"

// 店铺商品搜索组件
import searchForm from "./modulein/searchForm.in"

// 商品编辑页面
import toBeEdit from "./modulein/toBeEdit.in"

// 商品列表组件
import commodityList from "./modulein/commodityList.in"

// 在线商品页面
import onSale from "./modulein/onSale.in"
import faild from "./modulein/faild.in"
import task from './modulein/task.in'
import copy from './modulein/copy.in'
import cate from './modulein/cate.in'
import viewStorageSku from "./modulein/viewStorageSku.in"
import batchEdit from './modulein/batchEdit.in'
import edit from "./modulein/edit.in"

// 服务
import other from "./modulein/other.in"

// 物流
import packages from "./modulein/package.in"

import goodsCollection from "./modulein/goodsCollection.in"
import productList from "./modulein/productList.in"

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