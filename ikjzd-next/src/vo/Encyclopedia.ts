import { Key } from "react";
export default interface Encyclopedia {
    status: number;
    id: string;
    title: string;
    draft?: number;
    seoTitle?: string;
    seoKeywords?: string;
    seoDescription?: string;
    encyclopediaCategoryId?: string;
    encyclopediaCategoryName?: string;
    initials?: string;
    thumbUrl: string;
    summary: string;
    content: string;
    baseInfo?: BaseInfo[];
    refer?: EncyclopediaRefer[];
    encyclopediaId?: Key;
    reason?: string;
    adminId?: string;
    userId?: string;
    author?: string;
    collectNum?: number;
    praiseNum: number;
    readNum: number;
    commentNum: number;
    shareNum?: number;
    editNum?: number;
    isTop?: number;
    sort?: number;
    isDisables?: boolean;
    startTime?: string;
    deleted?: string;
    deletedAt?: string;
    isCollection?: boolean;
    isPraise?: boolean;
    createAuthor?: string;
    createdAt?: string;
    updateAuthor?: string;
    updatedAt?: string;
}

/**热门词条 */
export interface EncyclopediaHot {
    id: number;
    encyclopediaName: string;
    count: number;
}

export interface BaseInfo {
    content: string;
    title: string;
}

export interface EncyclopediaCategory {
    id?: string;
    title?: string;
    thumbUrl?: string;
    summary?: string;
    praiseNum?: number;
    readNum?: number;
    createdAt?: string;
}

export interface EncyclopediaRefer {
    dateTime: string;
    source: string;
    title: string;
    url: string;
}

export interface ActivityPlatform {
    id: Key;
    name: string;
    platformStatus: number;
    platformStatusName: string;
    platformSeotitle: string;
    platformTag: string;
    platformSeodescribe: string;
    platformDescription: string;
    platformBrief: string;
    specialDescription: string;
    storeRegistrationlink: string;
    courseLinks: string;
    resourceTools: string;
    platformBanner: any[];
    bannerLink: string;
    platformBackground: string;
    platformStore: string;
    platformIcon: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    supplierServiceType: string[];
    supplierServiceTypeDTO: SupplierServiceTypeDto[];
    supplierIndustrialBeltUrl: string;
}

export interface SupplierServiceTypeDto {
    id: string;
    name: string;
    sort: number;
    tag: string;
    pid: string;
    isShow: boolean;
    coinUrl: string[];
    navigation: string;
    type: string;
    seoTitle: string;
    seoKey: string;
    seoDescribe: string;
    description: string;
    remark: string;
    secondCategoryList: string;
}
