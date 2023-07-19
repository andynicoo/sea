/** 产业带 */
export interface IndustrialBelt {
    id: string;
    name: string;
    sort: number;
    tag: string;
    pid: string;
    isShow: boolean;
    coinUrl: any[];
    navigation: string;
    type: string;
    seoTitle: string;
    seoKey: string;
    seoDescribe: string;
    description: string;
    remark: string;
    secondCategoryList: IndustrialBelt[];
}

/**产业带区域 */
export interface IndustrialBeltArea {
    id: string;
    provinceCode: string;
    name: string;
    nickName: string;
    isShow: boolean;
    sort: number;
    categoryId: string;
    categoryName: string;
    coinUrl: string[];
    description: string;
    collectNum: number;
    praiseNum: number;
    commentNum: number;
    shareNum: number;
    deleted: boolean;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
}



/**服务商产品 */
export interface Product {
    id: string;
    name: string;
    price: number;
    status: string;
    description: string;
    detailDescription: string;
    supplierImages: string;
    supplierDescription: string;
    supplierId: string;
    supplierName: string;
    serviceType: string;
    serviceTypeName: string;
    servicePlatform: string[];
    serviceAreaName: string;
    servicePlatformName: string;
    serviceArea: number[];
    tag: string[];
    productImage: any[];
    readNum: number;
    realReadNum: number;
    collectNum: number;
    praiseNum: number;
    commentNum: number;
    shareNum: number;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
}

/** 服务商 */
export interface Store {
    id: string;
    account: string;
    name: string;
    establishDate: string;
    companyScale: string;
    companyUrl: any[];
    isShow: boolean;
    contractLink: string[];
    provinceCode: string;
    cityCode: string;
    areaCode: string;
    detailAddress: string;
    fullAddress: string;
    description: string;
    type: "SERVICE" | "INDUSTRIAL_BELT";
    serviceContent: ServiceContent[];
    industrialBeltId: string[];
    industrialBeltName: string[];
    contacts: string;
    phone: string;
    telephone: string;
    collectNum: number;
    praiseNum: number;
    commentNum: number;
    shareNum: number;
    deleted: boolean;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    isCollection: boolean;
}

/**服务内容 */
export interface ServiceContent {
    id: string;
    name: string;
    sort: number;
    tag: string;
    pid: string;
    isShow: boolean;
    coinUrl: any[];
    navigation: string;
    type: serviceContentType;
    seoTitle: string;
    seoKey: string;
    seoDescribe: string;
    description: string;
    remark: string;
    secondCategoryList: string;
}

type serviceContentType = /**服务商*/ "SERVICE" | /**产业带*/ "INDUSTRIAL_BELT";




