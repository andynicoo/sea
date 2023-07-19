import route from "./modulept/route.pt"
import navbar from "./modulept/navbar.pt"
import login from "./modulept/login.pt"
import form from "./modulept/form.pt"
import common from "./modulept/common.pt"


import productCatalogLang from "./modulept/productCatalogLang.pt"
import collectLang from "./modulept/collectLang.pt"
import masterSkuLang from "./modulept/masterSkuLang.pt"

//仓库模块
import storage from './modulept/storage.pt'

//包材管理
import material from './modulept/material.pt'
//品牌管理
import brand from './modulept/brand.pt'

// 员工列表
import member from "./modulept/member.pt"

// 角色
import role from "./modulept/role.pt"

// 合同
import purchase from "./modulept/purchase.pt"

// 订单
import order from "./modulept/order.pt"

// 本地SKU
import storageSku from "./modulept/storageSku.pt"

// 首页overview
import overView from "./modulept/overview.pt"

// 授权
import store from "./modulept/store.pt"

// 营销
import discount from "./modulept/discount.pt"

// 店铺商品搜索组件
import searchForm from "./modulept/searchForm.pt"

// 商品编辑页面
import toBeEdit from "./modulept/toBeEdit.pt"

// 商品列表组件
import commodityList from "./modulept/commodityList.pt"

// 在线商品页面
import onSale from "./modulept/onSale.pt"
import faild from "./modulept/faild.pt"
import task from './modulept/task.pt'
import copy from './modulept/copy.pt'
import cate from './modulept/cate.pt'
import viewStorageSku from "./modulept/viewStorageSku.pt"
import batchEdit from './modulept/batchEdit.pt'
import edit from "./modulept/edit.pt"

// 服务
import other from "./modulept/other.pt"

// 物流
import packages from "./modulept/package.pt"

import goodsCollection from "./modulept/goodsCollection.pt"
import productList from "./modulept/productList.pt"

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