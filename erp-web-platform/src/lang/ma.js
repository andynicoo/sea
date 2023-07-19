import route from "./modulema/route.ma"
import navbar from "./modulema/navbar.ma"
import login from "./modulema/login.ma"
import form from "./modulema/form.ma"
import common from "./modulema/common.ma"


import productCatalogLang from "./modulema/productCatalogLang.ma"
import collectLang from "./modulema/collectLang.ma"
import masterSkuLang from "./modulema/masterSkuLang.ma"

//仓库模块
import storage from './modulema/storage.ma'

//包材管理
import material from './modulema/material.ma'
//品牌管理
import brand from './modulema/brand.ma'

// 员工列表
import member from "./modulema/member.ma"

// 角色
import role from "./modulema/role.ma"

// 合同
import purchase from "./modulema/purchase.ma"

// 订单
import order from "./modulema/order.ma"

// 本地SKU
import storageSku from "./modulema/storageSku.ma"

// 首页overview
import overView from "./modulema/overview.ma"

// 授权
import store from "./modulema/store.ma"

// 营销
import discount from "./modulema/discount.ma"

// 店铺商品搜索组件
import searchForm from "./modulema/searchForm.ma"

// 商品编辑页面
import toBeEdit from "./modulema/toBeEdit.ma"

// 商品列表组件
import commodityList from "./modulema/commodityList.ma"

// 在线商品页面
import onSale from "./modulema/onSale.ma"
import faild from "./modulema/faild.ma"
import task from './modulema/task.ma'
import copy from './modulema/copy.ma'
import cate from './modulema/cate.ma'
import viewStorageSku from "./modulema/viewStorageSku.ma"
import batchEdit from './modulema/batchEdit.ma'
import edit from "./modulema/edit.ma"

// 服务
import other from "./modulema/other.ma"

// 物流
import packages from "./modulema/package.ma"

import goodsCollection from "./modulema/goodsCollection.ma"
import productList from "./modulema/productList.ma"

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