import Axios, { Response } from "@/apis";
import Adviser from "@/vo/Adviser";
import { Advert, Area, IndustryCategory, Menu, News, Server, ServerType, SnsConfig } from "@/vo/Basic";
import Encyclopedia, { ActivityPlatform } from "@/vo/Encyclopedia";
import { PageParams, PageSource, AdSiteKey } from "@/vo/PageParams";
import { Activity, ActivityApply, ActivityUser, Resources } from "@/vo/Users";
import { Key } from "react";

/**跨境百科资源分页 */
export const getEncyclopediaSource = (params?: PageParams): Promise<Response<PageSource<Encyclopedia>>> => Axios.get("/platforms/encyclopedias/get-encyclopedias", { params });

/**获取菜单 */
export const getMenu = (): Promise<Response<Menu[]>> => Axios.get("/kjzdUser/kjzdIgnore/getMenu");

/**广告 */
export const pageAd = (params: AdSiteKey): Promise<Response<PageSource<Advert>>> => Axios.post("/console/kjzd/activity/igonre/pageAd", params);

/**区域 */
export const dictArea = (): Promise<Response<Area[]>> => Axios.get("/console/kjzdConsole/dict/area");

/**服务分类 */
export const serviceType = (): Promise<Response<ServerType[]>> => Axios.get("/console/kjzdConsole/supplier/serviceType/list");

/**行业分类 */
export const getIndustryCategory = (): Promise<Response<IndustryCategory[]>> => Axios.get("/console/kjzd/report/igonre/kjzdIndustryReport/industry/category")

/**查询行业报告(分页) */
export const industryReportPage = (params: PageParams): Promise<Response<PageSource<Resources>>> => Axios.post("/console/kjzd/report/igonre/kjzdIndustryReport/list", params);

/**文章平台查询(列表) */
export const getArticlePlatformList = (params: any = {}): Promise<Response<ActivityPlatform[]>> => Axios.post("/console/kjzd/article/igonre/kjzdArticlePlatform/getList", params);

/**24小时快讯(分页) */
export const getNewsPage = (params: PageParams): Promise<Response<PageSource<News>>> => Axios.post("/console/kjzd/article/igonre/kjzdNews/getPage", params);

/**24小时快讯查询详情 */
export const getNews = (id: Key): Promise<Response<News>> => Axios.get(`/console/kjzd/article/igonre/get/news/${id}`);

/**72小时热榜 */
export const getNewsHot = (): Promise<Response<News[]>> => Axios.get("/console/kjzd/article/igonre/kjzdNews/hot");

/**活动峰会 */
export const getActivityPage = (params: PageParams): Promise<Response<PageSource<Activity>>> => Axios.post("/console/kjzd/activity/igonre/kjzdActivity/list", params);

/**活动峰会详情 */
export const getActivity = (id: Key, token?: string): Promise<Response<Activity>> => Axios.get(`/console/kjzd/activity/igonre/kjzdActivity/get/${id}`, token ? { headers: { authorization: token && `Bearer ${token}` } } : {});

/**活动峰会报名 */
export const activityApply = (params: any): Promise<Response> => Axios.post("/console/kjzdActivityApply/save", params);

/**收藏 */
export const operateCollect = (params: any): Promise<Response> => Axios.post("/console/user/operate/collect", params);

/**取消收藏 */
export const unoperateCollect = (params: any): Promise<Response> => Axios.post("/console/user/operate/collect/cancel", params);

/**举办活动用户相关信息 */
export const getActivityByUser = (userId: Key): Promise<Response<ActivityUser>> => Axios.post("/console/kjzd/activity/igonre/kjzdActivity/getByUser", { userId });

/**查询活动的报名信息 */
export const getActivityApplys = (activityId: Key): Promise<Response<ActivityApply[]>> => Axios.post("/console/kjzd/activity/igonre/getList", { activityId });

/**交流群 */
export const getSnsConfig = (params?: { size?: number }): Promise<Response<SnsConfig[]>> => Axios.post("/console/kjzdConsole/snsConfig", params);

/** 找服务 */
export const getServicePage = (params: PageParams): Promise<Response<PageSource<Server>>> => Axios.post("/console/kjzdConsole/supplier/service/list", params);

/**顾问分页 */
export const getAdviserIgonrePage = (): Promise<Response<PageSource<Adviser>>> => Axios.post("/console/kjzd/adviser/igonre/page", {});

/**顾问详情 */
export const getAdviserIgonre = (id: Key): Promise<Response<Adviser>> => Axios.post("/console/kjzd/adviser/igonre/get", { id });
