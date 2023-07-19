import { UserInfo } from "@/vo/Users";
import { Key } from "react";

/**文章 */
export default interface Article {
    reason: string;
    id: Key;
    title?: string;
    seoTitle?: string;
    seoKeywords?: string;
    seoDescription?: string;
    preview?: string;
    description?: string;
    content?: string;
    articleTagIds?: string[];
    articleCategoryId?: string;
    articlePlatformId?: string;
    articleTagName?: string;
    pushPlatform?: string;
    userId?: string;
    user?: UserInfo;
    adminId?: string;
    author?: string;
    noName?: string;
    thumbPicId?: number;
    thumbPicUrl?: string;
    praiseNum?: number;
    commentNum?: number;
    readNumTrue?: number;
    readNum?: number;
    collectNum?: number;
    shareNum?: number;
    invitation?: string;
    integralNum?: number;
    auditStatus?: number;
    isDisables?: number;
    remark?: string;
    pushTime?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    isCollection?: boolean;
    isPraise?: boolean;
}

/**评论 */
export interface CommentProps {
    id: Key;
    userId: Key;
    type: string;
    otherId: Key;
    parentUserId: Key;
    firstId: Key;
    parentCommentId: Key;
    noName: number;
    nick: string;
    faceUrl: string;
    parentNick: string;
    content: string;
    refuseNum: number;
    praiseNum: number;
    commentNum: number;
    isShow: boolean;
    deleted: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    isRefuse: boolean;
    isRraise: boolean;
    children: CommentProps[];
}

/**系统消息 */
export interface SystemMessageProps {
    id: string;
    userId: string;
    otherId: string;
    integral: number;
    type: number;
    isSys: number;
    content: string;
    createdAt: string;
}

/**数据统计 */
export interface CountProps {
    id: string;
    type: number;
    totalNum: number;
    readNum: number;
    unreadNum: number;
    userId: string;
    createdAt?: string;
    updatedAt: string;
    deletedAt: string | null;
}

/**提问 */
export interface Question {
    id: string;
    title: string;
    seoTitle: string;
    seoKeywords: string;
    description: string;
    content: string;
    bbsTypeId: number;
    articleTagIds: string;
    type: boolean;
    thumbPicId: string;
    userId: string;
    author: string;
    noName: boolean;
    praiseNum: number;
    commentNum: number;
    readNumTrue: number;
    readNum: number;
    collectNum: number;
    shareNum: number;
    commentUserJson: string;
    isTop: boolean;
    isCream: boolean;
    isCheck: boolean;
    isDisables: boolean;
    invitation: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    seoDescription: string;
}

/**文章分类 */
export interface ArticleCategory {
    id: string;
    name?: string;
    category?: number;
    usageTimes?: string;
    actualTimes?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    sort?: number;
    isShow?: boolean;
}

/**标签 */
export interface TagsCategory {
    actualTimes: number;
    category: number;
    createdAt: string;
    deletedAt: string;
    id: string;
    isShow: boolean;
    name: string;
    sort: number;
    updatedAt: string;
    usageTimes: string;
}

export interface ArticleTagName {
    id: number;
    name: string;
}

/**文章详情 */
export interface ArticleDetails extends Omit<Article, "articleTagName"> {
    articleTagName?: ArticleTagName[];
    articleCategoryName?: string;
    articleCategoryArr?: string[];
}

