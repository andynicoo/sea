import route from "./moduleen/route.en"
import navbar from "./moduleen/navbar.en"
import login from "./moduleen/login.en"
import form from "./moduleen/form.en"
import common from "./moduleen/common.en"


import productCatalogLang from "./moduleen/productCatalogLang.en"
import collectLang from "./moduleen/collectLang.en"
import masterSkuLang from "./moduleen/masterSkuLang.en"

//仓库模块
import storage from './moduleen/storage.en'

//包材管理
import material from './moduleen/material.en'
//品牌管理
import brand from './moduleen/brand.en'

// 员工列表
import member from "./moduleen/member.en"

// 角色
import role from "./moduleen/role.en"

// 合同
import purchase from "./moduleen/purchase.en"

// 订单
import order from "./moduleen/order.en"

// 本地SKU
import storageSku from "./moduleen/storageSku.en"

// 首页overview
import overView from "./moduleen/overview.en"

// 授权
import store from "./moduleen/store.en"

// 营销
import discount from "./moduleen/discount.en"

// 店铺商品搜索组件
import searchForm from "./moduleen/searchForm.en"

// 商品编辑页面
import toBeEdit from "./moduleen/toBeEdit.en"

// 商品列表组件
import commodityList from "./moduleen/commodityList.en"

// 在线商品页面
import onSale from "./moduleen/onSale.en"
import faild from "./moduleen/faild.en"
import task from './moduleen/task.en'
import copy from './moduleen/copy.en'
import cate from './moduleen/cate.en'
import viewStorageSku from "./moduleen/viewStorageSku.en"
import batchEdit from './moduleen/batchEdit.en'
import edit from "./moduleen/edit.en"

// 服务
import other from "./moduleen/other.en"

// 物流
import packages from "./moduleen/package.en"

import goodsCollection from "./moduleen/goodsCollection.en"
import productList from "./moduleen/productList.en"

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