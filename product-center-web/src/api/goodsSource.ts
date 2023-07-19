import { post, get } from '@/api';
import { QueryParams, ResponseDataVO, ResponseVO } from '@/vo/baseVo';
import { AdditionSpecInfo, productCategoryVo, ProductCategoryVo, ProductDetailsVo, productNumVo, ProvinceListInfo, SpecsInfoVo } from '@/vo/goodsSourceVo';

//商品分类
export const allCategory = (): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/orderproduct/management/category/all/category`, '{}');

//商品列表查询
export const productInfoList = (params: QueryParams): Promise<ResponseVO<any>> => post(`/productcenter/productInfo/list`, params);

//商品组合列表查询
export const pageCombinationProduct = (params: QueryParams): Promise<ResponseVO<any>> => post(`/productcenter/productInfo/pageCombinationProduct`, params);

//商品数量统计
export const productInfoStatistics = (params: QueryParams): Promise<ResponseVO<productNumVo>> => post(`/productcenter/productInfo/list/statistics`, params);

//商品列表导出
export const productInfoExport = (parama: any): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/productcenter/productInfo/export`, parama, { responseType: 'arraybuffer' });
// 商品价格导出
export const priceModelExport = (parama: any): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/productcenter/productInfo/priceModelExport`, parama, { responseType: 'arraybuffer' });

// 导出/导入记录查询
export const exportRecord = (parama: QueryParams, menuId: string): Promise<ResponseDataVO<any>> => post(`/productcenter/excelImportExportLog/list`, parama, { headers: { menuId } }).then((res) => res.data);

// 导入文件
export const importProductInfoPrice = (parama: any): Promise<ResponseVO<any>> => post(`/productcenter/excelImportExportLog/importProductInfoPrice`, parama);

//新增/修改商品基础信息
export const productInfoSave = (params: any): Promise<ResponseVO<any>> => post(`/productcenter/productInfo/save`, params);

//修改销售商品基础信息
export const productInfoClientSave = (params: any): Promise<ResponseVO<any>> => post(`/productcenter/productInfo/client/edit`, params);

//商品详情
export const productInfoDetail = (id: string): Promise<ResponseVO<ProductDetailsVo>> => get(`/productcenter/productInfo/detail?id=${id}`);

//推送商品
export const productInfoPublish = (params: { productIds: string[]; enterpriseIds: string[] }): Promise<ResponseVO<any>> => post(`/productcenter/productInfo/publish`, params);

//商品类目分页列表
export const productCategoryGetPage = (params: QueryParams): Promise<ResponseVO<ResponseDataVO<ProductCategoryVo>>> => post(`/productcenter/productCategory/getPage`, params);

//上下架
export const upperOrLower = (params: any): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/productcenter/productInfo/upperOrLower`, params);

//修改上架
export const clientEditClient = (params: any): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/productcenter/productInfo/client/editClient`, params);

//规格列表
export const productBaseSpecsGetPage = (params: QueryParams): Promise<ResponseVO<SpecsInfoVo>> => post(`/productcenter/productBaseSpecs/getPage`, params);

//规格自定义分组列表
export const productBaseCombinationSpecsGetPage = (params: QueryParams): Promise<ResponseVO<any>> => post(`/productcenter/productBaseCombinationSpecs/getPage`, params);

//同步商品规格
export const pushProductInfo = (params: any): Promise<ResponseVO<ResponseDataVO<any>>> => post(`/productcenter/productInfo/pushProductInfo`, params);

//美国全州
export const productInfoStateList = (params: string): Promise<ResponseVO<ProvinceListInfo[]>> => get(`/productcenter/productInfo/state/list?countryCode=` + params);

//根据商品规格id查询附加规格列表
export const productAdditionSpecListSpecId = (params: any): Promise<ResponseVO<AdditionSpecInfo[]>> => post(`/productcenter/productAdditionSpec/list/specId`, params);

//删除商品
export const productInfoDelete = (id: string): Promise<ResponseVO<ResponseDataVO<any>>> => get(`/productcenter/productInfo/delete?id=` + id);

//通过分类查询属性、属性组
export const getProductAttribute = (params: { productCategoryList: string[] }): Promise<ResponseVO<productCategoryVo[]>> => post(`/productcenter/productAttributeCategory/get/productAttribute`, params);

//通过属性值查询规格
export const getSpecsByAttribute = (params: { productAttributeIdList: string[] }): Promise<ResponseVO<SpecsInfoVo[]>> => post(`/productcenter/productBaseSpecs/getSpecsByAttribute`, params);

//批量分配归属人
export const modifyAttribution = (params: QueryParams): Promise<ResponseVO<SpecsInfoVo>> => post(`/productcenter/productInfo/modify/attribution`, params);
