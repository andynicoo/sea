/**出海百问分类 */
export interface QuestionCategory {
    id: number;
    pid: number;
    level: number;
    levels: string;
    name: string;
    sort: number;
    label: string;
    seoTitle: string;
    seoKeywords: string;
    seoDescribe: string;
    serviceDescribe: string;
    remarks: string;
    status: boolean;
    deleted: boolean;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    lowerHundredQuestionCategoryDTO: QuestionCategory[];
}

/**出海百问 */
export interface Question {
    id: string;
    categoryId: number;
    categoryName: string;
    name: string;
    seoTitle: string;
    seoKeywords: string;
    seoDescribe: string;
    author: string;
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
    authorName: string;
    authorAvatar: string;
    isCollection?: boolean;
    isPraise?: boolean;
}

