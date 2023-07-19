import route from "./modulezhtw/route.zhtw"
import navbar from "./modulezhtw/navbar.zhtw"
import login from "./modulezhtw/login.zhtw"
import form from "./modulezhtw/form.zhtw"
import common from "./modulezhtw/common.zhtw"


import productCatalogLang from "./modulezhtw/productCatalogLang.zhtw"
import collectLang from "./modulezhtw/collectLang.zhtw"
import masterSkuLang from "./modulezhtw/masterSkuLang.zhtw"

//仓库模块
import storage from './modulezhtw/storage.zhtw'

//包材管理
import material from './modulezhtw/material.zhtw'
//品牌管理
import brand from './modulezhtw/brand.zhtw'

// 员工列表
import member from "./modulezhtw/member.zhtw"

// 角色
import role from "./modulezhtw/role.zhtw"

// 合同
import purchase from "./modulezhtw/purchase.zhtw"

// 订单
import order from "./modulezhtw/order.zhtw"

// 本地SKU
import storageSku from "./modulezhtw/storageSku.zhtw"

// 首页overview
import overView from "./modulezhtw/overview.zhtw"

// 授权
import store from "./modulezhtw/store.zhtw"

// 营销
import discount from "./modulezhtw/discount.zhtw"

// 店铺商品搜索组件
import searchForm from "./modulezhtw/searchForm.zhtw"

// 商品编辑页面
import toBeEdit from "./modulezhtw/toBeEdit.zhtw"

// 商品列表组件
import commodityList from "./modulezhtw/commodityList.zhtw"

// 在线商品页面
import onSale from "./modulezhtw/onSale.zhtw"
import faild from "./modulezhtw/faild.zhtw"
import task from './modulezhtw/task.zhtw'
import copy from './modulezhtw/copy.zhtw'
import cate from './modulezhtw/cate.zhtw'
import viewStorageSku from "./modulezhtw/viewStorageSku.zhtw"
import batchEdit from './modulezhtw/batchEdit.zhtw'
import edit from "./modulezhtw/edit.zhtw"

// 服务
import other from "./modulezhtw/other.zhtw"

// 物流
import packages from "./modulezhtw/package.zhtw"

import goodsCollection from "./modulezhtw/goodsCollection.zhtw"
import productList from "./modulezhtw/productList.zhtw"

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