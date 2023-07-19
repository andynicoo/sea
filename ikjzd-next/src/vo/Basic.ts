import { Key } from "react";

/**菜单 */
export interface Menu {
    menuId: number;
    accSysCode: string;
    menuName: string;
    menuI18n: string;
    parentId: number;
    parentIds: string;
    sort: number;
    href: string;
    hrefType: number;
    menuType: string;
    visible: string;
    permission: string;
    icon: string;
    isShow: string;
    menuLevel: string;
    menuCode: string;
    status: string;
    children: Menu[];
    remark: string;
    iconUrl: string;
}

/**广告 */
export interface Advert {
    id: number;
    adSiteId: number;
    adSiteName: string;
    picUrl: string;
    title: string;
    url: string;
    sort: number;
    remark: string;
    isDisables: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

/**顾问 */
export interface AdvertDetail {
    id: string;
    name: string;
    headImg: string;
    qrCode: string;
    introduction: string;
    seoTitle: string;
    seoKeywords: string;
    status: boolean;
    sort: number;
    details: string;
    praiseNum: number;
    commentNum: number;
    readNumTrue: number;
    readNum: number;
    collectNum: number;
    shareNum: number;
    deleted: boolean;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
}

/**区域 */
export interface Area {
    id?: Key;
    code?: string;
    value?: string;
    name?: string;
    pid?: number;
    createAt?: string;
    iconUrl?: string;
}

/**服务分类 */
export interface ServerType {
    id: string;
    name: string;
    sort: number;
    tag: string;
    pid: string;
    isShow: boolean;
    coinUrl: string;
    navigation: string;
    type: string;
    seoTitle: string;
    seoKey: string;
    seoDescribe: string;
    description: string;
    remark: string;
    secondCategoryList: any[];
}

/**行业分类 */
export interface IndustryCategory {
    records: any[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    countId: string;
    maxLimit: string;
    id: string;
    code: string;
    iconUrl: string;
    value: string;
    name: string;
    pid: string;
    createAt: string;
    pages: number;
}

/**24小时快讯 */
export interface News {
    id: string;
    title: string;
    seoTitle: string;
    seoKeywords: string;
    seoDescription: string;
    description: string;
    content: string;
    articleTagIds: string[];
    articlePlatformId: string;
    thumbPicId: number;
    userId: string;
    adminId: string;
    author: string;
    praiseNum: number;
    commentNum: number;
    readNumTrue: number;
    readNum: number;
    collectNum: number;
    shareNum: number;
    isDisables: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    nextDate: string;
    nextId: number;
    nextName: string;
    prefixDate: string;
    prefixId: number;
    prefixName: string;
}

/**社交群 */
export interface SnsConfig {
    id: number;
    snsName: string;
    snsNum: string;
    snsQrCode: string;
    snsUrl: string;
    snsType: number;
    useWhere: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

/** 服务商 */
export interface Server {
    id: string;
    name: string;
    price: number;
    status: string;
    description: string;
    detailDescription: string;
    supplierId: string;
    supplierName: string;
    serviceType: string;
    serviceTypeName: string;
    servicePlatform: string[];
    serviceAreaName: string;
    servicePlatformName: string;
    serviceArea: string[];
    tag: any[];
    productImage: string[];
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

//评论回复信息
export interface UserCommentItem {
    id?: string;
    userId?: string;
    type?: string;
    otherId?: string;
    parentUserId?: string;
    firstId?: string;
    parentCommentId?: string;
    noName?: number;
    nick?: string;
    faceUrl?: string;
    parentNick?: string;
    content?: string;
    refuseNum?: number;
    praiseNum?: number;
    commentNum?: number;
    isShow?: boolean;
    deleted?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    isRefuse?: string;
    isRraise?: string;
    children?: UserCommentItem[];
}