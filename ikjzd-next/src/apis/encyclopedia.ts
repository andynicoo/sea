import Axios, { Response } from "@/apis";
import { ArticleCategory } from "@/vo/Article";
import Encyclopedia, { ActivityPlatform, EncyclopediaCategory, EncyclopediaHot } from "@/vo/Encyclopedia";
import { PageParams, PageSource } from "@/vo/PageParams";
import { ContributionUser } from "@/vo/Users";
import { Key } from "react";

/**跨境百科资源分页 */
export const getEncyclopediaSource = (data?: PageParams): Promise<Response<PageSource<EncyclopediaCategory>>> => Axios.post("/console/kjzdConsole/encyclopedia/list/category", data);

/**百科贡献榜 */
export const getEncyclopediaContribution = (): Promise<Response<ContributionUser[]>> => Axios.post("/console/kjzdConsole/encyclopedia/contribution");

/**跨境百科分类列表 */
export const getEncyclopediaCategoryList = (): Promise<Response<EncyclopediaCategory[]>> => Axios.get("/console/kjzdConsole/category/list");

/**跨境百科详情 */
export const getEncyclopediaEncyclopediaDetail = (id: Key, token?: string): Promise<Response<Encyclopedia>> => Axios.post("/console/kjzdConsole/encyclopedia/detail", { id }, token ? { headers: { authorization: token && `Bearer ${token}` } } : {});

/**跨境百科词条新增、修改 */
export const kjzdConsoleSave = (data: Encyclopedia): Promise<Response> => Axios.post("/console/kjzdConsole/encyclopediaDraft/save", data);

/**活动平台 */
export const kjzdActivityPlatformListAll = (): Promise<Response<ActivityPlatform[]>> => Axios.post("/kjzdUser/kjzdIgnore/listAllKjzdActivityPlatformName");

/**文章分类 */
export const kjzdEncyclopediaCategoryListAll = (): Promise<Response<ArticleCategory[]>> => Axios.post("/console/kjzdArticleTag/getList", {});

/**跨境百科数量统计 */
export const getEncyclopediaStatistics = (): Promise<Response<{ totalEncyclopedia: number; totalUser: number }>> => Axios.get("/console/kjzdConsole/encyclopedia/statistics");

/**跨境百科置顶top列表 */
export const getEncyclopediaTop = (): Promise<Response<EncyclopediaCategory[]>> => Axios.get("/console/kjzdConsole/encyclopedia/list/top");

/**跨境百科热门词条列表 */
export const getEncyclopediaHots = (): Promise<Response<EncyclopediaHot[]>> => Axios.get("/console/kjzdConsole/encyclopedia/list/hot");