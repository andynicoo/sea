import { Key } from "react";

export interface UserInfo {
    id: number;
    userId: string;
    mobile: string;
    password: string | null;
    nick: string;
    name: string;
    email: string;
    emailShow: boolean;
    company: string;
    wechat: string;
    wechatShow: boolean;
    wechatImg: string | null;
    sex: boolean;
    sign: string;
    individualResume: string;
    type: boolean;
    avatar: string;
    personalCenterBackground: string;
    level: number;
    integral: number;
    exponent: number;
    admire: number;
    fansNum: number;
    posts: number;
    articleNum: number;
    replyPosts: number;
    serviceNum: number;
    loginDay: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    bindMobile: string | null;
    readNum: number;
    isFans: boolean;
}

export interface GetDynamicInfoParams {
    current?: number;
    size?: number;
    type?: number;
}

export interface ContributionUser {
    userId: number;
    nick: string;
    avatar?: string;
    encyclopediaCount: number;
    integral: number;
}

export interface getOpusParms {
    page?: number;
    pageSize?: number;
    current?: number;
    size?: number;
    keyword?: string;
    type?: string;
    status?: string;
    auditStatus?: string;
    userId?: string
    progress?: string,
    id?: number,
    cancelStatus?: number,
}
export interface getCountParms {
    userId?: number;
}

export interface CountSource<T = any> {
    data: T[]
}

type activitieKey =
    "signingUp" /*报名中*/ |
    "processing" /*进行中*/ |
    "ended" /*已结束*/ |
    "pendingReview" /*待审核*/ |
    "reviewed" /**已审核 */ |
    "turnDown" /**驳回 */ |
    "noReview" /**无需审核 */;

export interface ActivitiesCountItem {
    key: activitieKey;
    name: string;
    count: number;
}


export interface ActivitiesPramas {
    title: string;
    poster: string;
    activityPlatformId: string;
    activityTime: string[];
    areaCode: string[];
    address: string;
    type: string;
    isLogin: string;
    content: string;
    otherInfo: string;
    mobile: string;
    qq: string;
    ticket: Ticket[];
    startTime: string;
    endTime: string;
    province: string;
    city: string;
    area: string;
}

interface Ticket {
    name: string;
    price: number;
    pubNum: number;
    ticketsTimeFlag: boolean;
    startTime: string;
    endTime: string;
    ticketsTime?: string[];
}

/**新增修改我的资源 */
export interface AddResourcesParams {
    title: string;
    url: string;
    toolsPlatformId: string;
    resourceType: string;
    integralNum: number;
    content: string;
}

/**活动详情 */
export interface TicketsProps {
    id?: string,
    activityId?: string,
    name?: string,
    price?: number,
    pubNum?: number,
    applyNum?: number,
    startTime?: string,
    endTime?: string,
    ticketsTimeFlag?: boolean
}

/**申请成为主办方 */
export interface AddSponsorParams {
    name: string;
    address: string;
    mobile: string;
    contacts: string;
    mobileCode: string;
    reason: string;
    addCode?: string[];
}


/**资源列表信息 */
export interface Resources {
    id: number;
    title: string;
    seoTitle: string;
    seoKeywords: string;
    description: string;
    content: string;
    toolsPlatformId: number;
    toolsPlatformName: string;
    resourceType: number;
    thumbPicId: string;
    thumbPicUrl: string;
    userId: string;
    author: string;
    noName: string;
    enclosureId: string;
    enclosureUrl: string;
    enclosureName: string;
    enclosureSize: string;
    praiseNum: string;
    commentNum: string;
    readNumTrue: string;
    readNum: string;
    collectNum: string;
    shareNum: string;
    enclosureDownloadNum: number;
    integralNum: number;
    isDisables: string;
    isCheck: string;
    invitation: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    reportOriginal: 0 | 1;
    downloadFee: number;
}

/**资源所属平台返回参数 */
export interface PlatformListProps {
    id?: number;
    name?: string;
};

/**资源详情接口返回参数 */
export interface ResourcesDataProps {
    id?: number;
    title?: string;
    enclosureUrl?: string;
    enclosureName?: string;
    enclosureSize?: string;
    content?: string;
    toolsPlatformId?: string;
    resourceType?: number;
    integralNum?: number;

}


/**我的申请 */
export interface SponsorListRecords {
    id: string;
    userId: string;
    name: string;
    address: string;
    mobile: string;
    contacts: string;
    reason: string;
    reject: string;
    status: number;
    auditAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface Sponsor {
    id: string;
    userId: string;
    name: string;
    address: string;
    mobile: string;
    contacts: string;
    reason: string;
    reject: string;
    status: number;
    auditAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

/**活动 */
export interface Activity {
    id: string;
    userId: string;
    userName: string;
    activityTicketsDTOList: activityTicketsDTO[];
    activityPlatformId: string;
    applicant: string,
    applicantMobile: string,
    otherInfo: string;
    isLogin: string;
    qq: string;
    mobile: string;
    title: string;
    poster: number;
    posterUrl: string;
    type: number;
    province: string;
    city: string;
    area: string;
    areaCode: string[];
    address: string;
    content: string;
    applyNum: number;
    collectNum: number;
    cancelStatus: number;
    auditStatus: number;
    reason: string;
    minPrice: number;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    name: string;
    price: number;
    pubNum: number;
    isJoin: boolean;
    isCollection: boolean;
    activityPrescriptionName?: string
}

/**举办活动用户信息 */
export interface ActivityUser {
    status: string;
    count: string;
    userId: string;
    pushCount: number;
    applyNum: number;
    avatar: string;
    nick: string;
    isFans: boolean;
}

/**活动峰会票种信息 */
export interface activityTicketsDTO {
    id: string;
    activityId: string;
    name: string;
    price: number;
    pubNum: number;
    applyNum: number;
    startTime: string;
    endTime: string;
}

/**活动峰会报名信息 */
export interface ActivityApply {
    id: string;
    activityId: string;
    activityTicketsId: string;
    userId: string;
    signCode: string;
    name: string;
    mobile: string;
    qq: string;
    companyName: string;
    companyIndustry: string;
    otherInfo: string;
    orderNo: string;
    payable: number;
    realPay: number;
    unitPrice: number;
    num: number;
    payType: number;
    payStatus: number;
    cancelStatus: number;
    remark: string;
    isSign: number;
    payTime: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    ids: string;
}

/**专家专栏用户数据 */
export interface Expert {
    userId: Key;
    pushSum: number;
    readSum: number;
    avatar: string;
    nick: string;
}


/**评论请求参数 */
export interface CommentPublishProps {
    content?: string;
    otherId?: Key;
    type?: number;
    parentCommentId?: Key;
    firstId?: Key;
    parentUserId?: Key;
    parentNick?: string;
    nick?: string;
    faceUrl?: string;
}
/**评论请求参数 */
export interface CommentPraiseProps {
    commentId: Key,
    type: Key,
    userId: Key,
}

/**文章各状态数量 */
export interface ArticleCountInfo {
    key: string;
    name: string;
    value: number;
    number: number;
}

/**百科各状态数量 */
export interface BaikeCountInfo {
    desc: string;
    count: number;
    status: number;
}