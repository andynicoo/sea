/**行业洞察 */
export interface Report {
    id: string;
    title: string;
    seoTitle: string;
    seoKeywords: string;
    seoDescription: string;
    preview: string;
    description: string;
    content: string;
    reportTagIds: string;
    reportCategory: string;
    reportCategoryName: string;
    reportPlatformId: string;
    pushPlatform: number;
    userId: string;
    adminId: string;
    author: string;
    noName: number;
    thumbPicId: number;
    praiseNum: number;
    commentNum: number;
    readNumTrue: number;
    readNum: number;
    collectNum: number;
    shareNum: number;
    invitation: string;
    integralNum: number;
    auditStatus: number;
    isDisables: number;
    remark: string;
    pushTime: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    thumbPicUrl: string;
    downloadFee: number;
    reportOriginal: number;
    reportUrl: string;
    index?: number;
}



