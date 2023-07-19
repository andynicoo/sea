export interface QueryTrademarkNameParams {
  /** 分类 */
  catetoryNum: string;
  /** 国家 */
  countryCode: string;
  /** 商标名 */
  trademarkName: string;
}
export interface QueryTrademarkNameRes {
  tbTrademarkCustomWordsList: {
    createTime: string;
    id: number;
    trademarkCategory: string;
    trademarkName: string;
    trademarkNameEn: string;
    type: number;
    updateTime: string;
  }[];
  trademarkSearchCheckResultList: {
    isLast?: any;
    ownerName?: string;
    categoryBig: string;
    categorySmall: string;
    countryCode: string;
    createTime: string;
    dimension: string;
    dimensionName: string;
    id: number;
    maxSimilarity: number;
    overallSimilarity: number;
    passRate: number;
    queryCategory: string;
    queryCategoryName: string;
    queryItem: string;
    remark: string;
    searchItem: string;
    similarTm: string;
    similarTmSimilarity: number;
    similarTmStatus: string;
    type: string;
    typeName: string;
    updateTime: string;
    remarkNumber: string;
  }[];
  trademarkSearchCheckCategortyName: string;
}
