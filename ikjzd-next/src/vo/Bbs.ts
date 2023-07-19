/**帖子平台分类 */
export interface BbsType {
    id: number;
    name: string;
}

/**帖子实体 */
export interface Bbs {
    id: string;
    avatar: string;
    title: string;
    seoTitle: string;
    seoKeywords: string;
    description: string;
    bbsTypeName: string;
    content: string;
    bbsTypeId: string;
    articleTagIds: string;
    type: number;
    thumbPicId: string;
    userId: string;
    author: string;
    noName: string;
    praiseNum: number;
    commentNum: string | number;
    readNumTrue: string;
    readNum: number;
    collectNum: string | number;
    shareNum: string | number;
    commentUserJson?: string;
    isTop: string;
    isCream: string;
    isCheck: string;
    isDisables: string;
    invitation: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    seoDescription: string;
    individualResume: string;
    isCollection?: boolean;
    isPraise?: boolean;
}

