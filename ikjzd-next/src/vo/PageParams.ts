/**分页请求参数 */
export interface PageParams {
    current?: number | string;
    size?: number | string;
    [key: string]: any;
}

/**分页响应参数 */
export interface PageSource<T = any> {
    records: T[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    countId: string | null;
    maxLimit: string | null;
    pages: number;
}

/**Headers */
interface Headers {
    authorization: string;
}
export interface AxiosHeaders {
    headers: Headers;
}

export interface  AdSiteKey{
    adSiteKey: string | number;
    size?: number;
    current?: number;
}