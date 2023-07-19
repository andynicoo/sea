import { Key } from "react";


/**区域 */
export interface AreaListInfo {
    id: string;
    name: string;
    shopSimpleDTOList: ShopSimpleDtoList[];

}
export interface ShopSimpleDtoList {
    id: string;
    regionId: number;
    iconUrl: string;
    thumbPicUrl: string;
}

/**平台信息 */
export interface PlatformInfo {
    id: string;
    name: string;
    title: string;
    seoTitle: string;
    seoKeywords: string;
    description: string;
    regionId: string;
    iconUrl: string;
    thumbPicUrl: string;
    registerUrlTime: string;
    isOuter: boolean;
    outerUrl: string;
    platformDetails: string;
    applyModule: string;
    topicId: string;
    sort: number;
    isRecommend: boolean;
    isDisables: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

//店铺详情
export interface StoresDetailsVO {
    id?: string;
    name?: string;
    title?: string;
    seoTitle?: string;
    seoKeywords?: string;
    description?: string;
    regionId?: string;
    iconUrl?: string;
    thumbPicUrl?: string;
    registerUrlTime?: string;
    isOuter?: boolean;
    outerUrl?: string;
    platformDetails?: string;
    applyModule?: string;
    topicId?: string;
    sort?: number;
    isRecommend?: boolean;
    isDisables?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
export interface StoresBannerInfo {
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

export interface StoresBannerSours<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    countId: string;
    maxLimit: string;
    id: string;
    ids: string;
    adSiteId: string;
    picUrl: string;
    title: string;
    url: string;
    sort: string;
    remark: string;
    isDisables: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    adSiteKey: string;
    pages: number;
}




