import { get, post, http } from '../util/request'

const Package = {
  submitPackage: (params) =>
    post('/forwardertms/forwarderPackage/addPackage', params), //提交包裹

  getPackageWarehouseList: (params) =>
    post('/forwardertms/forwarderWarehouse/warehouseList', params), //待打包货代商仓库列表

  bindForwarderList: (params) =>
    post('/forwardertms/forwarderSellerInfo/isbind-forwarder-list', params), //查询绑定信息

  setDefaultWarehouse: (p) =>
    post('/forwardertms/forwarderWarehouseDefault/set-default-warehouse', p), //设置默认仓库

  getFinanceMemberAccount: (p) => get('/acc/finance-member-account/get', p), //获取显示当前用户账户余额金额

  //---------------------

  getPackageList: (params) => get('/tms/package/used-list', params), //获取货代商列表

  submitPackageOld: (params) => post('/tms/fw/forwarder-package/add', params), //提交包裹---------------

  getList: (params) => post('/tms/fw/forwarder-package/list', params), // 获取包裹列表

  setExpressData: (params) =>
    post('/tms/fw/forwarder-package/update-express', params), // 修改快递单号

  addExpressData: (params) => post('/tms/package/add-express', params), // 增加快递单号

  deleteExpressData: (params) =>
    post('/tms/fw/forwarder-package/del-express', params), // 删除快递单号

  setRemark: (params) => post('/tms/package/seller-note', params), // 设置备注

  refuse: (params) => post('/tms/package/refuse', params), // 拒绝附加费

  agree: (params) => post('/tms/package/agree', params), // 接受附加费

  getDetailsList: (params) => post('/tms/package/opt-list', params), // 获取操作的详情

  getPackageProblem: (params) =>
    post('/tms/fw/forwarder-express-package/question-package-list', params), // 获取打包问题件

  replyProblem: (params) => post('/tms/package/question-reply', params), // 问题件回复

  changeSolveStatus: (params) =>
    post('/tms/fw/forwarder-express-package/sign-handle', params), //问题件的的状态修改

  appelShelve: (params) => post('/tms/package/add-as', params), // 申请搁置打包

  getWarehouse: (params) =>
    get('/tms/fw/forwarder-package/warehouse-list', params), // 获取仓库列表

  bindForwarder: (params) =>
    post('/tms/fw/forwarder-package/bind-forwarder', params), // 绑定自己货代商

  unBindForwarder: (params) =>
    post('/tms/fw/forwarder-package/unbind-forwarder', params), // 解绑货代商

  isBindForwarder: (params) =>
    post('/tms/fw/forwarder-package/is-bind', params), // 是否解绑-----------------------

  loginPackage: (params) =>
    post('/tms/fw/forwarder-package/third-party-login', params), // 第三方登录

  getForwarderList: (params) =>
    post('/tms/fw/forwarder-package/forwarder/list', params), // 获取货代商列表

  changeDefaultWarehouse: (params) =>
    post('/tms/fw/forwarder-package/forwarder/set-default-warehouse', params), //问题件的的状态修改------------

  returnGoods: (p) => post('/tms/package/apply/return/goods', p), //退货

  getPackageStatusType: (p) => post('/tms/fw/forwarder-package/get/type', p), //包裹状态

  refuseExpress: (p) => post('/tms/fw/forwarder-package/refuse-express', p), //拒收物流单号

  settingReminders: (p) => post('/tms/package/setting-reminders', p), //催单

  getPickupType: (p) => post('/order/order/shopee/order/getOrderSendType', p), // 获取打包类型

  setDefaultWarehouseOld: (p) =>
    post('/tms/fw/forwarder-package/forwarder/set-default-warehouse', p), //  设置默认仓库----------------

  cancelDefaultWarehouse: (p) =>
    post('/tms/fw/forwarder-package/forwarder/cancel-default-warehouse', p), //  取消默认仓库

  unpairedVariationSku: (p) =>
    post('/overseas/sea-sku/unpaired-variation-sku', p), // 产品列表-查询未绑定的本地sku

  manualPaired: (p) => post('/overseas/sea-sku/manual-paired', p), // 产品列表-手动配对
  modifyPaired: (p) => post('/overseas/sea-sku/modify-paired', p), // 产品列表-手动配对-修改

  unPaired: (p) => post('/overseas/sea-sku/un-paired', p), //产品列表-解除配对关系

  getseaSystemList: (p) =>
    post('/overseas/sea-system/not-exist-sea-system-list', p), //海外服务商列表

  getSeaEmpower: (p) => get('/overseas/sea-empower/page', p), //   获取海外服务商

  addSeaEmpower: (p) => post('/overseas/sea-empower/add', p), //    增加海外服务商

  editSeaEmpower: (p) => post('/overseas/sea-empower/edit', p), //   编辑海外服务商

  getSeaStockList: (p) => post('/overseas/sea-stock/list', p), //   海外仓sku库存列表

  getAuthorizationSystemList: (p) =>
    post('/overseas/sea-system/authorization-sea-system-list', p), //   获取服务商列表

  synchronizeStore: (p) => post('/overseas/sea-empower/synchronize-store', p), //  仓库授权-同步仓库

  synchronizeSkuStock: (p) =>
    post('/overseas/sea-sku/synchronize-sku-stock', p), //  产品列表-同步海外仓SKU与库存信息

  packageExport: (data) =>
    http({
      url: '/tms/package/erp-package-log-export',
      method: 'post',
      data,
      responseType: 'arraybuffer'
    }),
  addBatchPackage: (params) =>
    post('/forwardertms/forwarderPackage/addBatchPackage', params) //批量提交包裹
}
export default Package
