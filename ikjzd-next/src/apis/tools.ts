import Axios, { Response } from "@/apis";
import { Tools, ToolsPlatform, TooslDetails } from "@/vo/Tools";
import { PageParams, PageSource } from "@/vo/PageParams";
import { ActivityPlatform } from "@/vo/Encyclopedia";

/**资源活动列表 */
export const kjzdToolsListAll = (params: PageParams): Promise<Response<PageSource<Tools>>> => Axios.post("/console/kjzd/kjzdTools/igonre/pageKjzdTools", params);

/**活动平台 */
export const kjzdToolsPlatformListAll = (): Promise<Response<ToolsPlatform[]>> => Axios.post("/console/kjzd/kjzdTools/igonre/listToolsPlatform");

/**获取资源工具详情 */
export const getToolsDetail = (id: string, token?: string): Promise<Response<TooslDetails>> => Axios.post("/console/kjzd/kjzdTools/igonre/getKjzdTools", { id }, token ? { headers: { authorization: token && `Bearer ${token}` } } : {});

/**下载资源 */
export const downLoadTools = (params?: { id: string }): Promise<Response> => Axios.post("/console/kjzdTools/downloadKjzdTools", params);

/**根据平台id查询平台信息 */
export const getPlatformInfoById = (params?: { id: string| string[] }): Promise<Response<ActivityPlatform>> => Axios.get(`console/kjzd/article/igonre/kjzdArticlePlatform/get/${params?.id}`);