import route from "./moduleth/route.th"
import navbar from "./moduleth/navbar.th"
import login from "./moduleth/login.th"
import form from "./moduleth/form.th"
import common from "./moduleth/common.th"


import productCatalogLang from "./moduleth/productCatalogLang.th"
import collectLang from "./moduleth/collectLang.th"
import masterSkuLang from "./moduleth/masterSkuLang.th"

//仓库模块
import storage from './moduleth/storage.th'

//包材管理
import material from './moduleth/material.th'
//品牌管理
import brand from './moduleth/brand.th'

// 员工列表
import member from "./moduleth/member.th"

// 角色
import role from "./moduleth/role.th"

// 合同
import purchase from "./moduleth/purchase.th"

// 订单
import order from "./moduleth/order.th"

// 本地SKU
import storageSku from "./moduleth/storageSku.th"

// 首页overview
import overView from "./moduleth/overview.th"

// 授权
import store from "./moduleth/store.th"

// 营销
import discount from "./moduleth/discount.th"

// 店铺商品搜索组件
import searchForm from "./moduleth/searchForm.th"

// 商品编辑页面
import toBeEdit from "./moduleth/toBeEdit.th"

// 商品列表组件
import commodityList from "./moduleth/commodityList.th"

// 在线商品页面
import onSale from "./moduleth/onSale.th"
import faild from "./moduleth/faild.th"
import task from './moduleth/task.th'
import copy from './moduleth/copy.th'
import cate from './moduleth/cate.th'
import viewStorageSku from "./moduleth/viewStorageSku.th"
import batchEdit from './moduleth/batchEdit.th'
import edit from "./moduleth/edit.th"

// 服务
import other from "./moduleth/other.th"

// 物流
import packages from "./moduleth/package.th"

import goodsCollection from "./moduleth/goodsCollection.th"
import productList from "./moduleth/productList.th"

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