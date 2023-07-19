export interface DetailsAd {
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
    ids: string;
    adSiteId: number;
    picUrl: string;
    title: string;
    url: string;
    sort: string;
    remark: string;
    isDisables: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    pages: number;
}
export interface AdRecords {
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
