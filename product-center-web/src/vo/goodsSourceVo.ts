
//商品详情
export interface ProductSpecsDTOList {
    id: string;
    productInfoId: string;
    specsName: string;
    specsCode: string;
    specsStatus: string;
    servicePrice: number;
    originalPrice: number;
    minimumPrice: number;
    grossProfitMargin: number;
    priceRangeMin: number;
    priceRangeMax: number;
    isRequired: string | boolean;
    createTime: string;
    updateTime: string;
    createBy: number;
    createName: string;
    updateBy: number;
    updateName: string;
    productCategoryId:string;
    isSupportRenew?:string;
}

export interface ProductDetailsVo {
    id: string;
    productName: string;
    productCode: string;
    currency: string;
    countryCode: string;
    countryCodeName: string;
    productCategoryId: string;
    productCategoryName: string;
    serviceContext: string;
    productImagePc: string;
    productImageH5: string;
    productDetailsPc: string;
    productDetailsH5: string;
    productImageMarketing:string;
    isCombinationProduct: string;
    parentProductId: number;
    isPush: string;
    enterpriseId: number;
    productStatus: string;
    renewProductId: number;
    productSalesVolume: number;
    permanentInvalidReason: string;
    sourceId: number;
    createTime: string;
    updateTime: string;
    createBy: string;
    createName: string;
    updateBy: number;
    updateName: string;
    productSpecsDTOList: ProductSpecsDTOList[];
    productCombinationSpecsDTOList: any[];
    productInfoDTOList: ProductDetailsVo[];
    selector: string;
    provinceCode:string;
    productInfoAttributeRelationDTOList:ProductInfoAttributeRelationDTOList[];
    displayMethod:string;
    purchaseInstructions:string;
    isRenewProduct:string;
}
export interface ProductInfoAttributeRelationDTOList {
	id: string;
	productInfoId: string;
	attributeTypeId: string;
	productAttributeId: string;
	sort: string;
	productCategoryId: string;
	productCategoryName: string;
	subProductCategoryName: string;
	attributeTypeName: string;
	attributeName: string;
    productAttributeList:any;
    defaultValue:string[];
    label:string;
    value:string;
    subProductCategoryId:string;
}
//商品类目信息
export interface ProductCategoryVo {
    id: string;
    categoryName: string;
    parentId: string;
    code: string;
    status: string;
    functionCode: number;
    createTime: string;
    updateTime: string;
    createBy: string;
    createName: string;
    updateBy: number;
    updateName: string;
    categoryCode: string;
    deleted: boolean;
    childrenProductCategory: any[];
}

//商品数量
export interface productNumVo {
    IS_COMBINATION_PRODUCT: string;
    NOT_COMBINATION_PRODUCT: string;
    IS_RENEW_PRODUCT: string;
}

//商品规格
export interface SpecsInfoVo {
    id: string;
    specsName: string;
    specsCode: string;
    specsStatus: string;
    productCategoryId: string;
    productCategoryName: string;
    subProductCategoryName: string;
    createTime: string;
    updateTime: string;
    createBy: string;
    createName: string;
    updateBy: number;
    updateName: string;
    deleted: boolean;
    specId?: string;
    isSupportRenew?:string;
}

//美国州
export interface ProvinceListInfo {
	code: string;
	nameCN: string;
	nameEN: string;
}

//附加规格信息
export interface AdditionSpecInfo {
	id: string;
	templateName: string;
	specId: string;
	specsName: string;
	specType: string;
	calcType: string;
	specDetailDTOList: any[];
	createTime: string;
	updateTime: string;
	createBy: string;
	createName: string;
	updateBy: string;
	updateName: string;
	deleted: boolean;
	productCategoryName: string;
}

//分类id查询商品属性
export interface ProductAttributeList {
	id: string;
	productCategoryId: string;
	attibuteTypeId: string;
	attributeName: string;
	attributeCode: string;
	attributeStatus: string;
	createTime: string;
	updateTime: string;
	createBy: string;
	createName: string;
	updateBy: string;
	updateName: string;
	deleted: boolean;
    value: string;
    label: string;
}

export interface productCategoryVo {
	id: string;
	attributeTypeName: string;
	attributeTypeStatus: string;
	productCategoryId: string;
	productCategoryName: string;
	subProductCategoryName: string;
	createTime: string;
	createBy: string;
	updateBy: string;
	updateName: string;
	code: string;
	updateTime: string;
	createName: string;
	productAttributeList: ProductAttributeList[];
    defaultValue:string[];
    sort:number;
}

export interface AttributeHandleVo {
	productCode: string;
	productCategory: string;
	records: any;
	productSpecsDTOList: any;
    // subProductCategoryId:string;
}
