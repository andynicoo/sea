import Axios, { Response } from "@/apis";
import Article, { CommentProps, CountProps, Question, SystemMessageProps } from "@/vo/Article";
import Encyclopedia, { ActivityPlatform } from "@/vo/Encyclopedia";
import { PageParams, PageSource } from "@/vo/PageParams";
import { ActivitiesCountItem, AddSponsorParams, PlatformListProps, ResourcesDataProps, Sponsor, Resources, Activity, UserInfo, Expert, CommentPublishProps, CommentPraiseProps, ArticleCountInfo, BaikeCountInfo } from "@/vo/Users";
import { Key } from "react";

/**获取我的资源 */
export const getResources = (params: PageParams): Promise<Response<PageSource>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdTools/page", params);

/**获取所有资源所属平台 */
export const listToolsPlatform = (): Promise<Response<PlatformListProps[]>> => Axios.post("/kjzdUser/kjzdIgnore/listToolsPlatform", {});

/**获取单个资源 */
export const getKjzdTools = (params?: { id: string }, token?: string): Promise<Response<ResourcesDataProps>> => Axios.post("/kjzdUser/kjzdTools/getKjzdTools", params, token ? { headers: { authorization: `Bearer ${token}` } } : {});

/**新增资源 */
export const addKjzdTools = (params: ResourcesDataProps): Promise<Response> => Axios.post("/kjzdUser/kjzdTools/addKjzdTools", params);

/**编辑资源 */
export const updateKjzdTools = (params: ResourcesDataProps): Promise<Response> => Axios.post("/kjzdUser/kjzdTools/updateKjzdTools", params);

/**总阅读获赞获评 */
export const getKjzdUserNewsCount = (params: PageParams): Promise<Response<CountProps[]>> => Axios.post("/kjzdUser/kjzdUserNewsCount/info", params);

/**获取文章 */
export const getKjzdArticle = (params: PageParams): Promise<Response<PageSource<Article>>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdUsers/kjzdArticle/getPage", params);

/**用户提问 */
export const getKjzdQuestion = (params: PageParams): Promise<Response<PageSource<Question>>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdBbs/list", params);

/**百科列表 */
export const getKjzdEncyclopedia = (params: PageParams): Promise<Response<PageSource<Encyclopedia>>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdUsers/kjzdEncyclopedia/list", params);

/**资源列表 */
export const getKjzdToolsPage = (params: PageParams): Promise<Response<PageSource<Resources>>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdTools/page", params);

/**活动列表 */
export const getKjzdActivity = (params: PageParams): Promise<Response<PageSource<Activity>>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdUsers/kjzdActivity/list", params);

/**评论列表 */
export const getKjzdUserComment = (params: PageParams): Promise<Response<PageSource<CommentProps>>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdUsers/kjzdUserComment/pageKjzdUserComment", params);

/**评论列表 */
export const getKjzdUserCommentUser = (params: PageParams): Promise<Response<PageSource<CommentProps>>> => Axios.post("/kjzdUser/kjzdUsers/pageKjzdUserComment/user", params);


/**粉丝、关注列表 */
export const getFans = (params: PageParams): Promise<Response<PageSource>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdUsersFans/list", params);

/**我的消息 -> 私信 */
export const pageUserLetter = (params: PageParams): Promise<Response<PageSource>> => Axios.post("/kjzdUser/kjzdUserLetter/pageUserLetter", params);

/**我的消息 -> 点赞 */
export const pageUserPraise = (params: PageParams): Promise<Response<PageSource>> => Axios.post("/kjzdUser/kjzdUserPraise/pageUserPraise", params);

/**我的消息 -> 系统 */
export const pageNewsContent = (params: PageParams): Promise<Response<PageSource<SystemMessageProps>>> => Axios.post("/kjzdUser/kjzdNewsContent/pageNewsContent", params);

/**我的消息 -> 各消息数量 */
export const pageMessageNum = (): Promise<Response> => Axios.post("/kjzdUser/kjzdUsers/countMessage");

/**粉丝关注列表 */
export const getKjzdUsersFans = (params: PageParams): Promise<Response<PageSource>> => Axios.post("/kjzdUser/kjzdUsersFans/list", params);

/**关注 */
export const follow = (params: any): Promise<Response> => Axios.post("/console/user/operate/follow", params);

/**取消关注 */
export const unFollow = (params: any): Promise<Response> => Axios.post("/console/user/operate/follow/cancel", params);

/**我参与的活动 */
export const getJoinActivities = (params: PageParams): Promise<Response<PageSource<Activity>>> => Axios.post("/kjzdUser/kjzdActivity/getJoinActivities", params);

/**我发布的活动 */
export const getKjzdActivityList = (params?: PageParams): Promise<Response<PageSource<Activity>>> => Axios.post("/kjzdUser/kjzdActivity/getPublishActivities", params);

/**活动平台 */
export const getKjzdActivityPlatformList = (): Promise<Response<ActivityPlatform[]>> => Axios.post("/kjzdUser/kjzdIgnore/listAllKjzdActivityPlatformName");

/**发布活动 */
export const publishActivity = (params: any): Promise<Response> => Axios.post("/kjzdUser/kjzdActivity/publishActivity", params);

/**修改活动 */
export const updateActivity = (params: any): Promise<Response<PageSource>> => Axios.post("/kjzdUser/kjzdActivity/updateActivity", params);

/**活动详情 */
export const getActivityInfo = (params: { id: string }): Promise<Response<PageSource>> => Axios.post("/kjzdUser/kjzdActivity/getActivityInfo", params);

/**申请成为主办方 */
export const addKjzdActivitySponsor = (params: AddSponsorParams): Promise<Response> => Axios.post("/kjzdUser/kjzdActivity/addKjzdActivitySponsor", params);

/**我的申请列表 */
export const getKjzdActivitySponsorList = (params: PageParams): Promise<Response<PageSource<Sponsor>>> => Axios.post("/kjzdUser/kjzdActivity/pageKjzdActivitySponsor", params);

/**我的收藏文章列表 */
export const collectPageKjzdArticle = (params: PageParams): Promise<Response<PageSource<Sponsor>>> => Axios.post("/kjzdUser/kjzdUserCollect/pageKjzdArticle", params);

/**我的收藏百科列表 */
export const collectPagekjzdEncyclopedia = (params: PageParams): Promise<Response<PageSource<Encyclopedia>>> => Axios.post("/kjzdUser/kjzdUserCollect/pagekjzdEncyclopedia", params);

/**我的收藏帖子列表 */
export const collectPagekjzdPost = (params: PageParams): Promise<Response<PageSource<Encyclopedia>>> => Axios.post("/kjzdUser/kjzdUserCollect/pagekjzdBbs", params);

/**我的收藏百科列表 */
export const collectPageKjzdTools = (params: PageParams): Promise<Response<PageSource<Resources>>> => Axios.post("/kjzdUser/kjzdUserCollect/pageKjzdTools", params);

/**我的收藏百科列表 */
export const collectPagekjzdActivity = (params: PageParams): Promise<Response<PageSource<Activity>>> => Axios.post("/kjzdUser/kjzdUserCollect/pagekjzdActivity", params);

/**获取动态信息 */
export const GetDynamicInfo = (params: PageParams): Promise<Response<PageSource>> => Axios.post("/kjzdUsers/kjzdActivity/list", params);

/**我发布的活动，状态数量 */
export const getPublishActivitiesCount = (): Promise<Response<ActivitiesCountItem[]>> => Axios.post("/kjzdUser/kjzdActivity/getPublishActivitiesCount", {});

/**我参与的活动状态数量统计 */
export const getJoinActivitiesCount = (): Promise<Response<ActivitiesCountItem[]>> => Axios.post("/kjzdUser/kjzdActivity/getJoinActivitiesCount", {});

/**我的创作、文章 */
export const pageKjzdArticle = (params: PageParams): Promise<Response<PageSource<Article>>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdUsers/kjzdArticle/getPage", params);

/**我的创作、文章数量 */
export const pageKjzdArticleCount = (params: PageParams): Promise<Response<ArticleCountInfo[]>> => Axios.post("/kjzdUser/kjzdIgnore/kjzdUsers/kjzdArticle/count", params);




/**我的创作,文章草稿列表 */
export const kjzdArticleDraftGetPage = (params: PageParams): Promise<Response<PageSource<Article>>> => Axios.post("/console/kjzdArticleDraft/getPage", params);
/**我的创作,文章草稿数量 */
export const kjzdArticleDraftGetCount = (params: PageParams): Promise<Response<PageSource<Article>>> => Axios.post("/console/kjzdArticleDraft/getCount", params);



/**我的创作 删除文章 */
export const kjzdArticleDelete = (data: { ids: string[] }): Promise<Response> => Axios.post("/console/kjzdArticle/delete", data);

/**我的创作 删除文章草稿 */
export const kjzdArticleDraftDelete = (data: { ids: string[] }): Promise<Response> => Axios.post("/console/kjzdArticleDraft/delete", data);

/**我的创作 获取文章草稿 */
export const kjzdArticleDraftGet = (id: string): Promise<Response> => Axios.get("/console/kjzdArticleDraft/get/" + id);

/**我的创作 获取文章平台 */
export const kjzdArticlePlatformListAll = (): Promise<Response<any[]>> => Axios.post("/console/kjzdArticlePlatform/listAll");

/**我的创作 获取百科 */
export const pagekjzdEncyclopediaDraft = (params: PageParams): Promise<Response<PageSource<Encyclopedia>>> => Axios.post("/kjzdUser/kjzdUserCreation/pagekjzdEncyclopediaDraft", params);

/**我的创作 获取百科各状态数量 */
export const pagekjzdEncyclopediaDraftCount = (): Promise<Response<BaikeCountInfo[]>> => Axios.get("/console/kjzdEncyclopediaDraft/user/count");


/**我的创作 获取百科详情 */
export const kjzdEncyclopediaDraftDetail = (id: string, token?: string): Promise<Response<Encyclopedia>> => Axios.post("/console/kjzdEncyclopediaDraft/detail", { id }, token ? { headers: { authorization: token && `Bearer ${token}` } } : {});








/**我的创作、百科 */
// export const pagekjzdEncyclopedia = (params: PageParams): Promise<Response<PageSource<Encyclopedia>>> => Axios.post("/kjzdUser/kjzdUserCreation/pagekjzdEncyclopedia", params);

/**专家详情(用户详情) */
export const getKjzdUser = (userId: Key, token?: string): Promise<Response<UserInfo>> => Axios.post("/kjzdUser/kjzdIgnore/getKjzdUser", { userId }, token ? { headers: { authorization: `Bearer ${token}` } } : {});

/**专家专栏分页 */
export const getExpert = (params: PageParams): Promise<Response<Expert[]>> => Axios.post("/kjzdUser/kjzdIgnore/getExpert", params);

/**修改用户信息 */
export const updateUserInfo = (data: UserInfo): Promise<Resources> => Axios.post("/kjzdUser/kjzdUsers/updateUserInfo", data);

/**修改密码 */
export const updatePassword = (data: any): Promise<Resources> => Axios.post("/kjzdUser/kjzdIgnore/findPwd", data);

/**修改电话 */
export const updateMobile = (data: any): Promise<Resources> => Axios.post("/kjzdUser/kjzdUsers/updateMobile", data);


/**发布评论 */
export const publishkUserComment = (params: CommentPublishProps): Promise<Resources> => Axios.post("/kjzdUser/kjzdUsers/publishkUserComment", params);

/**评论点赞-踩 */
export const commentPraise = (params: CommentPraiseProps): Promise<Resources> => Axios.post("/console/user/operate/comment/praise", params);

/**评论取消点赞-踩 */
export const commentCancelPraise = (params: CommentPraiseProps): Promise<Resources> => Axios.post("/console/user/operate/comment/cancel/praise", params);

/**微信扫码登入 */
export const getRedirectUri = (params: any): Promise<Resources> => Axios.get("/kjzdUser/wx/gzh/redirectUri/2", { params });




















