import { del, get, post } from '../util/request'

const Supplier = {
  getContractList: (p) => get('/supplier/contract/get/page', p), //获取合同列表

  addContractItem: (p) => post('/supplier/contract/add', p), //添加合同

  delContractItem: (p) => post('/supplier/contract/delete', p), //删除合同

  editContractItem: (p) => post('/supplier/contract/edit', p), //编辑合同

  previewContractItem: (p) => get('/supplier/contract/preview', p), //预览采购合同

  contractRelatedSupplier: (p) => post('/supplier/contract/related/supplier', p), //关联供应商

  getSupplierList: (p) => get("/supplier/info/get/page", p), // 供应商列表

  getSupplierItem: (id) => get(`/supplier/info/get/${id}`), // 供应商详情

  addSupplier: (p) => post("/supplier/info/add", p), // 新增供应商

  delSupplier: (id) => post("/supplier/info/delete", { id }), // 删除供应商

  editSupplier: (p) => post("/supplier/info/edit", p), // 编辑供应商

  editSupplierStatus: (p) => post("/supplier/info/edit/status", p), // 编辑供应商状态

  getSupplierProductList: (p) => get("/supplier/info/get/product/page", p), // 查询关联商品列表
}

export default Supplier