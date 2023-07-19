import { del, get, post } from '../util/request'

export default {
    addPurchasePlan: (data) => post("/purchase/plan/add", data), // 加入采购计划

    getContractList: (p) => get('/supplier/contract/get/page', p),

    addContract: (p) => post('/supplier/contract/add', p), // 添加合同

    deleteContract: (p) => post('/supplier/contract/delete', p), // 删除合同

    editContract: (p) => post('/supplier/contract/edit', p), // 编辑合同

    getContractOne: (p) => get('/supplier/contract/get', p), // 获取单个合同
    
    getSupplierLists: (p) => get('/product/supplier/list', p), // 获取关联供应商列表

    getSupplierList: (p) => get('/product/supplier/get/page', p), // 供应链分页

    getSupplierOne: (id) => get('/product/supplier/get/' + id), // 获取单个供应商

    deleteSupplierOne: (p) => post('/product/supplier/delete', p), // 删除供应商

    addSupplier: (p) => post("/product/supplier/add", p), // 添加供应商

    editSupplier: (p) => post("/product/supplier/edit", p), // 编辑供应商

    getSupplierByContractId:(p) => get("/supplier/contract/get/related/supplier", p), // 根据合同ID查询关联供应商
    
    relatedSupplier:(p) => post("/supplier/contract/related/supplier", p), // 根据合同id，供应商id进行关联
    
    deleteSupplier: (p) => post("/supplier/contract/delete/related/supplier", p), // 删除已关联供应商

    getProductList: (p) => get('/product/supplier/get/product/page', p), // 关联商品列表

    deleteProduct: (p) => post("/product/supplier/delete/relation/supplier", p), // 关联商品删除

    editProduct: (p) => post("/product/supplier/edit/relation/supplier", p), // 关联商品编辑

    changeSupplier: (p) => post("/product/supplier/update/default/supplier", p), // 更改默认供应商

}