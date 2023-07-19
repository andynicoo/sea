import { post, get } from "@/api"
import { QueryParams, ResponseDataVO, ResponseVO } from "@/vo/baseVo";
import { AppcenterInfo, PartnersForm, PartnersInfo, WebsiteInfo } from "@/vo/saasManageVo";
import { ScPaymentOrderDetailVo, SupplierInfoVo } from "@/vo/settlementCenterVo";

//供应商列表查询
export const supplierList = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<SupplierInfoVo>>> => post(`/settlementcenter/management/base/supplier/page/list`, parama);




//供应商同步
export const supplierSync = (): Promise<ResponseVO<any>> => get(`/settlementcenter/management/base/supplier/sync`);

//供应商详情
export const supplierDetail = (id:string): Promise<ResponseVO<SupplierInfoVo>> => get(`/settlementcenter/management/base/supplier/detail?id=`+ id);

//供应商修改
export const supplierSave = (parama: QueryParams): Promise<ResponseVO<any>> => post(`/settlementcenter/management/base/supplier/save`,parama);


//新增/修改结算配置
export const supplierBatchSave = (params: any): Promise<ResponseVO<any>> => post(`/settlementcenter/management/base/supplier/batch/save`, params);



//付款单列表
export const scPaymentOrderDetailList = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scPaymentOrder/pageScPaymentOrder`, parama);

//付款单列表导出
export const scPaymentOrderExport = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scPaymentOrder/export`, parama,{ responseType: 'arraybuffer' });


//付款单审核
export const scPaymentOrderApproved = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scPaymentOrder/approved`, parama);

// //付款单取消
// export const scPaymentOrderDelete = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scPaymentOrder/delete`, parama);
//取消付款单
export const scPaymentOrderCancel = (parama: QueryParams): Promise<ResponseVO<any>> => post(`/settlementcenter/scPaymentOrder/cancel`,parama);
 

//付款单确认付款
export const scPaymentOrderConfirm = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scPaymentOrder/confirm`, parama);
//批量付款单确认付款
export const scPaymentOrderConfirmBatch = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scPaymentOrder/confirm/batch`, parama);


//付款单新增付款单
export const scPaymentOrderAdd = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scPaymentOrder/add`, parama);

//分页获取付款订单详情
export const pageScPaymentOrderDetail = (parama: QueryParams): Promise<ResponseVO<ScPaymentOrderDetailVo>> => post(`/settlementcenter/scPaymentOrder/detail`, parama);

//修改付款单
export const scPaymentOrderUpdate = (parama: QueryParams): Promise<ResponseVO<ScPaymentOrderDetailVo>> => post(`/settlementcenter/scPaymentOrder/update`, parama);







//采购订单查询
export const scPurchaseOrderGetPage = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scPurchaseOrder/getPage`, parama);

//下载模板
export const downloadTemplate = (): Promise<ResponseVO<SupplierInfoVo>> => get(`/settlementcenter/scPurchaseOrder/downloadTemplate`,{ responseType: 'arraybuffer' });

//结算明细列表
export const scPurchaseOrderDetaiGlGetPage = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scPurchaseOrderDetail/getPage`, parama);

// //结算明细列表
// export const scSupplierConfigNodeList = (parama: string): Promise<ResponseVO<any>> => get(`/settlementcenter/scSupplierConfig/node/list?`+parama);

//新增/修改结算配置
export const scSupplierConfigBatchSave = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/settlementcenter/scSupplierConfig/batch/save`, parama);


//服务国家及业务分类配置
export const updateCountryCategory = (parama: QueryParams): Promise<ResponseVO<any>> => post(`/settlementcenter/management/base/supplier/update/countryCategory`,parama);

//服务商分类节点信息
export const supplierNodeList = (parama: string): Promise<ResponseVO<any>> => get(`/settlementcenter/management/base/supplier/node/list?`+parama);

//修改采购日期
export const updatePurchaseDate = (parama: QueryParams): Promise<ResponseVO<any>> => post(`/settlementcenter/scPurchaseOrder/update/purchaseDate`,parama);

//修改采购日期
export const purchaseOrderStatistics = (parama: QueryParams): Promise<ResponseVO<any>> => post(`/settlementcenter/scPurchaseOrder/list/statistics`,parama);


//生成结算明细（ERP存量待结算数据）
export const generatePurchaseOrderHistory = (parama: QueryParams): Promise<ResponseVO<any>> => post(`/settlementcenter/scPurchaseOrder/generatePurchaseOrder/history`,parama);

//更新数据
export const scPurchaseOrderUpdate = (): Promise<ResponseVO<any>> => get(`/settlementcenter/scPurchaseOrder/update/calc`);





